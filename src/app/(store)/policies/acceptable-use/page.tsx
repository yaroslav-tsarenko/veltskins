import Link from "next/link";
import { PolicyLayout, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "acceptable-use",
  `The conduct expected of anyone using ${F.domain} or holding a ${F.brand} account, and the consequences of falling short of it.`,
);

const sections: PolicySection[] = [
  {
    id: "scope",
    title: "Who is bound by this",
    body: (
      <p>
        Anyone who opens {F.domain}, and anyone who registers here, is bound by what follows. It is part of the{" "}
        <Link href="/policies/terms">Terms and conditions</Link> rather than a separate undertaking.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "Accounts",
    body: (
      <ul>
        <li>An account holder must have reached {F.minAge}.</li>
        <li>One person, one account, in that person’s own name, with details that are correct.</li>
        <li>A password is yours alone. Do not lend your account out and do not borrow anyone else’s.</li>
        <li>
          No account may be opened from {F.restrictedCountries} or {F.restrictedTerritories}, nor used to order anything for delivery
          there. A VPN, a proxy or an invented address to work around that is itself a breach.
        </li>
      </ul>
    ),
  },
  {
    id: "not-allowed",
    title: "Conduct we will not permit",
    body: (
      <ul>
        <li>Paying with a card that is stolen or that you have no authority over, or ordering with no intention of paying at all.</li>
        <li>Buying to resell, or manoeuvring around the ceiling of {F.maxItemsPerOrder} lots to an order.</li>
        <li>Connecting a Steam account or storing a trade URL belonging to someone else, or treating {F.brand} as a way of shifting lots between accounts on another person’s behalf.</li>
        <li>Taking a lot and then reversing the trade, or raising a chargeback over a lot that did arrive, so as to end up with it unpaid for.</li>
        <li>Hitting the site with automated traffic — scraping, creating accounts in bulk, hammering checkout.</li>
        <li>Reaching for another customer’s data, for our admin area or for any system you have no authority over, and probing for security weaknesses without our written permission.</li>
        <li>Sending or uploading malware, spam, or anything the law forbids.</li>
      </ul>
    ),
  },
  {
    id: "breach",
    title: "Consequences",
    body: (
      <>
        <p>
          The responses open to us are cancelling an order and refunding it, or suspending the account, or closing it. Where the law
          obliges us to report something — card fraud being the obvious case — we report it to the appropriate authority.
        </p>
        <p>Think we have got it wrong? Write to {F.email} and the decision will be looked at again.</p>
      </>
    ),
  },
];

export default async function AcceptableUsePage() {
  return <PolicyLayout slug="acceptable-use" sections={sections} />;
}
