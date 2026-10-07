import { catalogConfig } from "./catalog";

export interface PriceBand {
  key: string;
  min: number | null;
  max: number | null;
}

const EDGES = catalogConfig.pricing.bands;
const LOW = EDGES[1];
const MID = EDGES[2];
const HIGH = EDGES[3];

export const PRICE_BANDS: PriceBand[] = [
  { key: `under-${LOW}`, min: null, max: LOW },
  { key: `${LOW}-${MID}`, min: LOW, max: MID },
  { key: `${MID}-${HIGH}`, min: MID, max: HIGH },
  { key: `${HIGH}-up`, min: HIGH, max: null },
];

export const TODAY_BAND = { min: LOW, max: MID };

export const HANG_BAND = { min: LOW, max: HIGH };

export const MERCH = {
  bandItems: 4,
  bandMinimum: 3,
  todayLots: 8,
  hangLots: 4,
  registerStrip: 3,
  stattrak: 3,
  souvenir: 2,
  related: 4,
  siblings: 12,
  pairsTolerance: 0.4,
  recentlyViewed: 8,
} as const;
