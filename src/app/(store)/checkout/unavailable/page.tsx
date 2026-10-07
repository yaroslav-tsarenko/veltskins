import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button-classes";
import { EmptyMount } from "@/components/shared/EmptyState/EmptyState";
import { noindexMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return noindexMetadata("Card payment isn't switched on yet", "Card payments are not available on this store right now. Your cart is saved and nothing has been charged.", "/checkout", false);
}

export default function CheckoutUnavailablePage() {
  return (
    <div className="mx-auto flex max-w-read flex-col items-start px-gutter pb-28 pt-16 lg:pt-24">
      <EmptyMount />
      <h1 className="m-0 mt-10 font-display text-step-5 font-medium leading-[1.06] tracking-[-0.01em] text-ink" style={{ fontVariationSettings: '"opsz" 44' }}>
        Card payment isn’t switched on yet
      </h1>
      <p className="m-0 mt-5 text-step-0 leading-[1.7] text-ink-muted">
        We can’t take card payments on this store right now. Your cart is saved, and nothing has been charged.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/cart" className={buttonClasses({ variant: "outline", size: "lg" })}>
          Back to cart
        </Link>
        <Link href="/contact" className={buttonClasses({ variant: "ghost", size: "lg" })}>
          Contact us
        </Link>
      </div>
    </div>
  );
}
