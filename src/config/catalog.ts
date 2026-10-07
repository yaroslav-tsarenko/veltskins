import type { WeaponTypeKey } from "@/lib/skins/cs2";

export interface WeaponTypeQuota {
  type: WeaponTypeKey;
  cap: number;
}

export interface CatalogConfig {
  appId: number;
  target: { min: number; max: number };
  quotas: WeaponTypeQuota[];
  pricing: {
    margin: number;
    minMarginAbs: number;
    priceTolerance: number;
    minPrice: number;
    maxPrice: number;
    maxCostOverReference: number;
    bands: number[];
  };
  include: {
    statTrak: boolean;
    souvenir: boolean;
    vanillaStar: boolean;
    minStock: number;
  };
  selection: {
    keepExisting: boolean;
    maxVariantsPerSkin: number;
  };
  images: {
    hosting: "steam";
    size: string;
  };
  sync: {
    chunkSize: number;
  };
}

export const catalogConfig: CatalogConfig = {
  appId: 730,
  target: { min: 3000, max: 5000 },
  quotas: [
    { type: "knives", cap: 700 },
    { type: "pistols", cap: 900 },
    { type: "smgs", cap: 700 },
    { type: "rifles", cap: 620 },
    { type: "sniper-rifles", cap: 360 },
    { type: "shotguns", cap: 260 },
    { type: "machine-guns", cap: 100 },
    { type: "gloves", cap: 300 },
  ],
  pricing: {
    margin: 0.085,
    minMarginAbs: 0.15,
    priceTolerance: 0.04,
    minPrice: 1,
    maxPrice: 2400,
    maxCostOverReference: 2.2,
    bands: [5, 25, 120, 600],
  },
  include: {
    statTrak: true,
    souvenir: true,
    vanillaStar: true,
    minStock: 1,
  },
  selection: {
    keepExisting: true,
    maxVariantsPerSkin: 6,
  },
  images: {
    hosting: "steam",
    size: "360fx360f",
  },
  sync: {
    chunkSize: 400,
  },
};

export function quotaTotal(): number {
  return catalogConfig.quotas.reduce((sum, q) => sum + q.cap, 0);
}

export type ProductFeedId = "google" | "facebook" | "generic";

export const PRODUCT_FEEDS: Record<ProductFeedId, { enabled: boolean; reason: string }> = {
  google: {
    enabled: false,
    reason: "Off: Google Shopping listings are built for goods that ship to an address. In-game items delivered by Steam trade offer are commonly disapproved, and repeated disapprovals can suspend the Merchant Center account.",
  },
  facebook: {
    enabled: false,
    reason: "Off: Meta's commerce policies do not allow digital products in catalogues and shops.",
  },
  generic: {
    enabled: false,
    reason: "Off: no partner consumes this feed yet. Turn it on in src/config/catalog.ts when one does.",
  },
};

export const ANY_PRODUCT_FEED_ENABLED = Object.values(PRODUCT_FEEDS).some((feed) => feed.enabled);
