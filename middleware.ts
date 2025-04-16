import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_ROUTES = [
  "/",
  "/startUps",
  "/sign-in",
  "/sign-up",
  "/about",
  /^\/startup\/[^/]+$/,
];

export async function middleware(req: NextRequest) {
  const session = await auth(); // Get user session (adjust based on your auth setup)
  const { pathname } = req.nextUrl;

  // Check if route is public
  const isPublic = PUBLIC_ROUTES.some((route) =>
    route instanceof RegExp ? route.test(pathname) : route === pathname
  );

  // Allow access to public routes
  if (isPublic) return NextResponse.next();

  // If user is not authenticated, redirect to sign-in
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Proceed to protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
