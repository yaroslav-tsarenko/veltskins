import Link from "next/link";
import { LotRender } from "@/components/skin/LotRender";
import { skinFace } from "@/components/skin/face";
import { Wire } from "@/components/skin/HangLine";
import { EXTERIORS, formatFloat } from "@/lib/skins/cs2";
import { cn } from "@/lib/utils/cn";
import type { HomeData } from "./types";

export function ConditionBand({ condition }: { condition: HomeData["condition"] }) {
  const cells = EXTERIORS.map((e) => ({ def: e, entry: condition.find((c) => c.code === e.code) }));
  if (cells.every((c) => !c.entry || c.entry.count === 0)) return null;

  return (
    <section data-scene="condition" aria-labelledby="condition-title" className="bg-surface-2 py-24">
      <div className="mx-auto max-w-wide px-gutter">
        <p className="eyebrow m-0">Condition</p>
        <h2 id="condition-title" className="m-0 mt-3 max-w-[30ch] font-display text-step-4 font-medium leading-[1.12] tracking-[-0.005em] text-ink">
          Five bands on the float scale
        </h2>
        <p className="measure m-0 mt-5 text-step-0 leading-[1.6] text-ink-muted">
          Every copy of a skin carries a float between 0.00 and 1.00, fixed at the moment it drops. The exterior name tells you which band that float falls in; a lower band means less visible
          wear. We print the band and its range on the label, never a single float we have not measured.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-5">
          {cells.map(({ def, entry }, i) => {
            const product = entry?.product ?? null;
            const face = product ? skinFace(product.name, product.skin, product.category) : null;
            return (
              <div key={def.code} className={cn("min-w-0", i === 4 && "col-span-2 lg:col-span-1")}>
                <Link
                  href={`/catalog?exterior=${def.code.toLowerCase()}`}
                  className="group block"
                  aria-label={`${def.label} lots, float ${formatFloat(def.floatMin)} to ${formatFloat(def.floatMax)}`}
                >
                  <span className="grid h-11 w-full place-items-center border border-ink bg-ink font-mono text-[0.875rem] font-medium leading-none text-surface">
                    {def.code}
                  </span>
                  <p className="m-0 mt-3 font-display text-step-1 font-medium leading-[1.2] text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {def.label}
                  </p>
                  <p className="m-0 mt-1.5 font-mono text-data text-ink-muted">
                    {formatFloat(def.floatMin)}–{formatFloat(def.floatMax)}
                  </p>
                  <p className="m-0 mt-0.5 font-mono text-data-sm text-ink-faint">{(entry?.count ?? 0).toLocaleString("en-GB")} lots</p>
                </Link>
                {product && face ? (
                  <div data-lot="" data-rarity={face.rarity} className="relative mt-6">
                    <Wire length={22} offset="14%" />
                    <Link href={`/product/${product.slug}`} className="group block">
                      <LotRender src={product.imageUrl ?? product.images?.[0]?.url} alt="" sizes="(min-width: 1024px) 220px, 45vw" />
                      <p className="label-caps m-0 mt-3 text-ink-muted">{face.weaponLine}</p>
                      <p className="m-0 mt-1 line-clamp-2 font-display text-step-0 font-medium leading-[1.2] text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {face.name}
                      </p>
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
