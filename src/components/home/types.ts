import type { SkinProduct } from "@/components/skin/Lot";
import type { RaritySlug } from "@/lib/skins/cs2";

export interface HomeWeaponType {
  key: string;
  name: string;
  count: number;
  minPrice: number | null;
  render: SkinProduct | null;
}

export interface HomeRarityTier {
  slug: RaritySlug;
  key: string;
  label: string;
  count: number;
  minPrice: number | null;
  strip: SkinProduct[];
}

export interface HomePriceBand {
  key: string;
  min: number | null;
  max: number | null;
  total: number;
  products: SkinProduct[];
}

export interface HomeData {
  totalProducts: number;
  anchor: SkinProduct | null;
  hang: SkinProduct[];
  today: SkinProduct[];
  types: HomeWeaponType[];
  bands: HomePriceBand[];
  rarities: HomeRarityTier[];
  condition: { code: string; count: number; product: SkinProduct | null }[];
  stattrak: { count: number; products: SkinProduct[] };
  souvenir: { count: number; products: SkinProduct[] };
}
