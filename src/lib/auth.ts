// Single-password gate. No accounts, no user table.
//
// A correct password sets a cookie whose value is an HMAC signature keyed by
// AUTH_SECRET. Middleware recomputes the signature to verify the cookie, so a
// forged cookie can't get in without knowing the secret.
//
// Uses Web Crypto (globalThis.crypto.subtle) so it runs in both the Node
// runtime and Edge middleware.

export const AUTH_COOKIE = "trip_auth";

// Dev fallbacks so the app runs locally with zero config. In production you
// MUST set APP_PASSWORD and AUTH_SECRET (see README) — these defaults are not
// secret.
export function getPassword(): string {
  return process.env.APP_PASSWORD || "traveller";
}

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toBase64Url(new Uint8Array(sig));
}

// The signed value we store in the cookie when logged in.
export async function makeToken(): Promise<string> {
  return hmac("authenticated", getSecret());
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await makeToken();
  // Length check first, then a plain compare — timing here isn't a
  // meaningful attack surface for a personal single-user app.
  return token.length === expected.length && token === expected;
}

export function checkPassword(input: string): boolean {
  return input === getPassword();
}
