import type { MotionEnv } from "../env";
import { mountDepth } from "../depth";
import { createSpotController } from "./spot";

export function mountHang(section: HTMLElement, env: MotionEnv): () => void {
  const cleanups: (() => void)[] = [];
  const surface = section.querySelector<HTMLElement>("[data-spot-surface]");
  if (surface) {
    const spot = createSpotController(surface, env);
    cleanups.push(spot.dispose);
  }
  if (env.desktop && !env.coarsePointer) cleanups.push(mountDepth(section, { pointer: env.finePointer }));
  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}
