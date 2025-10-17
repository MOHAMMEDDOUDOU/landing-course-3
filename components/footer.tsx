import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">كورس AI للبرمجة</span>
            </Link>
            <p className="max-w-md leading-relaxed text-muted-foreground">
              تعلم البرمجة الاحترافية باستخدام أحدث تقنيات الذكاء الاصطناعي. من الصفر إلى الاحتراف في رحلة تعليمية
              شاملة.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground">
                  المميزات
                </Link>
              </li>
              <li>
                <Link href="/#content" className="hover:text-foreground">
                  المحتوى
                </Link>
              </li>
              <li>
                <Link href="/#enroll" className="hover:text-foreground">
                  التسجيل
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">تواصل معنا</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@aicourse.com</li>
              <li>+966 XX XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 كورس AI للبرمجة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
