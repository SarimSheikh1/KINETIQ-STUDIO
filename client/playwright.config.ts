import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:5178", channel: "msedge", headless: true },
  webServer: {
    command: "npm run dev -- --port 5178 --strictPort",
    url: "http://127.0.0.1:5178",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
