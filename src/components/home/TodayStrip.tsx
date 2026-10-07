import { Lot, type SkinProduct } from "@/components/skin/Lot";
import { HangLine } from "@/components/skin/HangLine";
import { SectionHead, TextLink } from "./SectionHead";
import { TODAY_BAND } from "@/config/merchandising";
import { BandSentence } from "./BandRange";

const WIRES = [18, 30, 22, 40, 26, 34, 20, 28];

export function TodayStrip({ products }: { products: SkinProduct[] }) {
  if (products.length === 0) return null;
  return (
    <section data-scene="strip" aria-labelledby="today-title" className="bg-surface pb-24 pt-18">
      <div className="mx-auto max-w-wide px-gutter">
        <SectionHead id="today-title" title="Today's lots" lead={<BandSentence min={TODAY_BAND.min} max={TODAY_BAND.max} count={products.length} />} />
      </div>
      <div className="relative mt-12">
        <HangLine hooks={8} className="absolute inset-x-0 top-0" />
        <div className="no-scrollbar mx-auto flex max-w-wide snap-x snap-mandatory gap-5 overflow-x-auto px-gutter pt-1 lg:gap-6">
          {products.map((p, i) => (
            <div key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[calc((100%-5*1.5rem)/6)]">
              <Lot product={p} wire={WIRES[i % WIRES.length]} sizes="(min-width: 1024px) 240px, 72vw" />
            </div>
          ))}
          <div className="flex w-[12rem] shrink-0 items-start pt-12">
            <TextLink href="/catalog">See the whole catalogue</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
