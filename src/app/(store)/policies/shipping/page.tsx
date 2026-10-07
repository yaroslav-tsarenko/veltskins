import Link from "next/link";
import { PolicyLayout, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "shipping",
  `Delivery at ${F.brand}: every ${F.game} lot arrives as a ${F.deliveryMethod} ${F.deliveryUsual}, with Steam trade protection and trade holds explained.`,
);

const sections: PolicySection[] = [
  {
    id: "how",
    title: "The mechanics of delivery",
    body: (
      <>
        <p>
          Nothing is posted and nothing is charged for carriage. A lot you buy reaches you as a {F.deliveryMethod} addressed to the
          Steam account tied to your {F.brand} account, at the trade URL you stored. The offer originates from a delivery account
          holding the lot, not from some individual on the other side of a trade.
        </p>
        <p>
          We request the offer as soon as our payment provider confirms your payment, and offers go out {F.deliveryUsual}. Where an
          order contains several lots, each is delivered on its own, so more than one offer may arrive.
        </p>
      </>
    ),
  },
  {
    id: "requirements",
    title: "What has to be in place first",
    body: (
      <>
        <ul>
          {F.buyerRequirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Your trade URL is stored from <Link href="/account/steam">Steam account</Link>. Steam itself keeps it under Inventory, then
          Trade Offers, then “Who can send me Trade Offers?”. We verify that the URL you give belongs to the Steam account
          you linked.
        </p>
      </>
    ),
  },
  {
    id: "accepting",
    title: "Accepting the offer",
    body: (
      <>
        <p>
          In the Steam app, or at steamcommunity.com, open Inventory and then Trade Offers. Check two things before accepting: that the
          lot named on your order is what the offer contains, and that nothing of yours is being asked for. Steam may then want the
          Steam Guard Mobile Authenticator to confirm it.
        </p>
        <p>
          {F.offerExpiryNote} Each lot’s progress is visible on your order page — payment confirmed, processing, trade offer sent,
          delivered, or refunded.
        </p>
        <p>
          A Steam password, a Steam Guard code and an API key are things we will never request, and we will never ask you to send
          anything to us.
        </p>
      </>
    ),
  },
  {
    id: "protection",
    title: "Trade protection and trade holds at Steam",
    body: (
      <>
        <p>
          A lot received in a trade can be put under trade protection by Steam for as long as {F.tradeProtectionDays} days. Throughout
          that period it sits in your inventory and plays in game as normal, but it cannot be traded away or listed on the Steam
          Community Market.
        </p>
        <p>
          Where the Steam Guard Mobile Authenticator has been active on your account for fewer than 7 days, Steam may additionally hold
          the trade for up to {F.tradeHoldMaxDays} days before the lot lands. Valve sets both periods and neither can be shortened by
          us.
        </p>
        <p>
          Should Steam reverse a trade inside the protection period, taking the lot back out of your inventory, we return what you paid
          for it. The <Link href="/policies/warranty">Item guarantee</Link> covers this.
        </p>
      </>
    ),
  },
  {
    id: "failed",
    title: "When a lot does not arrive",
    body: (
      <>
        <p>
          Fail to deliver within {F.deliveryDeadlineHours} hours of the payment being confirmed and we refund the price paid for that
          lot, inside {F.refundDays} days, to {F.refundMethod}. You get an email when this happens.
        </p>
        <p>
          Sometimes the obstacle lies with the Steam account: a trade URL that is wrong or out of date, an inventory kept private, a
          trade ban or cooldown, a Steam Guard restriction. Your order page names the cause. Put the account setting right and, once the
          refund has landed, buy again.
        </p>
      </>
    ),
  },
  {
    id: "where",
    title: "Where we deliver",
    body: (
      <p>
        Our customers are in the {F.marketCountries}. We sell neither to {F.restrictedCountries} nor to {F.restrictedTerritories}.
      </p>
    ),
  },
  {
    id: "ownership",
    title: "The point at which the lot is yours",
    body: (
      <p>
        Delivery is done once you have accepted the offer and the lot shows in your Steam inventory, where it then sits under
        Steam’s terms of service. Anything else about an order: {F.email}.
      </p>
    ),
  },
];

export default async function ShippingPage() {
  return <PolicyLayout slug="shipping" sections={sections} />;
}
