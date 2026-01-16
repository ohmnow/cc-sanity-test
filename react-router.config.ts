import type {Config} from '@react-router/dev/config'
import {vercelPreset} from '@vercel/react-router/vite'

export default {
  presets: [vercelPreset()],
  // v8_middleware disabled - requires RouterContextProvider from getLoadContext
  // which @vercel/react-router preset doesn't fully support yet
  // Clerk auth still works via rootAuthLoader pattern
} satisfies Config
