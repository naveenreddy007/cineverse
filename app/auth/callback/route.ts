import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user data
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user exists in our users table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      // If user doesn't exist in our table, create a profile
      if (!existingUser && !fetchError) {
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name || user.email?.split("@")[0],
          avatar_url: user.user_metadata.avatar_url,
          role: "user",
        })

        if (insertError) {
          console.error("Error creating user profile:", insertError)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
