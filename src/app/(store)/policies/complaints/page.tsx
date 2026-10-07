import Link from "next/link";
import { PolicyLayout, policyMetadata, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "complaints",
  `Raising a complaint with ${F.brand}: acknowledged ${F.complaintsAck}, answered in full inside ${F.complaintsDays} days, with the escalation routes set out.`,
);

const sections: PolicySection[] = [
  {
    id: "how",
    title: "Where to send it",
    body: (
      <>
        <p>
          {F.email} reaches us, as does the <Link href="/contact">contact form</Link>. Give us:
        </p>
        <ul>
          <li>your name, with the email address the order was placed under;</li>
          <li>the order number, where an order is what the complaint concerns;</li>
          <li>an account of what went wrong, with photographs if a lot arrived damaged or faulty;</li>
          <li>the outcome you are looking for.</li>
        </ul>
        <p>We are at our desks {F.supportHours}.</p>
      </>
    ),
  },
  {
    id: "timeline",
    title: "How it proceeds",
    body: (
      <ol>
        <li>Acknowledgement reaches you {F.complaintsAck}, naming whoever has taken it on.</li>
        <li>We investigate, which can mean pulling the trade offer record from our delivery partner.</li>
        <li>
          A full answer follows within {F.complaintsDays} days, setting out what we found and what we intend to do. Where more time is
          needed — a reversed Steam trade still being checked, for instance — we explain why and say when to expect us.
        </li>
      </ol>
    ),
  },
  {
    id: "escalate",
    title: "If our answer does not satisfy you",
    body: (
      <>
        <p>
          Reply to it and ask for a review. Someone else on the team takes a fresh look and responds within {F.complaintsDays} days.
        </p>
        <p>
          Where agreement still proves impossible, the consumer advice service for your country is open to you: Citizens Advice across
          England, Wales and Scotland, Consumerline in Northern Ireland, or the European Consumer Centre in your EU member state. A
          court claim is also available, on the basis described in the governing law section of our{" "}
          <Link href="/policies/terms#law">Terms and conditions</Link>.
        </p>
        <p>Where the complaint is about our use of personal data, a data protection authority can hear it too, as our <Link href="/policies/privacy#rights">Privacy policy</Link> explains.</p>
      </>
    ),
  },
  {
    id: "records",
    title: "Records",
    body: (
      <p>
        A complaint and our answer to it are kept on file for {F.retention.supportMessagesMonths} months, which lets us follow up and
        lets us learn something from it.
      </p>
    ),
  },
];

export default async function ComplaintsPage() {
  return <PolicyLayout slug="complaints" sections={sections} />;
}
