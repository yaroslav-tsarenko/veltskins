import type { MotionEnv } from "../env";
import { enter, onFirstReach, stagger } from "../enter";
import { cssEase, MOTION_DURATION, MOTION_STAGGER } from "../tokens";

function drawStripe(row: HTMLElement, delay: number) {
  const stripe = row.querySelector<HTMLElement>("[data-rarity]");
  if (!stripe || typeof stripe.animate !== "function") return;
  stripe.style.transformOrigin = "left center";
  stripe.animate([{ transform: "scaleX(0)" }, { transform: "none" }], {
    duration: MOTION_DURATION.panel,
    delay,
    easing: cssEase("hang"),
    fill: "backwards",
  });
}

export function mountRegister(section: HTMLElement, env: MotionEnv): () => void {
  if (env.reduced) return () => {};
  const cleanups: (() => void)[] = [];
  const list = section.querySelector<HTMLElement>("ul");
  const rows = list ? Array.from(list.children).filter((row): row is HTMLElement => row instanceof HTMLElement) : [];
  const head = section.querySelector<HTMLElement>(":scope > div > div:first-child");

  cleanups.push(
    onFirstReach(section, () => {
      if (head) enter(head);
      stagger(rows, MOTION_STAGGER.rows, { delay: 160, distance: 10 });
      rows.forEach((row, i) => drawStripe(row, 160 + i * MOTION_STAGGER.rows));
    }),
  );

  if (list?.parentElement) {
    const host = list.parentElement;
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (!(node instanceof HTMLElement) || node === list) continue;
          enter(node, { axis: "x", distance: 28, duration: MOTION_DURATION.ui, ease: "settle" });
        }
      }
    });
    observer.observe(host, { childList: true });
    cleanups.push(() => observer.disconnect());
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}
