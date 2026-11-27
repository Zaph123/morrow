import { defineConfig } from "@playwright/test"

const app = process.env.MORROW_BROWSER_APP === "1"
const correction = process.env.MORROW_VISUAL_CORRECTION === "1"
const phase3 = process.env.MORROW_PHASE_3 === "1"
const phase4 = process.env.MORROW_PHASE_4 === "1"

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: phase4 ? "phase-4.spec.ts" : phase3 ? "phase-3.spec.ts" : app ? (correction ? "phase-2-correction.spec.ts" : "phase-2.spec.ts") : "preflight.spec.ts",
  globalSetup: app || phase3 || phase4 ? "./tests/browser/server-setup.mjs" : undefined,
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: phase4 ? "artifacts/phase-4/test-results" : phase3 ? "artifacts/phase-3/test-results" : "artifacts/phase-2/test-results",
  reporter: [["list"], ["json", { outputFile: phase4 ? "artifacts/phase-4/results.json" : phase3 ? "artifacts/phase-3/results.json" : app ? (correction ? "artifacts/phase-2/correction-results.json" : "artifacts/phase-2/app-results.json") : "artifacts/phase-2/preflight-results.json" }]],
  use: {
    channel: "msedge",
    headless: true,
    viewport: { width: 390, height: 844 },
    baseURL: "http://127.0.0.1:3117",
    trace: "retain-on-failure",
  },
})
