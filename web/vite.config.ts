import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import broadcastRelayPlugin from './scripts/broadcast-relay.mjs'
import elevenLabsVoicesPlugin from './scripts/elevenlabs-voices.mjs'

export default defineConfig(({ mode }) => ({
  plugins: [react(), broadcastRelayPlugin(), elevenLabsVoicesPlugin({ apiKey: process.env.ELEVENLABS_API_KEY || loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '').ELEVENLABS_API_KEY || '' })],
  server: {
    port: 5173,
    strictPort: true,
    fs: { strict: true, allow: [fileURLToPath(new URL('.', import.meta.url))] },
  },
  preview: { port: 4173, strictPort: true },
}))
