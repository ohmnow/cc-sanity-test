import {createCookie} from 'react-router'

// Admin session cookie
export const adminSessionCookie = createCookie('admin-session', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
})

// Verify admin password from environment
export function verifyAdminPassword(password: string): boolean {
  // Sanitize env var to remove any whitespace/newlines that Vercel might add
  const rawPassword = process.env.ADMIN_PASSWORD
  const adminPassword = rawPassword?.trim() || 'admin123' // Default for dev
  return password === adminPassword
}

// Check if admin session is valid
export async function isAdminAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('Cookie')
  const session = await adminSessionCookie.parse(cookieHeader)
  return session?.authenticated === true
}

// Create admin session
export async function createAdminSession(): Promise<string> {
  return adminSessionCookie.serialize({authenticated: true})
}

// Clear admin session
export async function clearAdminSession(): Promise<string> {
  return adminSessionCookie.serialize({}, {maxAge: 0})
}
