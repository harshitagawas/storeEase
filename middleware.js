import { NextResponse } from "next/server";

/**
 * Next.js Middleware for Route Protection
 *
 * This middleware runs on the server before each request.
 * It checks for authentication and redirects users accordingly.
 *
 * Route Protection Logic:
 *
 * PROTECTED ROUTES (require authentication):
 * - /dashboard/* → If no token → redirect to /login
 *
 * PUBLIC AUTH ROUTES (should NOT be accessible when logged in):
 * - /login → If token exists → redirect to /dashboard
 * - /signup → If token exists → redirect to /dashboard
 *
 * PUBLIC ROUTES (accessible to everyone):
 * - / (landing page)
 * - /forgot-password
 * - /reset-password
 * - /api/* (API routes)
 */

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the auth token from cookies
  // We set this cookie when user logs in (see LoginForm.jsx)
  const token = request.cookies.get("auth-token")?.value;

  // ============================================
  // PROTECTED ROUTES: /dashboard/*
  // ============================================
  // If user tries to access dashboard without token → redirect to login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Add a message to show why they were redirected
      loginUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(loginUrl);
    }
    // Token exists → allow access to dashboard
    return NextResponse.next();
  }

  // ============================================
  // PUBLIC AUTH ROUTES: /login, /signup
  // ============================================
  // If user is already logged in → redirect to dashboard
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      // User is already logged in → redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // No token → allow access to login/signup pages
    return NextResponse.next();
  }

  // ============================================
  // ALL OTHER ROUTES: Allow access
  // ============================================
  // Public routes like /, /forgot-password, /reset-password, /api/*
  // are accessible to everyone (no protection needed)
  return NextResponse.next();
}

/**
 * Config: Define which routes should trigger this middleware
 *
 * Matcher patterns:
 * - '/dashboard/:path*' → matches /dashboard and all sub-routes
 * - '/login' → matches /login exactly
 * - '/signup' → matches /signup exactly
 *
 * We exclude:
 * - /api/* → API routes handle their own auth
 * - Static files (images, fonts, etc.)
 * - _next/* → Next.js internal files
 */
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
