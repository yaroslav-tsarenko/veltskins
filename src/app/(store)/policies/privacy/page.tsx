import Link from "next/link";
import { PolicyLayout, SellerBlock, policyMetadata, policyTable, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { STORE_POLICY } from "@/config/store-policy";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "privacy",
  `The personal data ${F.brand} holds, the lawful basis for each use, the processors involved, retention periods and the rights available to you under UK and EU GDPR.`,
);

const purposes: { purpose: string; data: string; basis: string }[] = [
  { purpose: "Fulfilling the order and sending the item to Steam", data: "Your name, email address, telephone number where given, billing address, the lots ordered, your Steam ID and your trade URL together with the token inside it", basis: "Contract" },
  { purpose: "Authenticating you through Steam and tying that account to ours", data: "Your Steam ID, plus the display name, avatar and profile link that your Steam profile makes public", basis: "Contract" },
  { purpose: "Operating the account itself", data: "Your name, email address, telephone number, date of birth, postal address, a hash of your password, the orders you have placed and the lots you have saved", basis: "Contract" },
  { purpose: "Evidencing your instruction to deliver at once", data: "The timestamp of the tick and the exact wording placed in front of you", basis: "Legal obligation" },
  { purpose: `Satisfying ourselves that you are at least ${F.minAge}`, data: "Your date of birth", basis: "Contract and legitimate interests" },
  { purpose: "Replying to enquiries and handling complaints", data: "Your name, email address, the order number quoted, what you wrote and the originating IP address", basis: "Contract and legitimate interests" },
  { purpose: "Processing refunds, defending chargebacks and screening for fraud", data: "The order record, the payment outcome and its transaction reference, the IP address used", basis: "Legal obligation and legitimate interests" },
  { purpose: "Keeping sales out of restricted countries and territories", data: "The country and address you bill to", basis: "Legal obligation" },
  { purpose: "Maintaining books and tax records", data: "Records of orders and of refunds", basis: "Legal obligation" },
  { purpose: "Sending the newsletter, where you have asked for it", data: "Your email address", basis: "Consent" },
  { purpose: "Keeping the site up and secure", data: "IP address, browser and device type, the pages requested and error logs", basis: "Legitimate interests" },
];

const sections: PolicySection[] = [
  {
    id: "controller",
    title: "The controller",
    body: (
      <>
        <p>
          Personal data covered by this policy is controlled by {F.company}, trading as {F.brand}. For customers in the United Kingdom
          that control is exercised under the UK GDPR together with the Data Protection Act 2018; for customers in the European Union it
          is exercised under the EU General Data Protection Regulation.
        </p>
        <SellerBlock />
        <p>Questions about your data, and requests to exercise a right over it, go to {F.email}.</p>
      </>
    ),
  },
  {
    id: "collect",
    title: "The data we hold",
    body: (
      <>
        <ul>
          <li><strong>Registration:</strong> forename and surname, email address, telephone number, date of birth, street, city, postcode, country, and your password, which is retained purely as a one-way hash.</li>
          <li><strong>Steam identity:</strong> your SteamID64, with the display name, avatar and profile link published on your Steam profile. Signing in through Steam means Steam vouches for your Steam ID to us; your Steam password is never visible to us.</li>
          <li><strong>Trade URL:</strong> the Steam trade URL stored against your account, which carries your Steam account number and a trade token. Its only use is sending you trade offers for lots you have bought.</li>
          <li><strong>Purchases:</strong> the lots bought, the address billed, the contact details given, your instruction to deliver immediately, how each trade offer ended, and the payment outcome and transaction reference our payment provider returns to us.</li>
          <li><strong>Correspondence:</strong> whatever you write to us by email or through the contact form, any order number in it, and in the case of the form the IP address it came from.</li>
          <li><strong>Saved lots:</strong> the lots you have kept against your account.</li>
          <li><strong>Newsletter:</strong> an email address, where you asked to receive it.</li>
          <li><strong>Technical:</strong> IP address, browser and device type and the pages requested, as written to our server logs. Anything held in your browser is covered by the <Link href="/policies/cookies">Cookie policy</Link>.</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "Each use and the basis for it",
    body: (
      <div className="overflow-x-auto">
        <table className={policyTable}>
          <thead>
            <tr>
              <th scope="col">Purpose</th>
              <th scope="col">Data</th>
              <th scope="col">Lawful basis</th>
            </tr>
          </thead>
          <tbody>
            {purposes.map((row) => (
              <tr key={row.purpose}>
                <td className="font-medium text-ink">{row.purpose}</td>
                <td className="text-ink-muted">{row.data}</td>
                <td>{row.basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "card-data",
    title: "Card details",
    body: (
      <>
        <p>
          <strong>
            A full card number is something we neither hold nor handle. Card processing is carried out in its entirety by our PCI DSS
            compliant payment provider
            {F.paymentProviderNamed ? `, ${F.paymentProviderNamed}` : ""}.
          </strong>
        </p>
        <p>
          The form you type your card into is hosted by that provider and does not sit on our site. 3-D Secure and Strong Customer
          Authentication (SCA) guard the payment, which is why your bank may want you to approve it, often from inside its app. What
          comes back to us is the outcome and a transaction reference, nothing more.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Recipients",
    body: (
      <>
        <p>
          Beyond our own staff, personal data goes only to service providers acting on our instructions as processors, and each receives
          no more of it than its task requires:
        </p>
        <ul>
          {STORE_POLICY.processors.map((p) => (
            <li key={p.role}>
              <strong>{p.name ? `${p.role} (${p.name})` : p.role}:</strong> {p.purpose.charAt(0).toLowerCase() + p.purpose.slice(1)}.
            </li>
          ))}
        </ul>
        <p>
          Disclosure may also be compelled by law — to a tax authority or the police, for instance — or needed by a card issuer
          investigating a disputed payment. Personal data is never sold, and advertisers are never given access to it.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Data leaving the UK and EEA",
    body: (
      <p>
        Valve Corporation runs Steam from the United States, so signing in through Steam and the trade offers themselves are processed
        there, governed by Valve’s own privacy policy. The partner that delivers your lots is given your Steam ID and trade token
        in order to send the offer. Whenever a provider handles data beyond the United Kingdom or the European Economic Area, the
        transfer rests either on an adequacy decision or on standard contractual clauses, with the UK International Data Transfer
        Addendum added for data from the UK.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Retention periods",
    body: (
      <ul>
        <li>Records of orders, payments and refunds are held for {F.retention.orderRecordsYears} years from the order, as accounting and tax law requires.</li>
        <li>An account lasts until you ask for it to be closed, or lapses after {F.retention.inactiveAccountYears} years with no sign-in and no order; the order records behind it are then retained on the basis above.</li>
        <li>Correspondence and complaints are held for {F.retention.supportMessagesMonths} months from the close of the conversation.</li>
        <li>Newsletter data is held until you unsubscribe.</li>
      </ul>
    ),
  },
  {
    id: "rights",
    title: "What you can require of us",
    body: (
      <>
        <p>The law entitles you to:</p>
        <ul>
          <li>a copy of the personal data we hold on you;</li>
          <li>correction of anything inaccurate in it;</li>
          <li>erasure where the need for it has passed or no lawful basis supports keeping it;</li>
          <li>a restriction on how we use it, or an objection to our using it at all, legitimate interests included;</li>
          <li>the data you supplied, handed back in a portable format;</li>
          <li>withdrawal of a consent at any moment — unsubscribing from the newsletter or revisiting your cookie settings, for example.</li>
        </ul>
        <p>
          Write to {F.email} to exercise any of them. Our answer comes inside one month. Expect to be asked to prove who you are before
          we act.
        </p>
        <p>
          A supervisory authority is also open to you: the Information Commissioner’s Office (ico.org.uk) in the United Kingdom,
          or in the European Union the data protection authority for the country you live or work in. We would rather you let us try to
          put the matter right first.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Safeguards",
    body: (
      <p>
        Nothing is served over anything but HTTPS. Passwords exist only as one-way hashes. Customer records are reachable solely by the
        people whose job is filling orders and answering messages. Card numbers, Steam passwords and Steam Guard codes never enter our
        systems at all.
      </p>
    ),
  },
  {
    id: "automated",
    title: "Automated decision-making",
    body: (
      <p>
        No decision carrying legal or comparably significant consequences for you is taken here by automated means on its own. Automated
        fraud screening does run at your card issuer and at our payment provider, and either may refuse a payment. Tell us when that
        happens and we will review the order.
      </p>
    ),
  },
  {
    id: "age",
    title: "Minimum age",
    body: (
      <p>
        This is an adults’ shop. Data is not knowingly gathered from anyone below {F.minAge}. Should you have reason to think an
        account belongs to someone under {F.minAge}, write to {F.email} and we will remove it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Revisions",
    body: <p>Whenever our handling of personal data changes, this policy is revised to match. The date at the head of the page identifies the current version.</p>,
  },
];

export default async function PrivacyPage() {
  return <PolicyLayout slug="privacy" sections={sections} />;
}
