import { getTranslations } from "next-intl/server";
import { BRAND } from "@/lib/brand";
import { defaultLocale } from "@/i18n/config";
import { OG_PALETTE as P, OG_SIZE } from "@/lib/og/assets";
import { Lockup, Rail, ogResponse } from "@/lib/og/parts";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${BRAND.name}: ${BRAND.tagline}`;

export default async function Image() {
  const t = await getTranslations({ locale: defaultLocale, namespace: "seo" });

  return ogResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: P.wall, color: P.ink, padding: "64px 80px", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Rail width={1040} hooks={3} />
        <div
          style={{
            display: "block",
            marginTop: 56,
            maxWidth: 940,
            fontFamily: "Newsreader",
            fontWeight: 600,
            fontSize: 86,
            lineHeight: 1.0,
            letterSpacing: -1.8,
            color: P.ink,
          }}
        >
          Every skin hung, labelled and priced.
        </div>
        <div style={{ display: "flex", marginTop: 28, maxWidth: 820, fontFamily: "Instrument Sans", fontSize: 28, lineHeight: 1.4, color: P.inkMuted }}>{t("siteDescription")}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Lockup size={26} />
        <div style={{ display: "flex", fontFamily: "Azeret Mono", fontWeight: 500, fontSize: 20, color: P.inkMuted }}>{BRAND.domain}</div>
      </div>
    </div>,
  );
}
