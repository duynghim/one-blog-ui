import { NextRequest, NextResponse } from "next/server";

// Decode JWT payload without verifying signature; used only for client-side routing decisions.
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const decoded = typeof atob === "function"
      ? atob(payload)
      : Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isNotExpired(payload: Record<string, any> | null): boolean {
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
      console.info(
        "[middleware] Redirecting authenticated user from /login to /",
        {
          time: new Date().toISOString(),
          ip: request.ip ?? "unknown",
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