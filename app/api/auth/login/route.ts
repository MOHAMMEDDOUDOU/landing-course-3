import { type NextRequest, NextResponse } from "next/server"
import { generateToken, verifyPassword, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 })
    }

    const { getUserByEmail } = await import("@/lib/db")

    // Get user
    const user = await getUserByEmail(email)
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
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
      },
    })
  } catch (error: any) {
    console.error("[v0] Login error:", error)

    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "جداول قاعدة البيانات غير موجودة. يرجى تشغيل SQL scripts من مجلد /scripts",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
  }
}
