export const MOTION_DURATION = {
  micro: 120,
  ui: 220,
  panel: 300,
  panelClose: 240,
  reveal: 760,
  reduced: 120,
  cartFlight: 460,
  spotSweep: 1800,
} as const;

export const MOTION_EASE = {
  hang: [0.22, 0.61, 0.21, 1],
  settle: [0.33, 1.02, 0.4, 1],
  std: [0.4, 0, 0.2, 1],
  inOut: [0.65, 0, 0.35, 1],
  outExpo: [0.16, 1, 0.3, 1],
} as const;

export type MotionEase = keyof typeof MOTION_EASE;

export function cssEase(name: MotionEase): string {
  return `cubic-bezier(${MOTION_EASE[name].join(", ")})`;
}

export const MOTION_SPRING = { stiffness: 180, damping: 26 } as const;

export const MOTION_DEPTH = [
  { pointer: 0, scroll: 0 },
  { pointer: 2, scroll: 0.03 },
  { pointer: 3, scroll: 0.05 },
  { pointer: 10, scroll: 0.1 },
  { pointer: 4, scroll: 0.05 },
] as const;

export const MOTION_STAGGER = { hooks: 70, lots: 90, rows: 40, words: 36 } as const;

export const MOTION_LIMITS = {
  swayCatalog: 1.2,
  swayHero: 2.4,
  inspectYaw: 22,
  inspectPitch: 9,
  inspectDragYaw: 0.25,
  inspectDragPitch: 0.2,
  inspectKeyStep: 5,
  spotLerp: 0.08,
  liftLabel: 2,
  castShorten: 0.8,
  cartGhost: 40,
  cartGhostOpacity: 0.9,
  dprCap: 1.5,
} as const;

export const SPOT_POSE = {
  rest: { x: 0.32, y: 0.08 },
  sweepFrom: { x: 0.08, y: 0.08 },
  sweepTo: { x: 0.32, y: 0.08 },
} as const;

export const MOTION_QUERY = {
  finePointer: "(hover: hover) and (pointer: fine)",
  coarsePointer: "(pointer: coarse)",
} as const;
