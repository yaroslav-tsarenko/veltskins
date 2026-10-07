import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EXTERIORS, RARITIES, WEAPON_TYPES, raritySlug } from "@/lib/skins/cs2";
import { loadSkinProducts } from "@/components/catalog/catalog-query";
import { HANG_BAND, MERCH, PRICE_BANDS, TODAY_BAND } from "@/config/merchandising";
import type { HomeData, HomeRarityTier } from "./types";

interface IdRow {
  id: string;
}

const LIVE = Prisma.sql`p."status" = 'ACTIVE'::"ProductStatus" AND (p."trackInventory" = false OR p."quantity" > 0)`;
const HAS_RENDER = Prisma.sql`EXISTS (SELECT 1 FROM "ProductImage" i WHERE i."productId" = p."id")`;
const ANCHOR_TIERS = ["classified", "covert", "extraordinary", "contraband"];

function notIn(ids: Set<string>) {
  return ids.size ? Prisma.sql`AND p."id" NOT IN (${Prisma.join([...ids])})` : Prisma.empty;
}

export function dayOfYear(now = new Date()): number {
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((today - start) / 86400000);
}

function rotate<T>(candidates: T[], offset = 0): T | null {
  if (candidates.length === 0) return null;
  return candidates[(dayOfYear() + offset) % candidates.length];
}

export async function getHomeData(): Promise<HomeData> {
  const claimed = new Set<string>();
  const claim = (ids: (string | null)[]) => ids.forEach((id) => id && claimed.add(id));

  const [typeRows, rarityRows, totals, markCounts, exteriorRows] = await Promise.all([
    prisma.$queryRaw<{ weaponType: string; count: number; min: number }[]>`
      SELECT s."weaponType", COUNT(*)::int AS count, MIN(p."price")::float AS min
      FROM "Skin" s JOIN "Product" p ON p."id" = s."productId"
      WHERE ${LIVE}
      GROUP BY s."weaponType"`,
    prisma.$queryRaw<{ rarity: string; count: number; min: number }[]>`
      SELECT s."rarity", COUNT(*)::int AS count, MIN(p."price")::float AS min
      FROM "Skin" s JOIN "Product" p ON p."id" = s."productId"
      WHERE ${LIVE}
      GROUP BY s."rarity"`,
    prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "Product" p WHERE ${LIVE}`,
    prisma.$queryRaw<{ stattrak: number; souvenir: number }[]>`
      SELECT COUNT(*) FILTER (WHERE s."isStatTrak")::int AS stattrak, COUNT(*) FILTER (WHERE s."isSouvenir")::int AS souvenir
      FROM "Skin" s JOIN "Product" p ON p."id" = s."productId"
      WHERE ${LIVE}`,
    prisma.$queryRaw<{ exterior: string; count: number }[]>`
      SELECT s."exterior", COUNT(*)::int AS count
      FROM "Skin" s JOIN "Product" p ON p."id" = s."productId"
      WHERE ${LIVE} AND s."exterior" IS NOT NULL
      GROUP BY s."exterior"`,
  ]);

  const anchorCandidates = await prisma.$queryRaw<IdRow[]>`
    SELECT p."id" FROM "Product" p JOIN "Skin" s ON s."productId" = p."id"
    WHERE ${LIVE} AND ${HAS_RENDER} AND s."rarity" IN (${Prisma.join(ANCHOR_TIERS)})
    ORDER BY p."sku" ASC
    LIMIT 400`;
  const anchorId = rotate(anchorCandidates.map((r) => r.id));
  claim([anchorId]);

  const hangTypes = WEAPON_TYPES.filter((t) => (typeRows.find((r) => r.weaponType === t.key)?.count ?? 0) > 0)
    .map((t) => t.key)
    .slice(0, MERCH.hangLots * 2);
  const hangIds: string[] = [];
  for (const [index, type] of hangTypes.entries()) {
    if (hangIds.length >= MERCH.hangLots) break;
    const rows = await prisma.$queryRaw<IdRow[]>`
      SELECT p."id" FROM "Product" p JOIN "Skin" s ON s."productId" = p."id"
      WHERE ${LIVE} AND ${HAS_RENDER} AND s."weaponType" = ${type}
        AND p."price" >= ${HANG_BAND.min} AND p."price" < ${HANG_BAND.max} ${notIn(claimed)}
      ORDER BY p."sku" ASC
      LIMIT 120`;
    const pick = rotate(rows.map((r) => r.id), index * 7);
    if (pick) {
      hangIds.push(pick);
      claim([pick]);
    }
  }

  const todayRows = await prisma.$queryRaw<IdRow[]>`
    SELECT p."id" FROM "Product" p
    WHERE ${LIVE} AND ${HAS_RENDER} AND p."price" >= ${TODAY_BAND.min} AND p."price" < ${TODAY_BAND.max} ${notIn(claimed)}
    ORDER BY p."createdAt" DESC, p."sku" ASC
    LIMIT ${MERCH.todayLots}`;
  claim(todayRows.map((r) => r.id));

  const typeStats = new Map(typeRows.map((r) => [r.weaponType, r]));
  const roomRenders = await prisma.$queryRaw<{ weaponType: string; id: string }[]>`
    SELECT DISTINCT ON (s."weaponType") s."weaponType", p."id"
    FROM "Skin" s JOIN "Product" p ON p."id" = s."productId"
    WHERE ${LIVE} AND ${HAS_RENDER} ${notIn(claimed)}
    ORDER BY s."weaponType", p."price" DESC`;
  claim(roomRenders.map((r) => r.id));
  const roomProducts = await loadSkinProducts(roomRenders.map((r) => r.id));
  const roomByType = new Map(roomRenders.map((r) => [r.weaponType, roomProducts.find((p) => p.id === r.id) ?? null]));

  const types = WEAPON_TYPES.map((type) => {
    const stat = typeStats.get(type.key);
    return { key: type.key, name: type.label, count: stat?.count ?? 0, minPrice: stat?.min ?? null, render: roomByType.get(type.key) ?? null };
  }).filter((t) => t.count > 0);

  const tierStrips: { key: string; label: string; count: number; minPrice: number | null; ids: string[] }[] = [];
  for (const tier of RARITIES) {
    const stat = rarityRows.find((r) => r.rarity === tier.key);
    const count = stat?.count ?? 0;
    let ids: string[] = [];
    if (count > 0) {
      const rows = await prisma.$queryRaw<IdRow[]>`
        WITH tier AS (
          SELECT p."id", p."price"::float AS price
          FROM "Product" p JOIN "Skin" s ON s."productId" = p."id"
          WHERE ${LIVE} AND ${HAS_RENDER} AND s."rarity" = ${tier.key} ${notIn(claimed)}
        ),
        mid AS (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY price) AS median FROM tier)
        SELECT tier."id" FROM tier, mid
        ORDER BY abs(tier.price - mid.median) ASC, tier."id" ASC
        LIMIT ${MERCH.registerStrip}`;
      ids = rows.map((r) => r.id);
      claim(ids);
    }
    tierStrips.push({ key: tier.key, label: tier.label, count, minPrice: stat?.min ?? null, ids });
  }
  const stripProducts = await loadSkinProducts(tierStrips.flatMap((t) => t.ids));
  const rarities: HomeRarityTier[] = tierStrips.map((t) => ({
    slug: raritySlug(t.key) ?? "consumer",
    key: t.key,
    label: t.label,
    count: t.count,
    minPrice: t.minPrice,
    strip: t.ids.map((id) => stripProducts.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
  }));

  const conditionIds = await Promise.all(
    EXTERIORS.map(async (e, index) => {
      const rows = await prisma.$queryRaw<IdRow[]>`
        SELECT p."id" FROM "Product" p JOIN "Skin" s ON s."productId" = p."id"
        WHERE ${LIVE} AND ${HAS_RENDER} AND s."exterior" = ${e.code} ${notIn(claimed)}
        ORDER BY p."sku" ASC
        LIMIT 120`;
      return rotate(rows.map((r) => r.id), index * 11);
    }),
  );
  claim(conditionIds);
  const conditionProducts = await loadSkinProducts(conditionIds.filter((id): id is string => Boolean(id)));
  const condition = EXTERIORS.map((e, i) => ({
    code: e.code,
    count: exteriorRows.find((r) => r.exterior === e.code)?.count ?? 0,
    product: conditionProducts.find((p) => p.id === conditionIds[i]) ?? null,
  }));

  const marks = async (column: "isStatTrak" | "isSouvenir", limit: number) => {
    const rows = await prisma.$queryRaw<IdRow[]>`
      SELECT id FROM (
        SELECT DISTINCT ON (s."weaponType") p."id", p."price"
        FROM "Skin" s JOIN "Product" p ON p."id" = s."productId"
        WHERE ${LIVE} AND ${HAS_RENDER} AND s.${Prisma.raw(`"${column}"`)} = true ${notIn(claimed)}
        ORDER BY s."weaponType", p."price" DESC
      ) x ORDER BY x."price" DESC LIMIT ${limit}`;
    claim(rows.map((r) => r.id));
    return loadSkinProducts(rows.map((r) => r.id));
  };
  const souvenir = await marks("isSouvenir", MERCH.souvenir);
  const stattrak = await marks("isStatTrak", MERCH.stattrak);

  const bands = [];
  for (const band of PRICE_BANDS) {
    const lower = band.min !== null ? Prisma.sql`AND p."price" >= ${band.min}` : Prisma.empty;
    const upper = band.max !== null ? Prisma.sql`AND p."price" < ${band.max}` : Prisma.empty;
    const [countRow] = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM "Product" p
      WHERE ${LIVE} ${lower} ${upper}`;
    const total = countRow?.count ?? 0;
    if (total < MERCH.bandMinimum) continue;
    const rows = await prisma.$queryRaw<IdRow[]>`
      SELECT p."id" FROM "Product" p
      WHERE ${LIVE} AND ${HAS_RENDER} ${lower} ${upper} ${notIn(claimed)}
      ORDER BY p."price" ASC, p."sku" ASC
      LIMIT ${MERCH.bandItems}`;
    claim(rows.map((r) => r.id));
    bands.push({ key: band.key, min: band.min, max: band.max, total, products: await loadSkinProducts(rows.map((r) => r.id)) });
  }

  const [anchorProducts, hangProducts, todayProducts] = await Promise.all([
    loadSkinProducts(anchorId ? [anchorId] : []),
    loadSkinProducts(hangIds),
    loadSkinProducts(todayRows.map((r) => r.id)),
  ]);

  return {
    totalProducts: totals[0]?.count ?? 0,
    anchor: anchorProducts[0] ?? null,
    hang: hangIds.map((id) => hangProducts.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    today: todayRows.map((r) => todayProducts.find((p) => p.id === r.id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    types,
    bands,
    rarities,
    condition,
    stattrak: { count: markCounts[0]?.stattrak ?? 0, products: stattrak },
    souvenir: { count: markCounts[0]?.souvenir ?? 0, products: souvenir },
  };
}
