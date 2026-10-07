import type { MotionEnv } from "../env";
import { enter, onFirstReach, stagger } from "../enter";
import { MOTION_STAGGER } from "../tokens";

export function mountCondition(section: HTMLElement, env: MotionEnv): () => void {
  if (env.reduced) return () => {};
  const grid = section.querySelector<HTMLElement>(".grid");
  const cells = grid ? Array.from(grid.children).filter((cell): cell is HTMLElement => cell instanceof HTMLElement) : [];
  const head = Array.from(section.querySelectorAll<HTMLElement>(":scope > div > :not(.grid)"));

  return onFirstReach(section, () => {
    stagger(head, MOTION_STAGGER.rows, { distance: 10 });
    cells.forEach((cell, i) => {
      const delay = 200 + i * MOTION_STAGGER.lots;
      const first = cell.firstElementChild;
      if (first) enter(first, { delay, distance: 10 });
      const lot = cell.querySelector<HTMLElement>("[data-lot]");
      if (lot) enter(lot, { delay: delay + 40 });
    });
  });
}
