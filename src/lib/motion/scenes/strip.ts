import type { MotionEnv } from "../env";
import { armed, drawRail, enter } from "../enter";
import { addTick } from "../ticker";
import { MOTION_STAGGER } from "../tokens";

export function mountStrip(section: HTMLElement, env: MotionEnv): () => void {
  if (env.reduced) return () => {};
  const scroller = section.querySelector<HTMLElement>(".overflow-x-auto");
  const rail = section.querySelector<HTMLElement>("[data-rail]");
  const lots = Array.from(section.querySelectorAll<HTMLElement>("[data-lot]"));
  const cleanups: (() => void)[] = [];

  if (armed(section) && lots.length > 0) {
    let index = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          enter(entry.target, { delay: index * MOTION_STAGGER.lots });
          index += 1;
        }
        if (rail && index === 1) drawRail(rail);
      },
      { root: scroller ?? null, threshold: 0.15, rootMargin: "0px 0px -15% 0px" },
    );
    for (const lot of lots) io.observe(lot);
    cleanups.push(() => io.disconnect());
  }

  const ticks = rail ? Array.from(rail.querySelectorAll<HTMLElement>(".hook-tick")) : [];
  if (scroller && ticks.length > 0) {
    let release: (() => void) | null = null;
    const frame = () => {
      const shift = -scroller.scrollLeft * 0.08;
      for (const tick of ticks) tick.style.translate = `${shift.toFixed(2)}px 0`;
      release = null;
      return false;
    };
    const onScroll = () => {
      if (!release) release = addTick(frame);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      scroller.removeEventListener("scroll", onScroll);
      release?.();
      for (const tick of ticks) tick.style.removeProperty("translate");
    });
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}
