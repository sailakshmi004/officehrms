// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (no auth needed)
  const publicPaths = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
  ];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Read auth cookie
  const token = request.cookies.get("auth_token")?.value;

  // If no token → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * OPTIONAL: Role-based protection
   * Example: only ADMIN & HR can access /dashboard/admin
   */
  if (pathname.startsWith("/dashboard/admin")) {
    const role = request.cookies.get("role")?.value;

    if (role !== "ADMIN" && role !== "HR") {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  return NextResponse.next();
}

/**
 * IMPORTANT:
 * Matcher tells Next.js when to run middleware
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
