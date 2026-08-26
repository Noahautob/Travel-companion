import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

// Everything is gated except the login page and the login API itself.
const PUBLIC_PATHS = ["/login", "/api/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (await verifyToken(token)) {
    return NextResponse.next();
  }

  // API calls get a 401; page loads get bounced to the login screen.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run on everything except Next internals, and the PUBLIC files iOS/browsers
  // fetch without a login cookie: the home-screen icons and the web manifest.
  // These hold no trip data, so gating them just breaks the icon and install.
  // (Photos stay gated — they're served through /api/photos.)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|icon-192.png|icon-512.png|manifest.webmanifest).*)",
  ],
};
