"use client"

import { useState, useEffect } from "react"

export function GoogleOAuthStatus() {
  const [status, setStatus] = useState<{
    hasClientId: boolean
    clientId: string | undefined
    isValid: boolean
  }>({
    hasClientId: false,
    clientId: undefined,
    isValid: false
  })

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const hasClientId = !!clientId
    const isValid = hasClientId && 
      clientId !== 'your_google_client_id_here' && 
      clientId.length > 10 &&
      clientId.includes('googleusercontent.com')

    setStatus({
      hasClientId,
      clientId,
      isValid
    })
  }, [])

  if (status.isValid) {
    return null // Don't show anything if everything is configured correctly
  }

  return (
    <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg bg-yellow-50 border-yellow-200">
      <div className="font-medium text-yellow-800 mb-2">⚠️ Google OAuth غير مُعد بشكل صحيح</div>
      <div className="text-xs text-yellow-700 space-y-1">
        <div>يرجى إضافة NEXT_PUBLIC_GOOGLE_CLIENT_ID الصحيح إلى ملف .env.local</div>
        <div className="font-mono bg-yellow-100 p-1 rounded">
          {status.clientId || 'غير محدد'}
        </div>
        <div className="text-xs">
          يجب أن يحتوي على "googleusercontent.com" وأن يكون أطول من 10 أحرف
        </div>
      </div>
    </div>
  )
}