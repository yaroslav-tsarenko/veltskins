import { addTick, clamp, lerpPerFrame } from "./ticker";
import { MOTION_DEPTH } from "./tokens";

const TRAVEL = 240;

export interface DepthOptions {
  pointer?: boolean;
}

interface Band {
  nodes: HTMLElement[];
  pointer: number;
  scroll: number;
}

function wireHolders(section: HTMLElement): HTMLElement[] {
  const holders = new Set<HTMLElement>();
  for (const wire of section.querySelectorAll<HTMLElement>(".wire")) {
    const holder = wire.parentElement;
    if (holder instanceof HTMLElement) holders.add(holder);
  }
  return Array.from(holders);
}

export function mountDepth(section: HTMLElement, options: DepthOptions = {}): () => void {
  const bands: Band[] = [
    { nodes: Array.from(section.querySelectorAll<HTMLElement>("[data-rail]")), ...MOTION_DEPTH[1] },
    { nodes: wireHolders(section), ...MOTION_DEPTH[2] },
    { nodes: Array.from(section.querySelectorAll<HTMLElement>("[data-render]")), ...MOTION_DEPTH[3] },
    { nodes: Array.from(section.querySelectorAll<HTMLElement>(".wall-label")), ...MOTION_DEPTH[4] },
  ].filter((band) => band.nodes.length > 0);
  if (bands.length === 0) return () => {};

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let visible = false;
  let release: (() => void) | null = null;
  let written = false;

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = section.getBoundingClientRect();
    pointer.tx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
    pointer.ty = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
  };
  const onLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
  };

  const frame = (dt: number) => {
    if (!visible) {
      if (written) {
        for (const band of bands) for (const node of band.nodes) node.style.removeProperty("translate");
        written = false;
      }
      release = null;
      return false;
    }
    pointer.x = lerpPerFrame(pointer.x, pointer.tx, 0.12, dt);
    pointer.y = lerpPerFrame(pointer.y, pointer.ty, 0.12, dt);
    const rect = section.getBoundingClientRect();
    const span = (window.innerHeight + rect.height) / 2;
    const centre = rect.top + rect.height / 2 - window.innerHeight / 2;
    const t = clamp(centre / span, -1, 1);
    for (const band of bands) {
      const y = -t * band.scroll * TRAVEL + (options.pointer ? pointer.y * band.pointer * 0.5 : 0);
      const x = options.pointer ? pointer.x * band.pointer : 0;
      const value = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      for (const node of band.nodes) node.style.translate = value;
    }
    written = true;
    return true;
  };

  const start = () => {
    if (release) return;
    release = addTick(frame);
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting) && !document.hidden;
      if (visible) start();
    },
    { rootMargin: "120px" },
  );
  io.observe(section);

  const onVisibility = () => {
    if (document.hidden) {
      visible = false;
      return;
    }
    const rect = section.getBoundingClientRect();
    visible = rect.bottom > -120 && rect.top < window.innerHeight + 120;
    if (visible) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  if (options.pointer) {
    section.addEventListener("pointermove", onPointer);
    section.addEventListener("pointerleave", onLeave);
  }

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    section.removeEventListener("pointermove", onPointer);
    section.removeEventListener("pointerleave", onLeave);
    visible = false;
    release?.();
    release = null;
    for (const band of bands) for (const node of band.nodes) node.style.removeProperty("translate");
  };
}
