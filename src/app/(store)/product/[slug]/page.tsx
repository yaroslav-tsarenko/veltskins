import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo/metadata";
import { publicBrand } from "@/lib/utils/supplier";
import { clampText, htmlToText } from "@/lib/utils/sanitize-html";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import { HungRender } from "@/components/product/HungRender";
import { LotSheet, type ExteriorOption, type MarkSwitch } from "@/components/product/LotSheet";
import { SkinDetailTabs } from "@/components/product/SkinDetailTabs";
import { ConditionVariants, type VariantRow } from "@/components/product/ConditionVariants";
import { productJsonLd } from "@/components/product/product-structured-data";
import { LotRail } from "@/components/skin/LotRail";
import { RecentlyViewed, RecordView } from "@/components/skin/RecentlyViewed";
import { SKIN_SELECT, getCategoryTree, loadSkinProducts, skinSummary } from "@/components/catalog/catalog-query";
import { EXTERIORS, raritySlug, skinTitle, weaponTypeDef } from "@/lib/skins/cs2";
import { MERCH } from "@/config/merchandising";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const getProduct = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      description: true,
      shortDescription: true,
      price: true,
      quantity: true,
      trackInventory: true,
      metaTitle: true,
      metaDescription: true,
      status: true,
      brand: true,
      gtin: true,
      ean: true,
      condition: true,
      createdAt: true,
      skin: { select: { ...SKIN_SELECT, marketHashName: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { id: true, url: true, alt: true } },
      categories: { select: { category: { select: { id: true, name: true, slug: true, parentId: true, isActive: true } } } },
    },
  });
  if (!product || product.status !== "ACTIVE") return null;
  return product;
});

type ProductRecord = NonNullable<Awaited<ReturnType<typeof getProduct>>>;

const LIVE = Prisma.sql`p."status" = 'ACTIVE'::"ProductStatus" AND (p."trackInventory" = false OR p."quantity" > 0)`;

function metaDescription(product: ProductRecord): string {
  const skin = product.skin;
  if (skin) {
    const ext = EXTERIORS.find((e) => e.code === skin.exterior);
    const parts = [skinTitle(skin), ext ? ext.label : "Not painted", skin.isStatTrak ? "StatTrak™" : null, skin.isSouvenir ? "Souvenir" : null].filter(Boolean).join(", ");
    return clampText(`${parts}. Delivered to your Steam account as a trade offer after payment.`, 160);
  }
  return clampText(htmlToText(product.metaDescription) || htmlToText(product.shortDescription) || product.name, 160);
}

async function categoryPath(product: ProductRecord) {
  const tree = await getCategoryTree();
  const linked = product.categories.map((c) => c.category).filter((c) => c.isActive && tree.byId.has(c.id));
  const leaf = linked.find((c) => c.parentId) ?? linked[0] ?? null;
  const chain: { id: string; name: string; slug: string }[] = [];
  let current = leaf ? tree.byId.get(leaf.id) ?? null : null;
  while (current) {
    chain.unshift({ id: current.id, name: current.name, slug: current.slug });
    current = current.parentId ? tree.byId.get(current.parentId) ?? null : null;
  }
  return chain;
}

async function ids(query: Prisma.Sql): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>(query);
  return rows.map((r) => r.id);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Skin not found", robots: { index: false, follow: true } };
  return pageMetadata({
    title: product.metaTitle || product.name,
    description: metaDescription(product),
    path: `/product/${product.slug}`,
    images: false,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const chain = await categoryPath(product);
  const leaf = chain[chain.length - 1] ?? null;
  const price = Number(product.price);
  const skin = product.skin;
  const available = !product.trackInventory || product.quantity > 0;
  const exclude = new Set<string>([product.id]);
  const notIn = () => Prisma.sql`AND p."id" NOT IN (${Prisma.join([...exclude])})`;

  const siblings = skin?.skinName
    ? await prisma.$queryRaw<{ id: string; slug: string; exterior: string | null; isStatTrak: boolean; price: number }[]>`
        SELECT p."id", p."slug", s."exterior", s."isStatTrak", p."price"::float AS price
        FROM "Product" p JOIN "Skin" s ON s."productId" = p."id"
        WHERE ${LIVE} AND s."weapon" = ${skin.weapon} AND s."skinName" = ${skin.skinName}
          AND s."isSouvenir" = ${skin.isSouvenir} AND s."phase" IS NOT DISTINCT FROM ${skin.phase}
        ORDER BY p."price" ASC`
    : [];

  const cheapest = (code: string | null, st: boolean) => siblings.find((s) => s.exterior === code && s.isStatTrak === st && s.id !== product.id) ?? null;
  const exteriors: ExteriorOption[] = skin?.exterior
    ? EXTERIORS.map((e) => {
        if (e.code === skin.exterior) return { code: e.code, slug: product.slug, price, current: true };
        const hit = cheapest(e.code, skin.isStatTrak);
        return { code: e.code, slug: hit?.slug ?? null, price: hit?.price ?? null, current: false };
      })
    : [];
  let markSwitch: MarkSwitch | null = null;
  if (skin && !skin.isSouvenir) {
    const flipped = cheapest(skin.exterior, !skin.isStatTrak) ?? siblings.find((s) => s.isStatTrak !== skin.isStatTrak) ?? null;
    if (flipped) {
      markSwitch = skin.isStatTrak ? { current: "stattrak", stattrak: product.slug, standard: flipped.slug } : { current: "standard", standard: product.slug, stattrak: flipped.slug };
    }
  }

  const variantIds = siblings.filter((s) => s.id !== product.id).slice(0, MERCH.siblings).map((s) => s.id);
  variantIds.forEach((id) => exclude.add(id));
  const variants = await loadSkinProducts(variantIds);
  const zoneIndex = (code: string | null | undefined) => EXTERIORS.findIndex((e) => e.code === code);
  const variantRows: VariantRow[] = variants
    .sort((a, b) => Number(a.skin?.isStatTrak) - Number(b.skin?.isStatTrak) || zoneIndex(a.skin?.exterior) - zoneIndex(b.skin?.exterior))
    .map((v) => ({ product: v }));

  const moreIds = skin
    ? await ids(Prisma.sql`
        SELECT id FROM (
          SELECT DISTINCT ON (s."skinName") p."id", p."price"
          FROM "Product" p JOIN "Skin" s ON s."productId" = p."id"
          WHERE ${LIVE} AND s."weapon" = ${skin.weapon} AND s."skinName" IS DISTINCT FROM ${skin.skinName} ${notIn()}
          ORDER BY s."skinName", p."price" DESC
        ) x ORDER BY x."price" DESC LIMIT ${MERCH.related}`)
    : [];

  const more = await loadSkinProducts(moreIds);

  const crumbs = [{ label: "Home", href: "/" }, { label: "Catalogue", href: "/catalog" }, ...chain.map((c) => ({ label: c.name, href: `/catalog/${c.slug}` })), { label: product.name }];
  const weaponCategory = chain.length > 1 ? chain[chain.length - 1] : null;
  const typeDef = skin ? weaponTypeDef(skin.weaponType) : null;

  const jsonLd = productJsonLd({
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: metaDescription(product),
    images: product.images.map((i) => i.url),
    brand: publicBrand(product.brand),
    ean: product.ean,
    gtin: product.gtin,
    price,
    available,
    condition: product.condition,
    category: chain.map((c) => c.name).join(" > ") || null,
    reviews: [],
  });

  const listing = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price,
    quantity: product.trackInventory ? product.quantity : undefined,
    images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
    category: leaf?.name ?? null,
    skin: skinSummary(product.skin),
  };

  return (
    <div className="mx-auto max-w-container px-gutter pb-28 lg:pb-24">
      <JsonLd data={jsonLd} />
      <RecordView id={product.id} />
      <Breadcrumbs items={crumbs} className="lg:hidden" withJsonLd={false} />

      <div data-product="" className="grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:pt-8">
        <div className="min-w-0 lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--header-height-compact)+24px)]">
          <HungRender src={product.images[0]?.url ?? null} alt={product.images[0]?.alt || product.name} rarity={raritySlug(skin?.rarity)} exterior={skin?.exterior ?? null} productId={product.id} />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <div>
            <LotSheet
              product={listing}
              exteriors={exteriors}
              markSwitch={markSwitch}
              weaponHref={weaponCategory ? `/catalog/${weaponCategory.slug}` : null}
              breadcrumbs={<Breadcrumbs items={crumbs} className="hidden pt-0 lg:block" />}
            />
          </div>
        </div>
      </div>

      {variantRows.length > 0 ? <ConditionVariants rows={variantRows} title={skin?.skinName ? `${skin.weapon} | ${skin.skinName} in other conditions` : "Other versions of this lot"} /> : null}

      <SkinDetailTabs skin={skinSummary(product.skin)} className="mt-16 lg:mt-24" />

      <div className="mt-20 flex flex-col gap-20">
        <LotRail
          id="more-weapon"
          title={`More ${skin?.weapon ?? typeDef?.label ?? ""} lots`}
          products={more}
          link={weaponCategory ? { href: `/catalog/${weaponCategory.slug}`, label: `All ${weaponCategory.name} lots` } : undefined}
        />
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
