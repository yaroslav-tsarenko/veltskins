import { LotRow, type SkinProduct } from "@/components/skin/Lot";
import { TextLink } from "./SectionHead";

interface MarkSide {
  count: number;
  products: SkinProduct[];
}

function Half({
  title,
  sentence,
  count,
  products,
  href,
  linkLabel,
}: {
  title: React.ReactNode;
  sentence: string;
  count: number;
  products: SkinProduct[];
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="min-w-0">
      <h3 className="m-0 font-display text-step-3 font-medium leading-[1.14] text-ink">{title}</h3>
      <p className="m-0 mt-3 max-w-[48ch] text-step-0 leading-[1.6] text-ink-muted">{sentence}</p>
      <p className="m-0 mt-4 font-mono text-data text-ink-muted">{count.toLocaleString("en-GB")} lots in the catalogue</p>
      <div className="mt-7 flex flex-col">
        {products.map((p) => (
          <div key={p.id} className="border-b border-line py-5 first:border-t">
            <LotRow name={p.name} href={`/product/${p.slug}`} imageUrl={p.imageUrl ?? p.images?.[0]?.url} sku={p.sku} skin={p.skin} />
          </div>
        ))}
      </div>
      <TextLink href={href} className="mt-6">
        {linkLabel}
      </TextLink>
    </div>
  );
}

export function MarksSplit({ stattrak, souvenir }: { stattrak: MarkSide; souvenir: MarkSide }) {
  const showSouvenir = souvenir.count > 0 && souvenir.products.length > 0;
  const showStatTrak = stattrak.count > 0 && stattrak.products.length > 0;
  if (!showSouvenir && !showStatTrak) return null;

  return (
    <section data-scene="marks" aria-labelledby="marks-title" className="bg-surface py-18">
      <div className="mx-auto max-w-wide px-gutter">
        <h2 id="marks-title" className="sr-only">
          Marks and provenance
        </h2>
        <div className="grid grid-cols-12 gap-x-7 gap-y-14">
          {showSouvenir ? (
            <div className="col-span-12 lg:col-span-5 lg:pt-18">
              <Half
                title={<span className="italic">Souvenir</span>}
                sentence="Dropped from a souvenir package at a CS2 Major. The label annotates it in italic, next to the condition."
                count={souvenir.count}
                products={souvenir.products}
                href="/catalog?quality=souvenir"
                linkLabel="All Souvenir lots"
              />
            </div>
          ) : null}
          {showStatTrak ? (
            <div className="col-span-12 lg:col-span-7 lg:border-l lg:border-line lg:pl-10">
              <Half
                title={
                  <>
                    StatTrak<span className="align-super text-[0.6em]">™</span>
                  </>
                }
                sentence="Carries a counter that tracks kills made with that weapon. The label annotates it with a ruled ST box."
                count={stattrak.count}
                products={stattrak.products}
                href="/catalog?quality=stattrak"
                linkLabel="All StatTrak™ lots"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
