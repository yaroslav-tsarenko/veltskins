import Link from "next/link";
import { PolicyLayout, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "warranty",
  `The ${F.brand} guarantee: a lot we cannot deliver, or a trade Steam reverses while the lot is protected, puts the price you paid back on your card.`,
);

const sections: PolicySection[] = [
  {
    id: "guarantee",
    title: "What the guarantee covers",
    body: (
      <>
        <p>{F.guarantee}</p>
        <ul>
          <li>Delivery does not happen within {F.deliveryDeadlineHours} hours of the payment being confirmed.</li>
          <li>An offer we sent fails, or runs out, for a reason that is ours.</li>
          <li>Steam reverses the trade during trade protection — up to {F.tradeProtectionDays} days from delivery — and the lot leaves your inventory.</li>
          <li>The lot delivered departs from the market name, exterior or quality published on the listing.</li>
        </ul>
        <p>
          A second attempt at the same lot may be offered in place of money. The choice is yours: ask for the refund and it reaches{" "}
          {F.refundMethod} inside {F.refundDays} days.
        </p>
      </>
    ),
  },
  {
    id: "what-it-is-not",
    title: "Where it ends",
    body: (
      <>
        <ul>
          <li>A lot blocked by the receiving Steam account — invalid trade URL, private inventory, trade ban or cooldown, Steam Guard restrictions — is refunded rather than re-sent.</li>
          <li>The precise float, pattern or look of a lot, so long as it falls inside the float range and description we published.</li>
          <li>Anything Valve changes about {F.game} or Steam once the lot has been delivered.</li>
          <li>A lot you trade away, sell, or lose hold of after delivery, a compromised Steam account included.</li>
        </ul>
        <p>
          Your statutory rights as a consumer in the UK or the EU survive all of this untouched. Digital content must be as described
          and of satisfactory quality; what is written here sits on top of those rights rather than in place of them.
        </p>
      </>
    ),
  },
  {
    id: "claim",
    title: "Making a claim",
    body: (
      <ol>
        <li>Email {F.email}, or use the <Link href="/contact">contact form</Link>, naming the order number and the lot in question.</li>
        <li>For a reversed trade, give us the date the lot left your inventory; a screenshot of your Steam inventory history is useful.</li>
        <li>We examine the trade record and come back {F.replyTime}.</li>
        <li>A covered claim puts that lot’s price back on your card inside {F.refundDays} days, or sends the lot again if that suits you better.</li>
      </ol>
    ),
  },
  {
    id: "automatic",
    title: "Claims that need no claim",
    body: (
      <p>
        Our delivery partner reports most failed deliveries and reversed trades to us directly. In those cases the lot turns to{" "}
        “Refund pending” on your <Link href="/account/orders">order page</Link> and the refund follows without you writing
        to us at all.
      </p>
    ),
  },
];

export default async function WarrantyPage() {
  return <PolicyLayout slug="warranty" sections={sections} />;
}
