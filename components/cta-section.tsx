"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CTASection() {
  const { user } = useAuth()
  const router = useRouter()
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState("")

  const handleEnroll = async () => {
    if (!user) {
      router.push("/register")
      return
    }

    setEnrolling(true)
    setError("")

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "فشل التسجيل")
      }

      setEnrolled(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <section id="enroll" className="py-24">
      <div className="container">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardContent className="p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">ابدأ رحلتك البرمجية اليوم</h2>
              <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground">
                انضم لآلاف المتعلمين الذين حولوا شغفهم بالبرمجة إلى مهارة احترافية
              </p>

              <div className="mb-8 grid gap-4 text-right sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                  <span className="font-medium">وصول مدى الحياة</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                  <span className="font-medium">تحديثات مستمرة</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                  <span className="font-medium">دعم فني متواصل</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                  <span className="font-medium">شهادة إتمام</span>
                </div>
              </div>

              {enrolled ? (
                <div className="rounded-lg bg-primary/10 p-6 text-primary">
                  <CheckCircle2 className="mx-auto mb-2 h-12 w-12" />
                  <p className="text-lg font-semibold">تم التسجيل بنجاح!</p>
                  <p className="mt-2 text-sm">سنتواصل معك قريباً بتفاصيل الكورس</p>
                </div>
              ) : (
                <>
                  <Button size="lg" className="gap-2 text-lg" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? "جاري التسجيل..." : user ? "سجل في الكورس الآن" : "ابدأ الآن"}
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

                  {!user && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      لديك حساب بالفعل؟{" "}
                      <Link href="/login" className="font-medium text-primary hover:underline">
                        سجل دخولك هنا
                      </Link>
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
