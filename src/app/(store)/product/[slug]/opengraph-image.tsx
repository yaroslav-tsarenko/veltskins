import { cache } from "react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/brand";
import { STORE_POLICY } from "@/config/store-policy";
import { defaultLocale } from "@/i18n/config";
import { formatPrice } from "@/lib/utils/format-price";
import { OG_PALETTE as P, OG_SIZE, ogImageSource } from "@/lib/og/assets";
import { HungLot, Lockup, ogResponse, titleSize } from "@/lib/og/parts";
import { stripSupplierMentions } from "@/lib/utils/supplier";

export const revalidate = 3600;

type SlugParams = { slug: string } | Promise<{ slug: string }>;

const loadProduct = cache(async (slug: string) =>
  prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      status: true,
      price: true,
      sku: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
      categories: { select: { category: { select: { name: true, parentId: true, isActive: true } } } },
    },
  }),
);

export async function generateImageMetadata({ params }: { params: SlugParams }) {
  const { slug } = await params;
  const product = slug ? await loadProduct(slug) : null;
  const t = await getTranslations({ locale: defaultLocale, namespace: "seo" });
  const name = product?.status === "ACTIVE" ? stripSupplierMentions(product.name) : BRAND.tagline;
  return [{ id: "card", size: OG_SIZE, contentType: "image/png", alt: t("ogProductAlt", { name, brand: BRAND.name }) }];
}

export default async function Image({ params }: { params: SlugParams }) {
  const { slug } = await params;
  const product = await loadProduct(slug);

  const active = product?.status === "ACTIVE";
  const name = active ? stripSupplierMentions(product.name) : BRAND.tagline;
  const price = active ? Number(product.price) : null;
  const linked = active ? product.categories.map((c) => c.category).filter((c) => c.isActive) : [];
  const category = (linked.find((c) => c.parentId) ?? linked[0])?.name ?? null;
  const src = active ? await ogImageSource(product.images[0]?.url, 900) : null;
  const nameSize = titleSize(name, [[24, 64], [44, 54], [72, 46], [110, 40]]);

  return ogResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: P.wall, color: P.ink, padding: "48px 56px", gap: 56 }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <HungLot src={src} width={480} height={360} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
        <Lockup size={20} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {category ? (
            <div style={{ display: "flex", fontFamily: "Azeret Mono", fontWeight: 500, fontSize: 16, letterSpacing: 1.6, textTransform: "uppercase", color: P.inkMuted, marginBottom: 16 }}>
              {category}
            </div>
          ) : null}
          <div
            style={{
              display: "block",
              fontFamily: "Newsreader",
              fontWeight: 500,
              fontSize: nameSize,
              lineHeight: 1.1,
              color: P.ink,
              lineClamp: 4,
              overflow: "hidden",
              maxHeight: nameSize * 1.1 * 4 + 4,
            }}
          >
            {name}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {price != null && price > 0 ? (
            <div style={{ display: "flex", fontFamily: "Azeret Mono", fontWeight: 500, fontSize: 38, color: P.ink }}>{formatPrice(price, STORE_POLICY.currency)}</div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
          <div style={{ display: "flex", fontFamily: "Azeret Mono", fontWeight: 500, fontSize: 18, color: P.inkMuted }}>{BRAND.domain}</div>
        </div>
      </div>
    </div>,
    3600,
  );
}
