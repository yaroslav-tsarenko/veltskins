import { COMPANY } from "@/lib/company";

const POLICY_DATE = "2026-10-06";

export const STORE_POLICY = {
  currency: "USD",
  supportedCurrencies: ["USD", "EUR", "GBP"],
  vatRegistered: COMPANY.vatRegistered,
  tax: {
    vatRatePercent: 20,
    pricesIncludeVat: true,
  },
  markets: {
    countries: ["United Kingdom", "European Union member states"],
  },
  delivery: {
    method: "Steam trade offer",
    game: "Counter-Strike 2",
    usualTime: "normally a matter of minutes after the payment clears",
    deadlineHours: 24,
    offerExpiryNote: "Every trade offer runs to an expiry time, printed both on the offer inside Steam and on your order page.",
    tradeProtectionDays: 7,
    tradeHoldMaxDays: 15,
    requirements: [
      "a Steam account in good standing, carrying neither a trade ban nor a trade cooldown",
      "the Steam Guard Mobile Authenticator enabled for 7 days or longer",
      "a Steam inventory set to public",
      "a current Steam trade URL stored against your account",
    ],
  },
  returns: {
    withdrawalDays: 14,
    refundDays: 14,
    refundMethod: "the original payment method",
  },
  guarantee: {
    summary: "Where an item you have paid for cannot be delivered, or where Steam reverses the trade while that item sits under Steam trade protection, the full price you paid for it comes back to you.",
  },
  limits: {
    maxQtyPerItem: 1,
    maxItemsPerOrder: 10,
  },
  minAge: 18,
  policiesLastUpdated: POLICY_DATE,
  waiver: {
    version: POLICY_DATE,
    text: "I want delivery to begin as soon as my payment goes through, and I accept that my right to cancel ends once the trade offer has been sent.",
  },
  support: {
    replyTime: "within 1 business day",
    channels: ["email", "contact form"],
  },
  payment: {
    methods: ["Visa", "Mastercard"],
    providerName: null as string | null,
    chargeCurrencies: ["USD", "EUR", "GBP"],
  },
  orders: {
    cancelBefore: "the Steam trade offer leaves us",
  },
  complaints: {
    acknowledgeTime: "within 1 business day",
    responseDays: 14,
  },
  processors: [
    { role: "Card payments", purpose: "Handles card payments on a hosted page of its own and carries out the 3-D Secure checks", name: null as string | null },
    { role: "Item delivery partner", purpose: "Obtains the item you bought and dispatches the Steam trade offer to your account from your Steam ID and trade URL", name: null as string | null },
    { role: "Steam (Valve Corporation)", purpose: "Authenticates you whenever you pick Steam sign-in, and conveys the trade offer into your account", name: "Valve Corporation" as string | null },
    { role: "Website hosting and database", purpose: "Keeps the shop running and holds the account and order records", name: null as string | null },
    { role: "Email delivery", purpose: "Dispatches the order, account and support email", name: null as string | null },
  ],
  retention: {
    orderRecordsYears: 6,
    supportMessagesMonths: 24,
    inactiveAccountYears: 3,
  },
} as const;
