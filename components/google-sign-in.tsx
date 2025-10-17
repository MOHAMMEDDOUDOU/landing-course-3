"use client"

import { useEffect } from "react"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

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

export function GoogleSignIn() {
  const { loginWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              await loginWithGoogle(response.credential)
              router.push("/")
            } catch (error: any) {
              alert(error.message)
            }
          },
        })

        const buttonDiv = document.getElementById("google-signin-button")
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            locale: "ar",
          })
        }
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [loginWithGoogle, router])

  return <div id="google-signin-button" className="w-full" />
}
