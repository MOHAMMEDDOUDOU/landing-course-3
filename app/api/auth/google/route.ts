import { type NextRequest, NextResponse } from "next/server"
import { generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json({ error: "بيانات Google غير صحيحة" }, { status: 400 })
    }

    const { createUser, getUserByEmail, getUserByGoogleId, updateUserGoogleId } = await import("@/lib/db")

    // Decode Google JWT (in production, verify signature)
    const payload = JSON.parse(Buffer.from(credential.split(".")[1], "base64").toString())

    const { sub: googleId, email, name, picture } = payload

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
        })
      }
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
      },
    })
  } catch (error: any) {
    console.error("[v0] Google auth error:", error)

    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "جداول قاعدة البيانات غير موجودة. يرجى تشغيل SQL scripts من مجلد /scripts",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول عبر Google" }, { status: 500 })
  }
}
