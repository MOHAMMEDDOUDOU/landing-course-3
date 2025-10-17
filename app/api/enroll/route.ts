import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 })
    }

    const { enrollUserInCourse, isUserEnrolled } = await import("@/lib/db")

    // Check if already enrolled
    const alreadyEnrolled = await isUserEnrolled(currentUser.userId)
    if (alreadyEnrolled) {
      return NextResponse.json({ error: "أنت مسجل بالفعل في الكورس" }, { status: 400 })
    }

    // Enroll user
    await enrollUserInCourse(currentUser.userId)

    return NextResponse.json({
      success: true,
      message: "تم التسجيل في الكورس بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Enrollment error:", error)

    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "جداول قاعدة البيانات غير موجودة. يرجى تشغيل SQL scripts من مجلد /scripts",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: "حدث خطأ أثناء التسجيل في الكورس" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ enrolled: false })
    }

    const { isUserEnrolled } = await import("@/lib/db")
    const enrolled = await isUserEnrolled(currentUser.userId)

    return NextResponse.json({ enrolled })
  } catch (error) {
    console.error("[v0] Check enrollment error:", error)
    return NextResponse.json({ enrolled: false })
  }
}
