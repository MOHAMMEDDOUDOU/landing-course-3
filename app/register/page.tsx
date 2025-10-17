import { RegisterForm } from "@/components/register-form"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { EnvDebug } from "@/components/env-debug"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" suppressHydrationWarning>
      <div className="container flex min-h-screen flex-col items-center justify-center py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">كورس AI للبرمجة</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold">ابدأ رحلتك الآن</h1>
            <p className="text-muted-foreground">أنشئ حساباً جديداً للانضمام للكورس</p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              سجل دخولك هنا
            </Link>
          </p>
        </div>
      </div>
      <EnvDebug />
    </div>
  )
}
