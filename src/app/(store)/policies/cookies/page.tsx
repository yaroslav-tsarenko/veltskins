import Link from "next/link";
import { PolicyLayout, policyMetadata, policyTable, type PolicySection } from "@/components/layout/PolicyLayout/PolicyLayout";
import { CookieSettingsButton } from "@/components/layout/PolicyLayout/CookieSettingsButton";
import { COOKIE_CATEGORIES, COOKIE_TABLE, type CookieRecord } from "@/config/cookies";
import { POLICY_FACTS as F } from "@/lib/policy-facts";

export const generateMetadata = policyMetadata(
  "cookies",
  `A full register of the cookies and browser storage keys in use at ${F.brand}: what each holds, how long it survives and how to revise your consent.`,
);

function CookieTable({ rows }: { rows: CookieRecord[] }) {
  return (
    <>
      <table className={`${policyTable} hidden md:table`}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Provider</th>
            <th scope="col">Purpose</th>
            <th scope="col">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="font-mono text-ui-xs text-ink [overflow-wrap:anywhere]">{row.name}</td>
              <td className="whitespace-nowrap text-ink-muted">{row.kind}</td>
              <td className="text-ink-muted">{row.provider}</td>
              <td>{row.purpose}</td>
              <td className="text-ink-muted">{row.expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div role="list" className="mt-5 border-t border-line md:hidden">
        {rows.map((row) => (
          <div role="listitem" key={row.name} className="border-b border-line py-4">
            <div className="font-mono text-ui-xs text-ink [overflow-wrap:anywhere]">{row.name}</div>
            <div className="mt-1 text-ui-sm">{row.purpose}</div>
            <div className="meta mt-2 text-ink-muted">
              {row.kind} · {row.provider} · {row.expiry}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const necessary = COOKIE_CATEGORIES.find((c) => c.id === "necessary");
const consentKey = COOKIE_TABLE.necessary.find((r) => r.name.endsWith("-consent"))?.name;

const sections: PolicySection[] = [
  {
    id: "what",
    title: "The ground this covers",
    body: (
      <>
        <p>
          A cookie is a short text file a site leaves in your browser. Local storage and session storage do a comparable job, holding
          their contents on your own device and nowhere else. Set out below is the complete register of cookies and storage keys that{" "}
          {F.brand} puts on {F.domain}.
        </p>
        <p>
          It is the same register that Cookie settings reveals under “Show cookies”. Lots you save sit in your account on our
          server; nothing about them is held in the browser.
        </p>
      </>
    ),
  },
  {
    id: "necessary",
    title: "The ones that cannot be switched off",
    body: (
      <>
        <p>{necessary?.purpose} There is no switch for these, since the shop would not function without them, and none of them serves advertising.</p>
        <CookieTable rows={COOKIE_TABLE.necessary} />
      </>
    ),
  },
  {
    id: "optional",
    title: "Analytics and marketing",
    body: (
      <>
        <p>
          Neither an analytics cookie nor a marketing cookie is set by {F.brand} as things stand. Both categories appear in Cookie
          settings and stay off unless you turn them on. Should we ever adopt such a tool, each cookie it sets will be registered on this
          page beforehand, and it will load only once you have allowed that category.
        </p>
        {COOKIE_TABLE.analytics.length ? <CookieTable rows={COOKIE_TABLE.analytics} /> : null}
        {COOKIE_TABLE.marketing.length ? <CookieTable rows={COOKIE_TABLE.marketing} /> : null}
      </>
    ),
  },
  {
    id: "choice",
    title: "Revising your choice",
    body: (
      <>
        <p>
          Accept all, Reject all and Customise are the three options the banner puts to you on a first visit. Nothing about that choice
          is permanent: the <strong>Cookie settings</strong> link in the footer of every page reopens it, as does the button below.
          Taking consent back is exactly as easy as granting it, and it bites immediately.
        </p>
        <p>
          Local storage keeps the record of your choice under <code className="font-mono text-ui-xs">{consentKey}</code> for 12 months,
          and the question is put to you afresh once that runs out.
        </p>
        <div className="mt-6">
          <CookieSettingsButton />
        </div>
        <p>
          Clearing cookies and site data from your browser settings works too. Clear the necessary ones and you will find your bag empty
          and yourself signed out.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "The provider\u2019s payment page",
    body: (
      <p>
        Paying sends you to a page hosted by our payment provider. The provider operates that page on a domain of its own and may set
        cookies there for security and fraud prevention, governed by its cookie policy rather than this one. The{" "}
        <Link href="/policies/payment">Payment policy</Link> has the rest.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Revisions",
    body: (
      <p>
        Add or drop a cookie or a storage key and this register is revised to match. Anything unclear: {F.email}. Our treatment of
        personal data belongs to the <Link href="/policies/privacy">Privacy policy</Link>.
      </p>
    ),
  },
];

export default async function CookiesPage() {
  return <PolicyLayout slug="cookies" sections={sections} />;
}
