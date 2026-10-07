import type { MotionEnv } from "../env";
import { addTick, clamp, spring, stepSpring, type Spring } from "../ticker";
import { MOTION_LIMITS } from "../tokens";

function body(lot: HTMLElement): HTMLElement | null {
  return lot.querySelector<HTMLElement>("[data-render-box]") ?? lot.querySelector<HTMLElement>("[data-lot-body]");
}

export function mountSway(root: Document, env: MotionEnv): () => void {
  if (env.reduced || !env.finePointer) return () => {};
  let hinge: HTMLElement | null = null;
  let limit: number = MOTION_LIMITS.swayCatalog;
  let left = 0;
  let width = 1;
  let measuredAt = 0;
  let pointerX = 0;
  let target = 0;
  let parked = true;
  let state: Spring = spring(0);
  let release: (() => void) | null = null;

  const letGo = () => {
    if (!hinge) return;
    hinge.style.removeProperty("rotate");
    hinge.removeAttribute("data-sway");
    hinge = null;
  };

  const frame = (dt: number, now: number) => {
    if (!hinge) {
      release = null;
      return false;
    }
    if (!parked) {
      if (now - measuredAt > 240) {
        const rect = hinge.getBoundingClientRect();
        left = rect.left;
        width = Math.max(1, rect.width);
        measuredAt = now;
      }
      target = clamp(((pointerX - left) / width - 0.5) * 2, -1, 1) * limit;
    } else {
      target = 0;
    }
    const settled = stepSpring(state, target, dt);
    hinge.style.rotate = `${state.value.toFixed(3)}deg`;
    if (settled && parked) {
      letGo();
      release = null;
      return false;
    }
    return true;
  };

  const wake = () => {
    if (!release) release = addTick(frame);
  };

  const park = () => {
    parked = true;
    if (hinge) wake();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const lot = (event.target as Element | null)?.closest<HTMLElement>("[data-lot]") ?? null;
    const next = lot ? body(lot) : null;
    if (!next) {
      park();
      return;
    }
    if (next !== hinge) {
      letGo();
      hinge = next;
      hinge.dataset.sway = "";
      state = spring(0);
      const rect = hinge.getBoundingClientRect();
      left = rect.left;
      width = Math.max(1, rect.width);
      measuredAt = event.timeStamp;
    }
    limit = lot?.dataset.variant === "anchor" ? MOTION_LIMITS.swayHero : MOTION_LIMITS.swayCatalog;
    pointerX = event.clientX;
    parked = false;
    wake();
  };

  root.addEventListener("pointermove", onPointerMove, { passive: true });
  root.documentElement.addEventListener("pointerleave", park);

  return () => {
    root.removeEventListener("pointermove", onPointerMove);
    root.documentElement.removeEventListener("pointerleave", park);
    release?.();
    release = null;
    letGo();
  };
}
