// Based on how Remix recommends handling environment variables
// https://remix.run/docs/en/main/guides/envvars

// None of these are secrets, but all of them are required
// Throughout the app server and client side
declare global {
  interface Window {
    ENV: {
      VITE_SANITY_PROJECT_ID: string
      VITE_SANITY_DATASET: string
      VITE_SANITY_API_VERSION: string
    }
  }
}

const defaultApiVersion = `2024-02-13`

// Lazy evaluation - only read env vars when needed
let _projectId: string | undefined
let _dataset: string | undefined
let _apiVersion: string | undefined
let _initialized = false

function ensureInitialized() {
  if (_initialized) return

  if (typeof document === 'undefined') {
    if (typeof process !== 'undefined') {
      // Server-side: use non-VITE prefixed versions only (runtime env vars)
      // VITE_ prefixed vars may be replaced at build time, so we avoid them on server
      _projectId = process.env.SANITY_PROJECT_ID
      _dataset = process.env.SANITY_DATASET
      _apiVersion = process.env.SANITY_API_VERSION || defaultApiVersion
    } else {
      _projectId = import.meta.env.VITE_SANITY_PROJECT_ID
      _dataset = import.meta.env.VITE_SANITY_DATASET
      _apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? defaultApiVersion
    }
  } else {
    _projectId = window.ENV?.VITE_SANITY_PROJECT_ID
    _dataset = window.ENV?.VITE_SANITY_DATASET
    _apiVersion = window.ENV?.VITE_SANITY_API_VERSION ?? defaultApiVersion
  }

  _initialized = true
}

export const projectDetails = () => {
  ensureInitialized()
  return {
    projectId: _projectId!,
    dataset: _dataset!,
    apiVersion: _apiVersion!,
  }
}

// For backwards compatibility - getter functions
export const getProjectId = () => {
  ensureInitialized()
  return _projectId!
}

export const getDataset = () => {
  ensureInitialized()
  return _dataset!
}

export const getApiVersion = () => {
  ensureInitialized()
  return _apiVersion!
}
