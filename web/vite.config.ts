import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import broadcastRelayPlugin from './scripts/broadcast-relay.mjs'

export default defineConfig({
  plugins: [react(), broadcastRelayPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    fs: { strict: true, allow: [fileURLToPath(new URL('.', import.meta.url))] },
  },
  preview: { port: 4173, strictPort: true },
})
