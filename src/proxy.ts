import { type NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/token-edge";

function paymentsUnavailable(): boolean {
  const provider = (process.env.PAYMENT_PROVIDER ?? "none").trim().toLowerCase();
  if (provider === "none") return true;
  if (provider === "mock") return process.env.NODE_ENV === "production" || process.env.PAYMENT_MOCK_ENABLED !== "true";
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/checkout") {
    if (paymentsUnavailable()) {
      return NextResponse.rewrite(new URL("/checkout/unavailable", request.url), { status: 503 });
    }
    return NextResponse.next();
  }

  const token = request.cookies.get("session_token")?.value;
  const payload = token ? await verifyTokenEdge(token) : null;

  if (!payload) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/checkout"],
};
