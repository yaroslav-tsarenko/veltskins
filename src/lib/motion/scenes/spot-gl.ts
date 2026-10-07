import { MOTION_DURATION, MOTION_LIMITS } from "../tokens";

const VERTEX = `
attribute vec2 a_pos;
uniform vec4 u_rect;
uniform vec2 u_canvas;
varying vec2 v_uv;
void main() {
  v_uv = a_pos;
  vec2 px = u_rect.xy + a_pos * u_rect.zw;
  vec2 clip = px / u_canvas * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_texel;
uniform highp vec4 u_rect;
uniform highp vec3 u_key;
uniform vec2 u_tilt;
uniform vec3 u_spot;
uniform float u_level;
uniform float u_ambient;
uniform float u_shade;
varying vec2 v_uv;

float luma(vec4 c) { return dot(c.rgb, vec3(0.299, 0.587, 0.114)); }

vec4 surfaceNormal(vec2 uv) {
  vec2 dx = vec2(u_texel.x, 0.0);
  vec2 dy = vec2(0.0, u_texel.y);
  float gx = clamp(luma(texture2D(u_tex, uv + dx)) - luma(texture2D(u_tex, uv - dx)), -0.3, 0.3);
  float gy = clamp(luma(texture2D(u_tex, uv + dy)) - luma(texture2D(u_tex, uv - dy)), -0.3, 0.3);
  vec2 r = u_texel * 12.0;
  float aR = texture2D(u_tex, uv + vec2(r.x, 0.0)).a;
  float aL = texture2D(u_tex, uv - vec2(r.x, 0.0)).a;
  float aD = texture2D(u_tex, uv + vec2(0.0, r.y)).a;
  float aU = texture2D(u_tex, uv - vec2(0.0, r.y)).a;
  float interior = min(min(aR, aL), min(aU, aD));
  return vec4(normalize(vec3(-(gx * 2.1 + (aR - aL) * 0.34), -(gy * 2.1 + (aD - aU) * 0.34), 1.0)), smoothstep(0.45, 0.95, interior));
}

vec3 turn(vec3 n, vec2 tilt) {
  float cp = cos(tilt.y);
  float sp = sin(tilt.y);
  n = vec3(n.x, n.y * cp - n.z * sp, n.y * sp + n.z * cp);
  float cy = cos(tilt.x);
  float sy = sin(tilt.x);
  return vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
}

void main() {
  vec4 c = texture2D(u_tex, v_uv);
  float body = smoothstep(0.42, 0.9, c.a);
  if (body <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec4 probe = surfaceNormal(v_uv);
  vec3 n = turn(probe.xyz, u_tilt);
  body *= probe.w;
  highp vec2 p = u_rect.xy + v_uv * u_rect.zw;
  vec3 L = normalize(vec3(u_key.xy - p, u_key.z));
  float facing = dot(n, L);
  float diffuse = max(facing, 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float nh = max(dot(n, H), 0.0);
  float gloss = pow(nh, 48.0) * 0.52 + pow(nh, 220.0) * 0.5;
  float rake = pow(diffuse, 1.7) * 0.6;
  float light = (rake + gloss) * u_level * body;
  float dim = (1.0 - smoothstep(0.0, 0.46, facing)) * u_shade * body;
  float a = clamp(dim * (1.0 - u_ambient), 0.0, 0.62);
  gl_FragColor = vec4(u_spot * light, a);
}`;

const SOFTWARE = /swiftshader|llvmpipe|software|basic render|mesa offscreen/i;

export interface SpotState {
  sx: number;
  sy: number;
  yaw: number;
  pitch: number;
  level: number;
}

export interface SpotLayer {
  canvas: HTMLCanvasElement;
  inner: boolean;
  draw: (state: SpotState) => void;
  dispose: () => void;
}

interface SpotOptions {
  forced: boolean;
  onLost?: () => void;
  onInvalidate?: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const yieldToMain = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0));

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => img.decode().then(() => resolve(img), () => resolve(img));
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function readSpotRgb(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--spot-rgb").trim().split(/[\s,]+/).map(Number);
  if (raw.length < 3 || raw.some((v) => !Number.isFinite(v))) return [1, 0.96, 0.89];
  return [raw[0] / 255, raw[1] / 255, raw[2] / 255];
}

export async function createSpotLayer(surface: HTMLElement, options: SpotOptions): Promise<SpotLayer | null> {
  const render = surface.querySelector<HTMLElement>("[data-render]");
  const source = render?.querySelector<HTMLImageElement>("img");
  if (!render || !source) return null;

  const existing = surface.querySelector<HTMLCanvasElement>('canvas[data-spot="webgl"]');
  const canvas = existing ?? document.createElement("canvas");
  if (!existing) {
    canvas.dataset.spot = "webgl";
    canvas.setAttribute("aria-hidden", "true");
  }
  const inner = existing ? render.contains(existing) : true;
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
  if (!gl) return null;

  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  const rendererName = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
  if (SOFTWARE.test(rendererName) && !options.forced) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  const loaded = await loadImage(source.currentSrc || source.src);
  if (!loaded || !surface.isConnected) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }
  await yieldToMain();
  if (!surface.isConnected) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  await yieldToMain();
  if (!surface.isConnected) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const uRect = gl.getUniformLocation(program, "u_rect");
  const uCanvas = gl.getUniformLocation(program, "u_canvas");
  const uTexel = gl.getUniformLocation(program, "u_texel");
  const uKey = gl.getUniformLocation(program, "u_key");
  const uTilt = gl.getUniformLocation(program, "u_tilt");
  const uSpot = gl.getUniformLocation(program, "u_spot");
  const uLevel = gl.getUniformLocation(program, "u_level");
  const uAmbient = gl.getUniformLocation(program, "u_ambient");
  const uShade = gl.getUniformLocation(program, "u_shade");
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loaded);
  } catch {
    gl.deleteTexture(texture);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    display: "block",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "2",
    opacity: "0",
    transition: `opacity ${MOTION_DURATION.reveal}ms var(--ease-std)`,
  });
  if (!existing) render.appendChild(canvas);

  let alive = true;
  let shown = false;
  let boxWidth = 1;
  let boxHeight = 1;
  let rect: [number, number, number, number] = [0, 0, 1, 1];
  let spot = readSpotRgb();
  let dark = document.documentElement.dataset.theme === "dark";

  const layout = () => {
    const host = inner ? render : surface;
    boxWidth = Math.max(1, canvas.clientWidth || host.offsetWidth);
    boxHeight = Math.max(1, canvas.clientHeight || host.offsetHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, MOTION_LIMITS.dprCap);
    canvas.width = Math.round(boxWidth * dpr);
    canvas.height = Math.round(boxHeight * dpr);
    const frameWidth = Math.max(1, render.offsetWidth);
    const frameHeight = Math.max(1, render.offsetHeight);
    const scale = Math.min(frameWidth / loaded.naturalWidth, frameHeight / loaded.naturalHeight);
    const w = loaded.naturalWidth * scale;
    const h = loaded.naturalHeight * scale;
    const ox = inner ? 0 : render.offsetLeft;
    const oy = inner ? 0 : render.offsetTop;
    rect = [ox + (frameWidth - w) / 2, oy + (frameHeight - h) / 2, w, h];
  };
  layout();

  const draw = (state: SpotState) => {
    if (!alive) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uCanvas, boxWidth, boxHeight);
    gl.uniform4f(uRect, rect[0], rect[1], rect[2], rect[3]);
    gl.uniform2f(uTexel, 1 / loaded.naturalWidth, 1 / loaded.naturalHeight);
    gl.uniform3f(uKey, state.sx * boxWidth, state.sy * boxHeight, boxHeight * 0.2);
    gl.uniform2f(uTilt, (state.yaw * Math.PI) / 180, (state.pitch * Math.PI) / 180);
    gl.uniform3f(uSpot, spot[0], spot[1], spot[2]);
    gl.uniform1f(uLevel, (dark ? 1.15 : 0.82) * state.level);
    gl.uniform1f(uAmbient, dark ? 0.34 : 0.56);
    gl.uniform1f(uShade, dark ? 0.3 : 0.17);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
    }
  };

  const resize = new ResizeObserver(() => {
    layout();
    options.onInvalidate?.();
  });
  resize.observe(inner ? render : surface);

  const theme = new MutationObserver(() => {
    spot = readSpotRgb();
    dark = document.documentElement.dataset.theme === "dark";
    options.onInvalidate?.();
  });
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const dispose = () => {
    if (!alive) return;
    alive = false;
    resize.disconnect();
    theme.disconnect();
    canvas.removeEventListener("webglcontextlost", onLost);
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (existing) {
      canvas.style.cssText = "";
      canvas.removeAttribute("style");
    } else {
      canvas.remove();
    }
  };

  function onLost(event: Event) {
    event.preventDefault();
    dispose();
    options.onLost?.();
  }
  canvas.addEventListener("webglcontextlost", onLost);

  return { canvas, inner, draw, dispose };
}
