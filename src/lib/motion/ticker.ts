import { MOTION_SPRING } from "./tokens";

export type Tick = (dt: number, now: number) => boolean | void;

const subscribers = new Set<Tick>();
let frame = 0;
let last = 0;

function loop(now: number) {
  const dt = last ? Math.min(now - last, 64) : 16.7;
  last = now;
  for (const tick of Array.from(subscribers)) {
    if (tick(dt, now) === false) subscribers.delete(tick);
  }
  if (subscribers.size > 0) {
    frame = window.requestAnimationFrame(loop);
  } else {
    frame = 0;
    last = 0;
  }
}

export function addTick(tick: Tick): () => void {
  subscribers.add(tick);
  if (!frame) frame = window.requestAnimationFrame(loop);
  return () => {
    subscribers.delete(tick);
  };
}

export function lerpPerFrame(current: number, target: number, perFrame: number, dtMs: number): number {
  return current + (target - current) * (1 - Math.pow(1 - perFrame, dtMs / (1000 / 60)));
}

export interface Spring {
  value: number;
  velocity: number;
}

export function spring(value = 0): Spring {
  return { value, velocity: 0 };
}

export function stepSpring(s: Spring, target: number, dtMs: number): boolean {
  let remaining = dtMs / 1000;
  while (remaining > 0) {
    const h = Math.min(remaining, 1 / 120);
    const accel = MOTION_SPRING.stiffness * (target - s.value) - MOTION_SPRING.damping * s.velocity;
    s.velocity += accel * h;
    s.value += s.velocity * h;
    remaining -= h;
  }
  const settled = Math.abs(target - s.value) < 0.005 && Math.abs(s.velocity) < 0.01;
  if (settled) {
    s.value = target;
    s.velocity = 0;
  }
  return settled;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
