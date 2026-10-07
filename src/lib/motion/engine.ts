import { readMotionEnv, type MotionEnv } from "./env";
import { mountCondition } from "./scenes/condition";
import { mountHang } from "./scenes/hang";
import { mountInspect } from "./scenes/inspect";
import { mountRegister } from "./scenes/register";
import { mountReveal } from "./scenes/reveal";
import { mountRooms } from "./scenes/rooms";
import { mountStrip } from "./scenes/strip";
import { mountSway } from "./scenes/sway";

interface Scene {
  selector: string;
  mount: (el: HTMLElement, env: MotionEnv) => () => void;
}

const SCENES: Scene[] = [
  { selector: '[data-scene="hang"]', mount: mountHang },
  { selector: '[data-scene="inspect"]', mount: mountInspect },
  { selector: '[data-scene="strip"]', mount: mountStrip },
  { selector: '[data-scene="rooms"]', mount: mountRooms },
  { selector: '[data-scene="register"]', mount: mountRegister },
  { selector: '[data-scene="condition"]', mount: mountCondition },
  { selector: '[data-scene="marks"], [data-scene="not-found"]', mount: mountReveal },
];

const yieldToMain = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0));

export function mountMotion(root: Document): () => void {
  const env = readMotionEnv();
  const cleanups: (() => void)[] = [];
  let cancelled = false;
  if (env.reduced) return () => {};

  cleanups.push(mountSway(root, env));

  (async () => {
    for (const scene of SCENES) {
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(scene.selector));
      if (nodes.length === 0) continue;
      await yieldToMain();
      if (cancelled) return;
      for (const node of nodes) cleanups.push(scene.mount(node, env));
    }
  })();

  return () => {
    cancelled = true;
    for (const cleanup of cleanups.reverse()) cleanup();
    cleanups.length = 0;
  };
}
