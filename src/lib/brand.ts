export const BRAND = {
  name: "Veltskins",
  domain: "veltskins.com",
  tagline: "Counter-Strike 2 skins, catalogued and delivered by Steam trade offer",
} as const;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${BRAND.domain}`).replace(/\/+$/, "");
export const COMPANY_REGISTERED = true;
