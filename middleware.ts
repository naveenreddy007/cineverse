import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/" || path.startsWith("/api/auth")

  // Check if user is authenticated by looking for the auth cookie
  const isAuthenticated = request.cookies.has("movieDashboardUser")

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthenticated && (path === "/login" || path === "/register")) {
    // Redirect authenticated users to dashboard if they try to access login/register
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
