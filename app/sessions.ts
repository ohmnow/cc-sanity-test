import { createCookieSessionStorage } from 'react-router';

export const PREVIEW_SESSION_NAME = '__preview'

// Lazy initialization to ensure env vars are available at runtime
let _sessionStorage: ReturnType<typeof createCookieSessionStorage> | null = null

function getSessionStorage() {
  if (!_sessionStorage) {
    const secret = process.env.SANITY_SESSION_SECRET
    if (!secret) {
      throw new Error(`Missing SANITY_SESSION_SECRET in .env`)
    }
    _sessionStorage = createCookieSessionStorage({
      cookie: {
        name: PREVIEW_SESSION_NAME,
        secrets: [secret],
        sameSite: 'lax',
      },
    })
  }
  return _sessionStorage
}

export const getSession = (...args: Parameters<ReturnType<typeof createCookieSessionStorage>['getSession']>) =>
  getSessionStorage().getSession(...args)
export const commitSession = (...args: Parameters<ReturnType<typeof createCookieSessionStorage>['commitSession']>) =>
  getSessionStorage().commitSession(...args)
export const destroySession = (...args: Parameters<ReturnType<typeof createCookieSessionStorage>['destroySession']>) =>
  getSessionStorage().destroySession(...args)
