import { NextResponse } from "next/server"
import { clearAuthCookie, getCurrentUser } from "@/lib/auth"

export async function POST() {
  try {
    // Get current user to clean up their sessions
    const user = await getCurrentUser()
    
    if (user) {
      const { deleteUserSessions } = await import("@/lib/db")
      await deleteUserSessions(user.userId)
    }
    
    await clearAuthCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الخروج" }, { status: 500 })
  }
}
