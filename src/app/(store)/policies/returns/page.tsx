import Link from "next/link";
import { PolicyLayout, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "returns",
  `The grounds on which ${F.brand} refunds a ${F.game} lot — non-delivery, a reversed Steam trade, cancellation before delivery starts — and the ${F.refundDays} day route back to ${F.refundMethod}.`,
);

const sections: PolicySection[] = [
  {
    id: "summary",
    title: "The short version",
    body: (
      <ul>
        <li>A lot we fail to deliver inside {F.deliveryDeadlineHours} hours of the payment being confirmed is refunded at the price you paid.</li>
        <li>A trade that Steam reverses while the lot is under trade protection sends that lot’s price back to your card.</li>
        <li>Cancellation before {F.cancelBefore} costs nothing.</li>
        <li>Delivery, once started, closes the {F.withdrawalDays} day cancellation right, because that is what you asked us to do at checkout.</li>
        <li>Money returns inside {F.refundDays} days to {F.refundMethod}, in whichever currency you paid.</li>
      </ul>
    ),
  },
  {
    id: "withdrawal",
    title: "Cancellation and immediate delivery",
    body: (
      <>
        <p>
          {F.withdrawalDays} days is the cancellation period a consumer has over a contract for digital content under the Consumer
          Contracts Regulations 2013 in the UK and the Consumer Rights Directive in the EU. The exception is delivery that has already
          begun with the consumer’s express consent and their acknowledgement that the right falls away.
        </p>
        <p>
          Our lots go out as soon as payment clears, so that consent is taken at checkout through its own box, unticked until you tick
          it: “{F.waiverText}” An order will not submit without it. The timestamp and the wording are both filed with the
          order and quoted back in your confirmation email.
        </p>
        <p>
          Delivery starts with the Steam trade offer. Before it goes out you may still cancel at no cost — email {F.email} or use the{" "}
          <Link href="/contact">contact form</Link>, quoting the order number.
        </p>
      </>
    ),
  },
  {
    id: "when-we-refund",
    title: "Grounds for a refund",
    body: (
      <>
        <ul>
          <li>Neither sourcing the lot nor sending the trade offer proved possible within {F.deliveryDeadlineHours} hours of the payment being confirmed.</li>
          <li>The offer failed, or ran out before you could accept, for a reason sitting on our side.</li>
          <li>Steam reversed the trade during trade protection and took the lot back out of your inventory.</li>
          <li>What arrived was not what your order named — a different market name, exterior or quality.</li>
          <li>You cancel before {F.cancelBefore}.</li>
        </ul>
        <p>
          Where the receiving Steam account is what blocks the offer — a trade URL that is invalid, an inventory set to private, a trade
          ban or cooldown, a Steam Guard restriction — that lot’s price goes back on your card and we tell you what needs changing
          before you buy again.
        </p>
      </>
    ),
  },
  {
    id: "not-refundable",
    title: "Grounds that are not",
    body: (
      <>
        <p>
          A lot sitting in your Steam inventory, with no reversal by Steam, is not taken back and not refunded on account of a change of
          mind, a cheaper price found elsewhere, or a wish for a different float or pattern from within the range we published.
        </p>
        <p>
          Whatever Valve alters about {F.game} or Steam — the look of a lot, the rules of trading — lies outside our hands and is not a
          ground for refund.
        </p>
      </>
    ),
  },
  {
    id: "how-refunds",
    title: "The route the money takes",
    body: (
      <>
        <p>
          Counting from the day we confirm the refund to you, the money is sent inside {F.refundDays} days, to {F.refundMethod}, in the
          currency of your payment. On a multi-lot order only the affected lots are refunded. Refunds carry no fee from us, though your
          bank may need a few more working days to post it.
        </p>
        <p>
          Status for every lot, “Refund pending” and “Refunded” among the states, is on your{" "}
          <Link href="/account/orders">order page</Link>. An email goes out as well when a refund is issued.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Chasing a refund",
    body: (
      <p>
        Email {F.email}, or use the <Link href="/contact">contact form</Link> with the order number. We answer {F.replyTime}. An answer
        you are unhappy with can go further, by way of our <Link href="/policies/complaints">Complaints policy</Link>.
      </p>
    ),
  },
];

export default async function ReturnsPage() {
  return <PolicyLayout slug="returns" sections={sections} />;
}
