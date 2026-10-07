import Link from "next/link";
import { PolicyLayout, SellerBlock, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "terms",
  `Trading terms for ${F.brand}: eligibility, pricing, card payment, ${F.deliveryMethod} delivery of ${F.game} items, cancellation rights, refunds and complaints.`,
);

const sections: PolicySection[] = [
  {
    id: "about",
    title: "These terms and who you deal with",
    body: (
      <>
        <p>
          Every purchase made through {F.domain} is governed by the terms set out below. The shop trades under the name {F.brand}; the
          company behind it is {F.company}, and that company is the seller named in your contract. Read “we”, “us” and “our” as{" "}
          {F.company} throughout, and “you” as the person whose name the order is placed in.
        </p>
        <SellerBlock />
        <p>
          Six further documents sit alongside this one and should be read with it: the{" "}
          <Link href="/policies/shipping">Delivery via Steam policy</Link>, the <Link href="/policies/returns">Refund policy</Link>, the{" "}
          <Link href="/policies/payment">Payment policy</Link>, the <Link href="/policies/warranty">Item guarantee</Link>, the{" "}
          <Link href="/policies/privacy">Privacy policy</Link> and the <Link href="/policies/cookies">Cookie policy</Link>. None of
          them, and nothing written here, takes away a right the law gives you as a consumer.
        </p>
      </>
    ),
  },
  {
    id: "who-can-order",
    title: "Who may hold an account and buy",
    body: (
      <>
        <p>
          The minimum age for registering and for ordering is {F.minAge}. Your date of birth is collected either at the point you
          register with an email address or, if Steam is how you signed in, before your first purchase goes through. Nobody below{" "}
          {F.minAge} is sold to.
        </p>
        <p>
          Our customers are private individuals stocking their own Steam inventory. Treat {F.brand} as a shop rather than a trading
          venue: the items on sale are items we have sourced and own, and there is no facility here for customers to sell, list or swap
          anything between themselves. Buy for resale or for any other commercial purpose and the consumer protections described in
          these terms will not cover that order.
        </p>
        <p>
          Receiving an item requires a Steam account in good standing. Whatever you give us at checkout — your name, email address,
          billing address, Steam account and trade URL — must be truthful and must belong to you.
        </p>
      </>
    ),
  },
  {
    id: "where-we-sell",
    title: "Countries we trade with",
    body: (
      <>
        <p>
          Orders are accepted from the {F.marketCountries}, and a billing address outside those countries cannot be entered at
          checkout.
        </p>
        <p>
          Registration and checkout are closed to {F.restrictedCountries}, and equally to {F.restrictedTerritories}. Nothing is sold,
          sent or invoiced there. Should an order turn out to be connected to any of them — by billing address, by the card used or by
          the Steam account it is going to — the order is cancelled and every penny paid is returned.
        </p>
      </>
    ),
  },
  {
    id: "products",
    title: "What is on sale",
    body: (
      <>
        <p>
          The catalogue is cosmetic: weapon finishes, which players call skins, together with knives and gloves for {F.game}. Nothing
          physical is shipped. Each item arrives in your Steam account, alters nothing but the appearance of a weapon and confers no
          advantage in play.
        </p>
        <p>
          One listing means one item. Alongside it we publish the market name Steam uses, the rarity, the exterior and the quality —
          normal, StatTrak&trade; or Souvenir. Where the item has an exterior, the float range permitted for that exterior on that
          finish is published with it. Float to the decimal, pattern index and any phase we have not stated belong to the specific item
          you are sent, and Steam will show them to you once it is yours. Photography is the standard Steam imagery.
        </p>
        <p>
          Everything we sell lives inside Steam, which is operated by Valve Corporation. There is no affiliation between {F.brand} and
          Valve, and Valve does not endorse us. Your account and the items held in it remain subject to Valve’s own rules,
          the Steam Subscriber Agreement included. Valve is free to alter how an item behaves, whether it can be traded at all, or
          whether it stays in the game.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "From basket to contract",
    body: (
      <>
        <ol>
          <li>Sign in, connect your Steam account and store your Steam trade URL against it.</li>
          <li>Fill your bag, then open checkout and give us your contact details and billing address.</li>
          <li>We re-check every price. Should one have risen, the revised total is put in front of you before payment is possible.</li>
          <li>Tick the box accepting these terms, tick the separate box asking for delivery to begin at once, then choose Pay.</li>
          <li>Our payment provider’s hosted page opens and you pay there by card.</li>
          <li>
            A confirmation email follows as soon as the provider tells us the payment succeeded. That email is the moment your contract
            with {F.company} comes into existence.
          </li>
        </ol>
        <p>
          Because a listing is a single item, it can be bought once in any one order, and an order may hold up to{" "}
          {F.maxItemsPerOrder} items. Up until the contract exists we are free to decline the order; afterwards we may cancel it and
          refund you in full. We would do either where the item has gone, where the price or the description shown was plainly wrong,
          where your Steam account is unable to receive a trade offer, where the order traces back to a restricted country or
          territory, or where the payment looks fraudulent. Either way an email explains what happened.
        </p>
      </>
    ),
  },
  {
    id: "prices",
    title: "Prices, currency and tax",
    body: (
      <>
        <p>
          Prices appear in {F.currencies}. {F.baseCurrency} is the currency we price in; the other figures are that price converted at
          the rate we hold at the time. Whichever currency you chose when ordering is the currency you are charged in, and the total you
          saw before paying is the total that leaves your account. Where your card is denominated in something else, your issuer may
          apply a foreign exchange fee of its own.
        </p>
        {F.vatRegistered ? (
          <p>Prices are inclusive of VAT at whichever rate applies to your order.</p>
        ) : (
          <p>
            {F.company} holds no VAT registration. VAT is therefore not charged, nothing is added for it at checkout, and no VAT line
            appears on your confirmation or on your invoice.
          </p>
        )}
        <p>Delivery costs nothing. What checkout totals is the whole of what you pay.</p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Paying",
    body: (
      <>
        <p>
          {F.cardMethods} cards are accepted. The card form itself belongs to {F.paymentProvider} and is hosted on their PCI DSS
          compliant page, so your full card number is never seen by us and never stored by us. Expect your bank to ask you to approve
          the payment through 3-D Secure, typically inside its own app.
        </p>
        <p>
          Completing that page is what charges your card. Only once the provider has confirmed the money to us do we ask for your items
          to be delivered. A declined card means no order was placed. The <Link href="/policies/payment">Payment policy</Link> goes
          into more detail.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "How the item reaches you",
    body: (
      <>
        <p>
          Each item travels as a {F.deliveryMethod} addressed to the Steam account you connected, sent to the trade URL held in your
          account. We send it {F.deliveryUsual}. The delivery counts as made when you have accepted the offer and the item sits in your
          Steam inventory.
        </p>
        <p>
          Accept before the offer lapses. {F.offerExpiryNote} Before you accept, satisfy yourself that the offer contains the item you
          bought and that it requests nothing from your own inventory in return.
        </p>
        <p>
          Steam itself may hold a newly received item under trade protection for as long as {F.tradeProtectionDays} days, and while that
          runs the item can be neither traded nor sold. Accounts not running the Steam Guard Mobile Authenticator may additionally meet
          a trade hold lasting up to {F.tradeHoldMaxDays} days. Both are Valve’s rules and outside our control. The{" "}
          <Link href="/policies/shipping">Delivery via Steam policy</Link> sets them out fully.
        </p>
      </>
    ),
  },
  {
    id: "cancel",
    title: "Cancellation and the consent you give",
    body: (
      <>
        <p>
          A contract for digital content ordinarily carries a {F.withdrawalDays} day cancellation window — under the Consumer Contracts
          (Information, Cancellation and Additional Charges) Regulations 2013 for customers in the UK, and under the Consumer Rights
          Directive for customers in the EU. That window closes as soon as delivery of the digital content has started, provided you
          expressly consented to it starting and acknowledged that consenting costs you the right.
        </p>
        <p>
          That consent is taken at checkout through a box of its own, left unticked until you tick it, reading:
          “{F.waiverText}” No order can be submitted while it is untouched. The moment you tick it and the exact wording
          shown to you are both recorded, and the wording is repeated back to you in the confirmation email. Delivery starts with the
          trade offer, which goes out as soon as your payment clears.
        </p>
        <p>
          Cancelling costs nothing provided you do it before {F.cancelBefore}. Send the request to {F.email} or through the{" "}
          <Link href="/contact">contact form</Link>, quoting your order number. Where the offer has yet to leave us, the order is
          cancelled and refunded in full.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Circumstances in which we refund",
    body: (
      <>
        <p>
          Four situations return the price of an item to you: we fail to deliver it inside {F.deliveryDeadlineHours} hours of the
          payment being confirmed; the trade offer fails or lapses for a reason that lies with us; Steam reverses the trade while the
          item remains under trade protection; or you cancel before {F.cancelBefore}. Payment comes back to{" "}
          {F.refundMethod} inside {F.refundDays} days, in the currency you paid.
        </p>
        <p>
          Where the obstacle is your own Steam account — a trade URL that no longer works, an inventory set to private, a trade ban, a
          Steam Guard restriction — we will say so and refund the item. Once an item has landed in your Steam inventory it is not
          refundable, the <Link href="/policies/warranty">Item guarantee</Link> aside. The{" "}
          <Link href="/policies/returns">Refund policy</Link> carries the full detail.
        </p>
      </>
    ),
  },
  {
    id: "chargebacks",
    title: "Card disputes",
    body: (
      <>
        <p>
          Come to us first when an order has gone wrong. We can almost always settle it more quickly than a card dispute can.
        </p>
        <p>
          Where you do raise a chargeback, we will put our side to your card issuer: the order record, the Steam trade offer, the
          request for immediate delivery as we recorded it, and our correspondence with you. A chargeback resolved in your favour will
          not be refunded a second time by us directly. Where a chargeback concerns items that did reach you, the account may be
          suspended for as long as the dispute is live. None of this restricts anything the card scheme rules or consumer law entitle
          you to.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "Looking after your account",
    body: (
      <>
        <p>
          Your password, your Steam account and whatever happens under your login are yours to protect. If you suspect another person
          has been in it, tell us at once. Note that we will never ask you for a Steam password or a Steam Guard code.
        </p>
        <p>
          Accounts may be suspended or closed by us where our <Link href="/policies/acceptable-use">Acceptable use policy</Link> has
          been broken, where the details supplied are false, or where the account is tied to a restricted country or territory. Closure
          at your own request is available whenever you want it.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "The extent of our responsibility",
    body: (
      <>
        <p>
          Break these terms and we answer for the loss or damage you suffer as a foreseeable consequence. Loss that nobody could have
          foreseen when the contract was made falls outside that.
        </p>
        <p>
          Nothing here is intended to exclude or limit our liability for death or personal injury arising from our negligence, for
          fraud, or for any breach of the legal rights you hold in relation to the goods.
        </p>
        <p>
          What we sell is sold for private enjoyment. We do not answer to you for lost profit, lost business or business interruption,
          nor for whatever Valve decides to change about {F.game} or about Steam.
        </p>
      </>
    ),
  },
  {
    id: "outside-control",
    title: "Disruption beyond our reach",
    body: (
      <p>
        Your order may be held up by something we do not control — Steam going down, Valve rewriting how trading works, a break in
        service at our delivery partner. When that happens you hear from us at the earliest point we can tell you, and we take the
        reasonable steps open to us to shorten the delay. Where delivery proves impossible inside{" "}
        {F.deliveryDeadlineHours} hours, the item is refunded.
      </p>
    ),
  },
  {
    id: "data",
    title: "Personal data",
    body: (
      <p>
        What we do with your personal data is described in the <Link href="/policies/privacy">Privacy policy</Link>.
      </p>
    ),
  },
  {
    id: "complaints",
    title: "Raising a complaint",
    body: (
      <p>
        Anything about an order that leaves you dissatisfied should go to {F.email}. Acknowledgement follows {F.complaintsAck}, and a
        considered reply within {F.complaintsDays} days. Our <Link href="/policies/complaints">Complaints policy</Link> explains the
        steps and where a complaint can be taken if we cannot settle it.
      </p>
    ),
  },
  {
    id: "law",
    title: "Law and jurisdiction",
    body: (
      <>
        <p>
          {F.governingLaw} govern these terms, and {F.courts} may hear a dispute arising from them.
        </p>
        <p>
          Customers resident in the United Kingdom or in an EU member state keep the protection of the mandatory consumer laws of the
          country where they live, and may bring proceedings in that country’s courts.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Revisions",
    body: (
      <p>
        These terms can be revised. Whichever version stood published at the moment you ordered is the version that governs that order.
        The date printed at the head of this page records the most recent revision.
      </p>
    ),
  },
];

export default async function TermsPage() {
  return <PolicyLayout slug="terms" sections={sections} />;
}
