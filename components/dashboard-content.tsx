"use client"

import { useAuth } from "./auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "./header"
import { Footer } from "./footer"
import { BookOpen, CheckCircle2, Clock, Award, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    checkEnrollment()
  }, [])

  const checkEnrollment = async () => {
    try {
      const response = await fetch("/api/enroll")
      const data = await response.json()
      setEnrolled(data.enrolled)
    } catch (error) {
      console.error("[v0] Failed to check enrollment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
      })

      if (response.ok) {
        setEnrolled(true)
      }
    } catch (error) {
      console.error("[v0] Enrollment failed:", error)
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">مرحباً، {user?.name || "المتعلم"}!</h1>
          <p className="text-lg text-muted-foreground">لوحة التحكم الخاصة بك</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !enrolled ? (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">لم تسجل في الكورس بعد</CardTitle>
              <CardDescription>سجل الآن للوصول إلى جميع محتويات الكورس والمواد التعليمية</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={handleEnroll} disabled={enrolling} className="gap-2">
                {enrolling ? "جاري التسجيل..." : "سجل في الكورس الآن"}
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الدروس المكتملة</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 / 48</div>
                  <p className="text-xs text-muted-foreground">0% مكتمل</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ساعات التعلم</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 ساعة</div>
                  <p className="text-xs text-muted-foreground">من أصل 120 ساعة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 / 6</div>
                  <p className="text-xs text-muted-foreground">لم تبدأ بعد</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الشهادة</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">غير متاحة</div>
                  <p className="text-xs text-muted-foreground">أكمل الكورس أولاً</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ابدأ التعلم</CardTitle>
                  <CardDescription>الدرس التالي في رحلتك التعليمية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">الوحدة 1</span>
                        <span className="text-sm text-muted-foreground">0%</span>
                      </div>
                      <h3 className="mb-2 font-semibold">المقدمة والأساسيات</h3>
                      <p className="mb-4 text-sm text-muted-foreground">تعرف على أساسيات البرمجة والذكاء الاصطناعي</p>
                      <Button className="w-full">ابدأ الآن</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>آخر التحديثات</CardTitle>
                  <CardDescription>جديد الكورس والمحتوى</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">مرحباً بك في الكورس!</p>
                        <p className="text-sm text-muted-foreground">ابدأ رحلتك التعليمية الآن</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
