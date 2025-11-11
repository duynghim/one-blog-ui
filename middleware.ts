import { NextRequest, NextResponse } from "next/server";

// Strongly-typed JWT payload used by middleware
interface JwtPayload {
  exp: number;
  sub?: string;
  [claim: string]: unknown;
}   

function isJwtPayload(value: unknown): value is JwtPayload {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  const hasValidExp = typeof obj.exp === "number";
  const hasValidSub = obj.sub === undefined || typeof obj.sub === "string";
  return hasValidExp && hasValidSub;
}

// Decode JWT payload without verifying signature; used only for client-side routing decisions.
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/");
    const decoded = typeof atob === "function"
      ? atob(payload)
      : Buffer.from(payload, "base64").toString("utf-8");
    const parsed: unknown = JSON.parse(decoded);
    return isJwtPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isNotExpired(payload: JwtPayload | null): boolean {
  if (!payload || typeof payload.exp !== "number") return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /login redirects here for performance and consistency
  if (pathname === "/login") {
    const jwt = request.cookies.get("jwt")?.value;
    const payload = jwt ? decodeJwtPayload(jwt) : null;

    if (jwt && isNotExpired(payload)) {
      // Minimal, non-sensitive audit log
      const ipAddr =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        request.headers.get("cf-connecting-ip") ??
        "unknown";

      console.info(
        "[middleware] Redirecting authenticated user from /login to /",
        {
          time: new Date().toISOString(),
          ip: ipAddr,
          user: payload?.sub ?? "unknown",
        },
      );

      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Limit middleware to login route for efficiency
export const config = {
  matcher: ["/login"],
};