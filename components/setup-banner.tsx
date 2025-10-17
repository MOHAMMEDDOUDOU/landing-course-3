"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Database, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SetupBanner() {
  const hasDatabase = !!process.env.NEXT_PUBLIC_DATABASE_CONFIGURED
  const hasJWT = !!process.env.NEXT_PUBLIC_JWT_CONFIGURED

  if (hasDatabase && hasJWT) {
    return null
  }

  return (
    <div className="border-b border-border/40 bg-muted/50">
      <div className="container py-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>يتطلب الموقع إعداد إضافي</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>لتفعيل نظام المصادقة، يرجى إضافة المتغيرات التالية في قسم Vars من الشريط الجانبي:</p>
            <ul className="mr-6 list-disc space-y-1 text-sm">
              {!hasDatabase && (
                <li className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <code className="rounded bg-muted px-2 py-1">DATABASE_URL</code> - رابط قاعدة بيانات Neon
                </li>
              )}
              {!hasJWT && (
                <li className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <code className="rounded bg-muted px-2 py-1">JWT_SECRET</code> - مفتاح سري للجلسات
                </li>
              )}
            </ul>
            <div className="mt-3">
              <Button variant="outline" size="sm" asChild>
                <a href="#setup-instructions">عرض التعليمات الكاملة</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
