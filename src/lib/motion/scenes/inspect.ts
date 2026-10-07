import type { MotionEnv } from "../env";
import { clamp } from "../ticker";
import { MOTION_LIMITS } from "../tokens";
import { createSpotController } from "./spot";

const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function mountInspect(scene: HTMLElement, env: MotionEnv): () => void {
  const surface = scene.querySelector<HTMLElement>("[data-spot-surface]");
  if (!surface) return () => {};
  const render = surface.querySelector<HTMLElement>("[data-render]");
  const spot = createSpotController(surface, env);
  const pose = { yaw: 0, pitch: 0 };
  let drag: { x: number; y: number; yaw: number; pitch: number; id: number } | null = null;

  const faces = () => {
    const nodes: HTMLElement[] = [];
    if (render) nodes.push(render);
    const built = spot.layer();
    if (built && !built.inner) nodes.push(built.canvas);
    return nodes;
  };

  const apply = () => {
    const flat = pose.yaw === 0 && pose.pitch === 0;
    for (const node of faces()) {
      if (flat) {
        node.style.removeProperty("transform");
        node.style.removeProperty("transform-origin");
        continue;
      }
      node.style.transformOrigin = "center";
      node.style.transform = `perspective(1400px) rotateY(${pose.yaw.toFixed(2)}deg) rotateX(${(-pose.pitch).toFixed(2)}deg)`;
    }
    spot.setTilt(pose.yaw, pose.pitch);
  };

  const turn = (yaw: number, pitch: number) => {
    pose.yaw = clamp(yaw, -MOTION_LIMITS.inspectYaw, MOTION_LIMITS.inspectYaw);
    pose.pitch = clamp(pitch, -MOTION_LIMITS.inspectPitch, MOTION_LIMITS.inspectPitch);
    apply();
  };

  const rotating = () => scene.dataset.rotate === "on" && !env.reduced;

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !rotating() || !env.finePointer) return;
    event.preventDefault();
    scene.focus({ preventScroll: true });
    drag = { x: event.clientX, y: event.clientY, yaw: pose.yaw, pitch: pose.pitch, id: event.pointerId };
    scene.dataset.dragging = "";
    scene.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    turn(drag.yaw + (event.clientX - drag.x) * MOTION_LIMITS.inspectDragYaw, drag.pitch + (event.clientY - drag.y) * MOTION_LIMITS.inspectDragPitch);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    if (scene.hasPointerCapture(drag.id)) scene.releasePointerCapture(drag.id);
    drag = null;
    delete scene.dataset.dragging;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const step = KEYS[event.key];
    if (!step || !rotating()) return;
    event.preventDefault();
    turn(pose.yaw + step[0] * MOTION_LIMITS.inspectKeyStep, pose.pitch + step[1] * MOTION_LIMITS.inspectKeyStep);
  };

  let view = scene.dataset.view ?? "";
  const watch = new MutationObserver(() => {
    const next = scene.dataset.view ?? "";
    if (next === view) return;
    view = next;
    turn(0, 0);
  });
  watch.observe(scene, { attributes: true, attributeFilter: ["data-view", "data-rotate"] });

  scene.addEventListener("pointerdown", onPointerDown);
  scene.addEventListener("pointermove", onPointerMove);
  scene.addEventListener("pointerup", onPointerUp);
  scene.addEventListener("pointercancel", onPointerUp);
  scene.addEventListener("keydown", onKeyDown);

  return () => {
    watch.disconnect();
    scene.removeEventListener("pointerdown", onPointerDown);
    scene.removeEventListener("pointermove", onPointerMove);
    scene.removeEventListener("pointerup", onPointerUp);
    scene.removeEventListener("pointercancel", onPointerUp);
    scene.removeEventListener("keydown", onKeyDown);
    delete scene.dataset.dragging;
    pose.yaw = 0;
    pose.pitch = 0;
    for (const node of faces()) {
      node.style.removeProperty("transform");
      node.style.removeProperty("transform-origin");
    }
    spot.dispose();
  };
}
