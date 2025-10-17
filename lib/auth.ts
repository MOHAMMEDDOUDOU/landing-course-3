import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ai-course-2024-jwt-secret-key-9f8e7d6c5b4a3210-change-in-production",
)

export interface JWTPayload {
  userId: number
  email: string
  name?: string
}

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Get current user from cookies
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  // First try to verify JWT token
  const jwtPayload = await verifyToken(token)
  if (jwtPayload) {
    return jwtPayload
  }

  // If JWT is invalid, try session-based auth
  const { getSession, updateSessionAccess } = await import("@/lib/db")
  const session = await getSession(token)
  
  if (session) {
    // Update last accessed time
    await updateSessionAccess(token)
    
    return {
      userId: session.user_id,
      email: session.email,
      name: session.name,
    }
  }

  return null
}

// Set auth cookie
export async function setAuthCookie(token: string, isSessionToken = false) {
  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: isSessionToken ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days for sessions, 7 days for JWT
    path: "/",
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (token) {
    // Try to delete session if it exists
    const { deleteSession } = await import("@/lib/db")
    try {
      await deleteSession(token)
    } catch (error) {
      // Ignore if it's not a session token
    }
  }
  
  cookieStore.delete("auth_token")
}
