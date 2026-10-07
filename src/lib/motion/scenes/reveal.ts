import type { MotionEnv } from "../env";
import { drawRail, onFirstReach, stagger } from "../enter";
import { MOTION_STAGGER } from "../tokens";

function expand(node: HTMLElement): HTMLElement[] {
  const children = Array.from(node.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
  if (node.className.includes("grid") && children.length > 1) return children;
  return [node];
}

function blocks(section: HTMLElement): HTMLElement[] {
  const inner = section.querySelector<HTMLElement>(":scope > div") ?? section;
  const direct = Array.from(inner.children).filter((child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute("data-rail"));
  if (direct.length === 0) return [inner];
  return direct.flatMap(expand);
}

export function mountReveal(section: HTMLElement, env: MotionEnv): () => void {
  if (env.reduced) return () => {};
  return onFirstReach(section, () => {
    const rails = section.querySelectorAll<HTMLElement>("[data-rail]");
    for (const rail of rails) drawRail(rail);
    stagger(blocks(section), MOTION_STAGGER.rows, { delay: rails.length > 0 ? 180 : 0 });
  });
}
