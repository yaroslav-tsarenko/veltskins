import { frozenTime, webglAllowed, onIdle, type MotionEnv } from "../env";
import { addTick, clamp, lerpPerFrame } from "../ticker";
import { MOTION_LIMITS, SPOT_POSE } from "../tokens";
import { createSpotLayer, type SpotLayer } from "./spot-gl";

const RAKE_X: [number, number] = [0.14, 0.46];
const RAKE_Y: [number, number] = [0.02, 0.2];
const GL_POSTER_LEVEL = "0.74";

export interface SpotController {
  setTilt: (yaw: number, pitch: number) => void;
  invalidate: () => void;
  layer: () => SpotLayer | null;
  dispose: () => void;
}

function span(range: [number, number], t: number): number {
  return range[0] + (range[1] - range[0]) * clamp(t, 0, 1);
}

function writePoster(surface: HTMLElement, sx: number, sy: number) {
  surface.style.setProperty("--sx", `${(sx * 100).toFixed(2)}%`);
  surface.style.setProperty("--sy", `${(sy * 100).toFixed(2)}%`);
}

function readPoster(surface: HTMLElement): { sx: number; sy: number } | null {
  const style = getComputedStyle(surface);
  const sx = Number.parseFloat(style.getPropertyValue("--sx"));
  const sy = Number.parseFloat(style.getPropertyValue("--sy"));
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return null;
  return { sx: sx / 100, sy: sy / 100 };
}

function sweeping(surface: HTMLElement): Animation[] {
  return surface.getAnimations({ subtree: false }).filter((animation) => animation.playState === "running");
}

export function createSpotController(surface: HTMLElement, env: MotionEnv): SpotController {
  const target: { sx: number; sy: number } = { sx: SPOT_POSE.rest.x, sy: SPOT_POSE.rest.y };
  const live: { sx: number; sy: number } = { sx: SPOT_POSE.rest.x, sy: SPOT_POSE.rest.y };
  const tilt = { yaw: 0, pitch: 0, liveYaw: 0, livePitch: 0 };
  let layer: SpotLayer | null = null;
  let release: (() => void) | null = null;
  let visible = true;
  let tracking = false;
  let disposed = false;
  let dirty = true;
  let sweep: Animation[] = sweeping(surface);

  const frozen = frozenTime();
  const follow = env.finePointer && frozen === null;
  if (frozen !== null) {
    for (const animation of surface.getAnimations({ subtree: false })) animation.cancel();
    writePoster(surface, SPOT_POSE.rest.x, SPOT_POSE.rest.y);
  }

  const frame = (dt: number) => {
    if (disposed) return false;
    if (sweep.length > 0 && !layer) sweep = [];
    if (sweep.length > 0) {
      sweep = sweep.filter((animation) => animation.playState === "running");
      const posed = readPoster(surface);
      if (posed) {
        live.sx = posed.sx;
        live.sy = posed.sy;
        target.sx = posed.sx;
        target.sy = posed.sy;
      }
      layer?.draw({ sx: live.sx, sy: live.sy, yaw: tilt.liveYaw, pitch: tilt.livePitch, level: 1 });
      if (sweep.length > 0) {
        if (visible) return true;
        release = null;
        return false;
      }
      if (follow) startTracking();
    }
    const nextX = lerpPerFrame(live.sx, target.sx, MOTION_LIMITS.spotLerp, dt);
    const nextY = lerpPerFrame(live.sy, target.sy, MOTION_LIMITS.spotLerp, dt);
    const nextYaw = lerpPerFrame(tilt.liveYaw, tilt.yaw, 0.18, dt);
    const nextPitch = lerpPerFrame(tilt.livePitch, tilt.pitch, 0.18, dt);
    const moved =
      Math.abs(nextX - live.sx) > 0.00008 ||
      Math.abs(nextY - live.sy) > 0.00008 ||
      Math.abs(nextYaw - tilt.liveYaw) > 0.004 ||
      Math.abs(nextPitch - tilt.livePitch) > 0.004;
    live.sx = nextX;
    live.sy = nextY;
    tilt.liveYaw = nextYaw;
    tilt.livePitch = nextPitch;
    if (!moved && !dirty) {
      release = null;
      return false;
    }
    dirty = false;
    if (tracking) writePoster(surface, live.sx, live.sy);
    layer?.draw({ sx: live.sx, sy: live.sy, yaw: tilt.liveYaw, pitch: tilt.livePitch, level: 1 });
    if (!visible) {
      release = null;
      return false;
    }
    return true;
  };

  const wake = () => {
    if (disposed || !visible) return;
    dirty = true;
    if (!release) release = addTick(frame);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !tracking) return;
    const rect = surface.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    target.sx = span(RAKE_X, (event.clientX - rect.left) / rect.width);
    target.sy = span(RAKE_Y, (event.clientY - rect.top) / rect.height);
    wake();
  };

  const onPointerLeave = () => {
    if (!tracking) return;
    target.sx = SPOT_POSE.rest.x;
    target.sy = SPOT_POSE.rest.y;
    wake();
  };

  const startTracking = () => {
    if (tracking || disposed) return;
    tracking = true;
    surface.addEventListener("pointermove", onPointerMove);
    surface.addEventListener("pointerleave", onPointerLeave);
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting) && !document.hidden;
      if (visible) wake();
    },
    { rootMargin: "150px" },
  );
  io.observe(surface);

  const onVisibility = () => {
    const rect = surface.getBoundingClientRect();
    visible = !document.hidden && rect.bottom > -150 && rect.top < window.innerHeight + 150;
    if (visible) wake();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const retirePoster = () => {
    surface.style.removeProperty("--spot-level");
    target.sx = SPOT_POSE.rest.x;
    target.sy = SPOT_POSE.rest.y;
    live.sx = target.sx;
    live.sy = target.sy;
    surface.style.removeProperty("--sx");
    surface.style.removeProperty("--sy");
  };

  const cancelIdle = onIdle(() => {
    if (disposed) return;
    void (async () => {
      if (follow && sweep.length === 0) startTracking();
      if (!webglAllowed(env)) return;
      const built = await createSpotLayer(surface, {
        forced: env.forcedSpot || frozen !== null,
        onLost: () => {
          layer = null;
          retirePoster();
        },
        onInvalidate: wake,
      });
      if (disposed || !built) {
        built?.dispose();
        return;
      }
      layer = built;
      surface.style.setProperty("--spot-level", GL_POSTER_LEVEL);
      if (frozen !== null) {
        built.draw({ sx: SPOT_POSE.rest.x, sy: SPOT_POSE.rest.y, yaw: 0, pitch: 0, level: 1 });
        return;
      }
      wake();
    })();
  }, 1400);

  return {
    setTilt: (yaw, pitch) => {
      tilt.yaw = yaw;
      tilt.pitch = pitch;
      wake();
    },
    invalidate: wake,
    layer: () => layer,
    dispose: () => {
      disposed = true;
      cancelIdle();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerleave", onPointerLeave);
      release?.();
      release = null;
      layer?.dispose();
      layer = null;
      retirePoster();
    },
  };
}
