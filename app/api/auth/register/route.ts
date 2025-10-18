import { type NextRequest, NextResponse } from "next/server"
import { generateToken, hashPassword, setAuthCookie } from "@/lib/auth"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    const { createUser, getUserByEmail, updateUserPassword } = await import("@/lib/db")

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      // If user exists but has no password (Google-only account), add password
      if (!existingUser.password_hash) {
        const passwordHash = await hashPassword(password)
        await updateUserPassword(existingUser.id, passwordHash)
        
        // Create session token
        const sessionToken = uuidv4()
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        
        const { createSession, updateUserLoginTime } = await import("@/lib/db")
        await createSession(existingUser.id, sessionToken, expiresAt)
        await updateUserLoginTime(existingUser.id)
        
        // Set cookie with session token
        await setAuthCookie(sessionToken, true)
        
        return NextResponse.json({
          success: true,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            avatarUrl: existingUser.avatar_url,
          },
        })
      } else {
        // User already has password, cannot register again
        return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 })
      }
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const user = await createUser({
      email,
      passwordHash,
      name,
      emailVerified: false, // Email verification can be added later
    })

    // Create session token
    const sessionToken = randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const { createSession, updateUserLoginTime } = await import("@/lib/db")
    await createSession(user.id, sessionToken, expiresAt)
    await updateUserLoginTime(user.id)

    // Set cookie with session token
    await setAuthCookie(sessionToken, true)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error: any) {
    console.error("[v0] Registration error:", error)

    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "جداول قاعدة البيانات غير موجودة. يرجى تشغيل SQL scripts من مجلد /scripts",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 })
  }
}
