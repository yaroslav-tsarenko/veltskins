import { cssEase, MOTION_DURATION, MOTION_STAGGER } from "./tokens";

const SETTLED = "settled";

export interface EnterOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  ease?: "hang" | "settle" | "std" | "inOut" | "outExpo";
  axis?: "y" | "x";
  fade?: boolean;
}

export function enter(el: Element, options: EnterOptions = {}): Animation | null {
  const { delay = 0, duration = MOTION_DURATION.reveal, distance = 14, ease = "hang", axis = "y", fade = true } = options;
  if (typeof el.animate !== "function") return null;
  const shift = axis === "y" ? `translateY(${-distance}px)` : `translateX(${distance}px)`;
  const from: Keyframe = { transform: shift };
  const to: Keyframe = { transform: "none" };
  if (fade) {
    from.opacity = 0;
    to.opacity = 1;
  }
  return el.animate([from, to], { duration, delay, easing: cssEase(ease), fill: "backwards" });
}

export function drawRail(rail: HTMLElement, delay = 0): Animation | null {
  if (typeof rail.animate !== "function") return null;
  rail.style.transformOrigin = "left center";
  return rail.animate([{ transform: "scaleX(0)" }, { transform: "none" }], {
    duration: 520,
    delay,
    easing: cssEase("hang"),
    fill: "backwards",
  });
}

export function stagger(nodes: Iterable<Element>, step = MOTION_STAGGER.rows, options: EnterOptions = {}): Animation[] {
  const out: Animation[] = [];
  let i = 0;
  for (const node of nodes) {
    const animation = enter(node, { ...options, delay: (options.delay ?? 0) + i * step });
    if (animation) out.push(animation);
    i += 1;
  }
  return out;
}

export function armed(section: HTMLElement): boolean {
  if (section.dataset.reveal === SETTLED) return false;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    section.dataset.reveal = SETTLED;
    return false;
  }
  return true;
}

export function onFirstReach(section: HTMLElement, play: () => void): () => void {
  if (!armed(section)) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      io.disconnect();
      section.dataset.reveal = SETTLED;
      play();
    },
    { rootMargin: "0px 0px -20% 0px" },
  );
  io.observe(section);
  return () => io.disconnect();
}

export function crossfadeRender(box: HTMLElement, previous: HTMLImageElement): void {
  if (typeof box.animate !== "function") return;
  const ghost = previous.cloneNode(true) as HTMLImageElement;
  ghost.removeAttribute("srcset");
  ghost.removeAttribute("sizes");
  ghost.src = previous.currentSrc || previous.src;
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
    zIndex: "3",
  });
  box.appendChild(ghost);
  const fade = ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: MOTION_DURATION.ui, easing: cssEase("std") });
  fade.finished.then(() => ghost.remove(), () => ghost.remove());
}
