import { type NextRequest, NextResponse } from "next/server"
import { setAuthCookie } from "@/lib/auth"
import { randomUUID } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("[v0] Google OAuth error:", error)
      return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NODE_ENV === "production" ? "https://your-domain.com" : "http://localhost:3000"}/api/auth/google/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      console.error("[v0] Token exchange failed:", await tokenResponse.text())
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url))
    }

    const tokenData = await tokenResponse.json()
    const { access_token } = tokenData

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error("[v0] User info fetch failed:", await userResponse.text())
      return NextResponse.redirect(new URL("/login?error=user_info_failed", request.url))
    }

    const userData = await userResponse.json()
    const { id: googleId, email, name, picture } = userData

    const { createUser, getUserByEmail, getUserByGoogleId, updateUserGoogleId } = await import("@/lib/db")

    // Check if user exists with Google ID
    let user = await getUserByGoogleId(googleId)

    if (!user) {
      // Check if user exists with same email
      user = await getUserByEmail(email)

      if (user) {
        // Link Google account to existing user
        user = await updateUserGoogleId(user.id, googleId)
      } else {
        // Create new user
        user = await createUser({
          email,
          name,
          googleId,
          avatarUrl: picture,
          emailVerified: true,
        })
      }
    }

    // Create session token
    const sessionToken = randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const { createSession, updateUserLoginTime } = await import("@/lib/db")
    await createSession(user.id, sessionToken, expiresAt)
    await updateUserLoginTime(user.id)

    // Set cookie with session token
    await setAuthCookie(sessionToken, true)

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error: any) {
    console.error("[v0] Google OAuth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url))
  }
}