// playwright.config.js
import { defineConfig } from "@playwright/test";


export default defineConfig({
  testDir: "./src/tests/e2e",
  timeout: 30 * 1000,

  use: {
    headless: true,
    baseURL: "http://localhost:3000",
    viewport: { width: 1300, height: 720 }
  },

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    }
  ],

  webServer: {
    // ✅ Use dev server — instant startup, no build step needed
    command: "npm run dev",
    // ✅ Vite frontend port, NOT the backend (3001 is your Express/Socket.io server)
    port: 3000,
    // ✅ Reuse if already running (convenient during active development)
    reuseExistingServer: true,
    // ✅ Sane timeout — Vite is ready in ~3s, 30s is more than enough
    timeout: 30 * 1000,
  },
});