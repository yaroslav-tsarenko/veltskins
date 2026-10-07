import type { MotionEnv } from "../env";
import { crossfadeRender, drawRail, enter, onFirstReach, stagger } from "../enter";
import { MOTION_STAGGER } from "../tokens";

export function mountRooms(section: HTMLElement, env: MotionEnv): () => void {
  if (env.reduced) return () => {};
  const cleanups: (() => void)[] = [];
  const panel = section.querySelector<HTMLElement>("[data-lot] [data-render-box]");
  const rows = Array.from(section.querySelectorAll<HTMLElement>("[data-room-row]"));
  const head = section.querySelector<HTMLElement>(":scope > div > div:first-child");

  cleanups.push(
    onFirstReach(section, () => {
      const rail = section.querySelector<HTMLElement>("[data-rail]");
      if (rail) drawRail(rail);
      if (head) enter(head);
      if (panel) enter(panel, { delay: 180, distance: -12 });
      stagger(rows, MOTION_STAGGER.rows, { delay: 240, distance: 8 });
    }),
  );

  const image = panel?.querySelector<HTMLImageElement>("[data-render] img") ?? null;
  if (panel && image) {
    let previous = image.currentSrc || image.src;
    const observer = new MutationObserver(() => {
      const next = image.getAttribute("src") ?? "";
      if (!next || next === previous) return;
      const stale = image.cloneNode(true) as HTMLImageElement;
      stale.src = previous;
      crossfadeRender(panel, stale);
      previous = next;
    });
    observer.observe(image, { attributes: true, attributeFilter: ["src", "srcset"] });
    cleanups.push(() => observer.disconnect());
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}
