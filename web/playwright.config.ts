import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    // Existing SVG/Deep Zoom checks explicitly exercise the preserved drawing
    // renderer. relief.spec.ts explicitly enables the optional Danstsud 3D mode.
    storageState: { cookies: [], origins: [{ origin: 'http://127.0.0.1:5173', localStorage: [{ name: 'aruzahr-danstsud-atlas-mode', value: '2d' }] }] },
    viewport: { width: 1440, height: 1000 },
    headless: true,
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
