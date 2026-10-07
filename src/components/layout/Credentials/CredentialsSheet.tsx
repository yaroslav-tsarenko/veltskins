import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils/cn";

export function credentialRows(): { label: string; value: ReactNode; mono?: boolean }[] {
  return [
    { label: "Company", value: COMPANY.name },
    { label: "Company number", value: COMPANY.companyNumber, mono: true },
    ...(COMPANY.vatRegistered ? [{ label: "VAT number", value: COMPANY.vatNumber, mono: true }] : []),
    { label: "Registered office", value: COMPANY.registeredOffice },
    {
      label: "Email",
      value: (
        <a href={`mailto:${COMPANY.email}`} className="break-all decoration-1 underline-offset-4 hover-device:hover:underline">
          {COMPANY.email}
        </a>
      ),
    },
    ...(COMPANY.phone
      ? [
          {
            label: "Phone",
            mono: true,
            value: (
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="decoration-1 underline-offset-4 hover-device:hover:underline">
                {COMPANY.phone}
              </a>
            ),
          },
        ]
      : []),
    { label: "Support hours", value: COMPANY.supportHours },
  ];
}

export function CredentialsSheet({ stacked = false, className }: { stacked?: boolean; className?: string }) {
  const rows = credentialRows();

  return (
    <section aria-label="Company details" data-credentials="" className={className}>
      <p className="m-0 text-ui-md text-ink">
        {BRAND.name} is a trading name of {COMPANY.name}.
      </p>
      <dl className={cn("m-0 mt-5 grid grid-cols-1 gap-x-12 gap-y-2.5", !stacked && "sm:grid-cols-2")}>
        {rows.map((row) => (
          <div key={row.label} className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
            <dt className="label-caps shrink-0 text-ink-muted">{row.label}</dt>
            <dd className={cn("m-0 min-w-0 text-ink", row.mono ? "font-mono text-data" : "text-ui-md")}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CredentialsLine({ className }: { className?: string }) {
  return (
    <p className={cn("m-0 text-ui-sm text-ink-muted", className)}>
      {BRAND.name} is a trading name of {COMPANY.name}
      {" · "}
      Company number {COMPANY.companyNumber}
      {COMPANY.vatRegistered ? ` · VAT ${COMPANY.vatNumber}` : ""}
      {" · "}
      {COMPANY.registeredOffice}
      {" · "}
      <a href={`mailto:${COMPANY.email}`} className="decoration-1 underline-offset-4 hover-device:hover:underline">
        {COMPANY.email}
      </a>
    </p>
  );
}

export const VALVE_DISCLAIMER = `${BRAND.name} is an independent store and is not affiliated with, sponsored by or endorsed by Valve Corporation. Counter-Strike, CS2, Steam and the Steam logo are trademarks of Valve Corporation and are used here only to describe the items we sell.`;
