"use client"

import { useEffect } from "react"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { ClientOnly } from "./client-only"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
        }
      }
    }
  }
}

function GoogleSignInInner() {
  const { loginWithGoogle } = useAuth()
  const router = useRouter()
  const hasGoogleClientId = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!hasGoogleClientId) return

    // Load Google Sign-In script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: any) => {
            try {
              await loginWithGoogle(response.credential)
              router.push("/")
            } catch (error: any) {
              console.error("Google login error:", error)
              alert(error.message || "حدث خطأ أثناء تسجيل الدخول عبر Google")
            }
          },
        })

        const buttonDiv = document.getElementById("google-signin-button")
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 300,
            text: "continue_with",
            locale: "ar",
          })
        }
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [hasGoogleClientId, loginWithGoogle, router])

  return (
    <div className="w-full">
      {!hasGoogleClientId && (
        <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
          Google OAuth غير مُعد. يرجى إضافة NEXT_PUBLIC_GOOGLE_CLIENT_ID إلى متغيرات البيئة.
        </div>
      )}
      <div id="google-signin-button" className="w-full" />
    </div>
  )
}

export function GoogleSignIn() {
  return (
    <ClientOnly fallback={<div id="google-signin-button" className="w-full" />}>
      <GoogleSignInInner />
    </ClientOnly>
  )
}
