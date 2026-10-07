import { WEAPON_TYPES } from "@/lib/skins/cs2";

export interface NavCategory {
  slug: string;
  name: string;
  short: string;
}

const TYPE_ORDER = ["knives", "gloves", "rifles", "pistols", "sniper-rifles", "smgs", "shotguns", "machine-guns"];

export const NAV_CATEGORIES: NavCategory[] = TYPE_ORDER.map((slug) => {
  const type = WEAPON_TYPES.find((t) => t.key === slug);
  return { slug, name: type?.label ?? slug, short: type?.label ?? slug };
});

export const FASCIA_LINKS = ["knives", "gloves", "rifles", "pistols", "sniper-rifles"];

export const RIG_LINKS = FASCIA_LINKS;

export const INDEX_TYPES = TYPE_ORDER;

export function navCategory(slug: string): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.slug === slug);
}

export const CATALOGUE_LINKS: { href: string; label: string }[] = [
  ...NAV_CATEGORIES.map((c) => ({ href: `/catalog/${c.slug}`, label: c.name })),
  { href: "/catalog", label: "All lots" },
];

export const ORDER_LINKS: { href: string; label: string }[] = [
  { href: "/how-it-works", label: "How delivery works" },
  { href: "/account/orders", label: "My purchases" },
  { href: "/account/steam", label: "Trade URL" },
  { href: "/cart", label: "Cart" },
];

export const HELP_LINKS: { href: string; label: string }[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
  { href: "/policies/returns", label: "Refunds" },
  { href: "/policies/payment", label: "Payment" },
];

export const POLICY_LINKS = [
  { href: "/policies/terms", label: "Terms & conditions" },
  { href: "/policies/privacy", label: "Privacy policy" },
  { href: "/policies/cookies", label: "Cookie policy" },
  { href: "/policies", label: "All policies" },
];
