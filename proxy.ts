import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export default function proxy(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  const path = req.nextUrl.pathname;
  // only rate-limit mutating requests — never block page loads (which showed “couldn’t load”)
  const isWrite = req.method !== "GET" || path.startsWith("/api");
  if (!isWrite) return NextResponse.next();
  const { ok, remaining, reset } = rateLimit(`global:${ip}:w`, 30, 60_000);
  const res = ok ? NextResponse.next() : NextResponse.json({ error: "Rate limited — try again shortly" }, { status: 429 });
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  res.headers.set("X-RateLimit-Reset", String(reset));
  if (!ok) res.headers.set("Retry-After", String(Math.ceil((reset - Date.now()) / 1000)));
  return res;
}

export const config = {
  matcher: ["/api/:path*", "/login"],
};
