import { Lot, type SkinProduct } from "@/components/skin/Lot";
import { HangLine } from "@/components/skin/HangLine";
import { SectionHead } from "@/components/home/SectionHead";

export function LotRail({
  id,
  title,
  lead,
  products,
  link,
  rail = true,
  className,
}: {
  id: string;
  title: string;
  lead?: string;
  products: SkinProduct[];
  link?: { href: string; label: string };
  rail?: boolean;
  className?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby={`${id}-title`} data-section={id} className={className}>
      <SectionHead id={`${id}-title`} title={title} lead={lead} link={link} />
      {rail ? <HangLine hooks={4} className="mt-10" /> : null}
      <div className="no-scrollbar -mx-gutter mt-10 flex snap-x gap-4 overflow-x-auto px-gutter pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[min(72vw,280px)] shrink-0 snap-start lg:w-auto">
            <Lot product={p} sizes="(min-width: 1024px) 300px, 72vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
