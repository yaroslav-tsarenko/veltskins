import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import { getHomeData } from "@/components/home/data";
import { TheHang } from "@/components/home/TheHang";
import { TodayStrip } from "@/components/home/TodayStrip";
import { Rooms } from "@/components/home/Rooms";
import { Register } from "@/components/home/Register";
import { ConditionBand } from "@/components/home/ConditionBand";
import { MarksSplit } from "@/components/home/MarksSplit";
import { PriceBands } from "@/components/home/PriceBands";
import { HomeDelivery } from "@/components/home/HomeDelivery";
import { HomeQuestions } from "@/components/home/HomeQuestions";
import { FAQ_VALUES, faqLinkTags } from "@/components/faq/faq-content";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";
import { POLICY_FACTS } from "@/lib/policy-facts";

export const dynamic = "force-dynamic";

const QUESTION_PICKS = [
  ["delivery", "how"],
  ["delivery", "requirements"],
  ["delivery", "protection"],
  ["returns", "when"],
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  const title = t("metaTitle", { brand: BRAND.name });
  const description = t("metaDescription", { brand: BRAND.name, method: POLICY_FACTS.deliveryMethod });
  return pageMetadata({ title, description, path: "/", absoluteTitle: true });
}

export default async function HomePage() {
  const [data, t] = await Promise.all([getHomeData(), getTranslations("faq")]);
  const questions = QUESTION_PICKS.map(([group, item]) => ({
    id: `${group}-${item}`,
    question: t(`groups.${group}.items.${item}.q`),
    answer: t.rich(`groups.${group}.items.${item}.a`, { ...FAQ_VALUES, ...faqLinkTags }),
  }));

  return (
    <div data-landing="home">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <TheHang liveCount={data.totalProducts} anchor={data.anchor} hang={data.hang} />
      <TodayStrip products={data.today} />
      <Rooms types={data.types} />
      <Register tiers={data.rarities} />
      <ConditionBand condition={data.condition} />
      <MarksSplit stattrak={data.stattrak} souvenir={data.souvenir} />
      <PriceBands bands={data.bands} />
      <HomeDelivery />
      <HomeQuestions questions={questions} />
    </div>
  );
}
