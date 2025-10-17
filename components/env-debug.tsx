"use client"

import { useState, useEffect } from "react"

export function EnvDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NODE_ENV: process.env.NODE_ENV,
    })
  }, [])

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔧 Environment Debug</div>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="text-yellow-300">{key}:</span>
          <br />
          <span className="text-green-300 font-mono break-all">
            {value || 'undefined'}
          </span>
        </div>
      ))}
    </div>
  )
}