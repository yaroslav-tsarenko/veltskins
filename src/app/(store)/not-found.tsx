import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EmptyMount } from "@/components/shared/EmptyState/EmptyState";
import { HangLine } from "@/components/skin/HangLine";
import { NAV_CATEGORIES } from "@/config/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="mx-auto max-w-container px-gutter pb-24 pt-12 lg:pt-20">
      <HangLine hooks={1} />
      <div className="grid grid-cols-1 items-start gap-12 pt-11 lg:grid-cols-12 lg:gap-x-10">
        <figure data-scene="not-found" className="m-0 flex flex-col items-start gap-10 lg:col-span-5">
          <span aria-hidden="true" className="flex flex-col items-center pl-10">
            <span className="block h-[7px] w-0.5 bg-rail" />
            <span className="wire block h-6" />
          </span>
          <EmptyMount />
        </figure>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow m-0">Error 404</p>
          <h1 className="m-0 mt-3 font-display text-step-5 font-medium leading-[1.06] tracking-[-0.01em] text-ink" style={{ fontVariationSettings: '"opsz" 44' }}>
            This lot isn’t on the wall
          </h1>
          <p className="m-0 mt-4 max-w-[46ch] font-display text-step-1 leading-[1.56] text-ink-muted">
            This page doesn’t exist, or the lot is no longer in the catalogue.
          </p>

          <form action="/search" method="get" role="search" className="mt-9 flex max-w-[34rem] items-end gap-3">
            <Input name="q" type="search" label={t("searchLabel")} placeholder="Search the catalogue" wrapperClassName="flex-1" autoComplete="off" />
            <Button type="submit" className="h-12 shrink-0" startContent={<Search aria-hidden="true" />}>
              Search
            </Button>
          </form>

          <nav aria-labelledby="nf-categories" className="mt-10 border-t border-line pt-5">
            <h2 id="nf-categories" className="eyebrow m-0">
              Weapon types
            </h2>
            <ul className="m-0 mt-3 grid list-none grid-cols-2 gap-x-6 p-0">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="inline-flex min-h-11 items-center text-ui-md text-ink decoration-1 underline-offset-4 hover-device:hover:underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-ui-md font-medium text-ink decoration-1 underline-offset-[5px] hover-device:hover:underline">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
