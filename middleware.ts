import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // This is a simplified middleware that doesn't actually check auth
  // In a real app, you would verify the session/token here

  // For demo purposes, we'll just redirect to login if accessing protected routes
  if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")) {
    // Check if user is logged in by looking for a token in localStorage
    // Since this is server-side code, we can't access localStorage directly
    // In a real app, you would check for a valid session cookie

    // For demo purposes, we'll just let it pass through and let client-side auth handle it
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}

