const DATABASE_URL =
  process.env.DATABASE_URL || "https://ep-steep-firefly-ad91e4zr.apirest.c-2.us-east-1.aws.neon.tech/neondb/rest/v1"
const NEON_API_KEY = process.env.NEON_API_KEY || ""

if (!DATABASE_URL) {
  console.warn("[v0] DATABASE_URL not set. Database operations will fail.")
  console.warn("[v0] Please add DATABASE_URL in the Vars section of the sidebar.")
}

// Helper function to execute SQL queries via Neon REST API
async function executeQuery(query: string, params: any[] = []) {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }

  try {
    const response = await fetch(DATABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(NEON_API_KEY && { Authorization: `Bearer ${NEON_API_KEY}` }),
      },
      body: JSON.stringify({
        query,
        params,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Database query failed: ${error}`)
    }

    const data = await response.json()
    return data.rows || []
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  }
}

// Database helper functions
export async function getUserByEmail(email: string) {
  const rows = await executeQuery("SELECT * FROM users WHERE email = $1 LIMIT 1", [email])
  return rows[0] || null
}

export async function getUserByGoogleId(googleId: string) {
  const rows = await executeQuery("SELECT * FROM users WHERE google_id = $1 LIMIT 1", [googleId])
  return rows[0] || null
}

export async function createUser(data: {
  email: string
  passwordHash?: string
  name?: string
  googleId?: string
  avatarUrl?: string
  emailVerified?: boolean
}) {
  const rows = await executeQuery(
    `INSERT INTO users (email, password_hash, name, google_id, avatar_url, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.email, data.passwordHash || null, data.name || null, data.googleId || null, data.avatarUrl || null, data.emailVerified || false],
  )
  return rows[0]
}

export async function updateUserGoogleId(userId: number, googleId: string) {
  const rows = await executeQuery(
    `UPDATE users 
     SET google_id = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [googleId, userId],
  )
  return rows[0]
}

export async function enrollUserInCourse(userId: number) {
  const rows = await executeQuery(
    `INSERT INTO course_enrollments (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING
     RETURNING *`,
    [userId],
  )
  return rows[0]
}

export async function isUserEnrolled(userId: number) {
  const rows = await executeQuery("SELECT * FROM course_enrollments WHERE user_id = $1 LIMIT 1", [userId])
  return !!rows[0]
}

// Session management functions
export async function createSession(userId: number, sessionToken: string, expiresAt: Date) {
  const rows = await executeQuery(
    `INSERT INTO user_sessions (user_id, session_token, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, sessionToken, expiresAt],
  )
  return rows[0]
}

export async function getSession(sessionToken: string) {
  const rows = await executeQuery(
    `SELECT s.*, u.id, u.email, u.name, u.avatar_url, u.google_id
     FROM user_sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
    [sessionToken],
  )
  return rows[0] || null
}

export async function updateSessionAccess(sessionToken: string) {
  await executeQuery(
    `UPDATE user_sessions 
     SET last_accessed = CURRENT_TIMESTAMP
     WHERE session_token = $1`,
    [sessionToken],
  )
}

export async function deleteSession(sessionToken: string) {
  await executeQuery("DELETE FROM user_sessions WHERE session_token = $1", [sessionToken])
}

export async function deleteUserSessions(userId: number) {
  await executeQuery("DELETE FROM user_sessions WHERE user_id = $1", [userId])
}

export async function cleanupExpiredSessions() {
  await executeQuery("DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP", [])
}

// Update user login time
export async function updateUserLoginTime(userId: number) {
  await executeQuery(
    `UPDATE users 
     SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [userId],
  )
}

// Update user password (for linking accounts)
export async function updateUserPassword(userId: number, passwordHash: string) {
  const rows = await executeQuery(
    `UPDATE users 
     SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [passwordHash, userId],
  )
  return rows[0]
}
