import Link from "next/link";
import { PolicyLayout, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "payment",
  `Card payment at ${F.brand}: ${F.cardMethods} on a PCI DSS compliant hosted page, prices in ${F.currencies}, and a full card number that never touches our systems.`,
);

const sections: PolicySection[] = [
  {
    id: "methods",
    title: "What we take",
    body: (
      <>
        <p>Credit and debit cards carrying {F.cardMethods} are the only means of payment here. Nothing else is accepted.</p>
        <p>
          Payment happens on a page hosted by{" "}
          {F.paymentProviderNamed ? `${F.paymentProviderNamed}, whose platform is PCI DSS compliant` : "our payment provider, whose platform is PCI DSS compliant"}.
          Choosing Pay at checkout hands you over to that page for your card details, and returns you to {F.brand} once the payment has
          gone through.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Where your card details go",
    body: (
      <>
        <p>
          <strong>A full card number is something we neither hold nor handle.</strong>{" "}
          Number, expiry and security code are typed into the provider’s page; none of the three crosses our website. The outcome
          of the payment and a transaction reference are all we are told.
        </p>
        <p>
          Every payment runs through 3-D Secure and Strong Customer Authentication, so expect your bank to seek confirmation — from
          inside its app, say, or by one-time code. Skip that step and the money is not taken.
        </p>
      </>
    ),
  },
  {
    id: "currencies",
    title: "Currency",
    body: (
      <>
        <p>
          Browsing and paying are both possible in {F.currencies}. We price in {F.baseCurrency} and convert into the others at the rate
          we hold at the time. The checkout total, in whichever currency you picked, is the sum we charge.
        </p>
        <p>A card denominated in another currency may be converted by your issuer, which can add a fee of its own. That fee is not ours and not within our control.</p>
      </>
    ),
  },
  {
    id: "tax",
    title: "Tax",
    body: F.vatRegistered ? (
      <p>VAT at the rate applicable to your order is already in the price, and your invoice itemises the VAT.</p>
    ) : (
      <p>
        There is no VAT registration behind {F.company}. No VAT is charged, and none appears at checkout, on your confirmation or on
        your invoice.
      </p>
    ),
  },
  {
    id: "when-charged",
    title: "When the money leaves",
    body: (
      <>
        <p>
          The charge happens the moment you finish on the provider’s page. Confirming the order, emailing you and asking for your
          items to be delivered all wait until the provider has told us the payment succeeded. A declined or abandoned payment means no
          charge and no delivery.
        </p>
        <p>
          Where a payment fails, re-check the card details and whether your bank has approved it, then try once more. If it keeps
          failing, your bank will know why — or write to {F.email}.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    body: (
      <p>
        Money comes back to the same card, in the same currency, inside {F.refundDays} days, on the terms set out in the{" "}
        <Link href="/policies/returns">Refund policy</Link>. A different card or account cannot be used.
      </p>
    ),
  },
  {
    id: "statement",
    title: "On your bank statement",
    body: (
      <p>
        Depending on your bank, the entry reads either {F.company} or {F.brand}. Before you query an unfamiliar charge with the bank,
        email {F.email} and we will trace the order for you.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Disputes",
    body: (
      <p>
        Bring a problem to us before you bring it to your card issuer; we are usually quicker. Our handling of chargebacks appears in the{" "}
        <Link href="/policies/terms#chargebacks">Terms and conditions</Link>.
      </p>
    ),
  },
];

export default async function PaymentPage() {
  return <PolicyLayout slug="payment" sections={sections} />;
}
