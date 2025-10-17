"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Code, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>كورس احترافي بتقنية الذكاء الاصطناعي</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            احترف البرمجة مع{" "}
            <span className="bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
              الذكاء الاصطناعي
            </span>
          </h1>

          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            تعلم كيف تبرمج أي موقع أو تطبيق تريده باستخدام أحدث تقنيات الذكاء الاصطناعي. من الصفر إلى الاحتراف في رحلة
            تعليمية شاملة ومنظمة.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Button size="lg" className="gap-2 text-lg" asChild>
                <Link href="#enroll">
                  سجل في الكورس الآن
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="gap-2 text-lg" asChild>
                <Link href="/register">
                  ابدأ رحلتك الآن
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" className="gap-2 text-lg bg-transparent">
              شاهد المحتوى
            </Button>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">تعلم عملي</h3>
              <p className="text-sm text-muted-foreground">مشاريع حقيقية وتطبيقات عملية</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold">بتقنية AI</h3>
              <p className="text-sm text-muted-foreground">استخدام أحدث أدوات الذكاء الاصطناعي</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">نتائج سريعة</h3>
              <p className="text-sm text-muted-foreground">ابني مشاريعك من اليوم الأول</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
