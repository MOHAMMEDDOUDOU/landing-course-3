import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container flex min-h-screen flex-col items-center justify-center py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">كورس AI للبرمجة</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold">مرحباً بعودتك</h1>
            <p className="text-muted-foreground">سجل دخولك للمتابعة</p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
