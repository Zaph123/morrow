import { test, expect } from "@playwright/test"
import fs from "node:fs/promises"

test("installed Edge captures a synthetic page and verifies keyboard interaction", async ({ browser, page }) => {
  const traffic: Array<{ method: string; result: unknown }> = []
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  page.on("crash", () => errors.push("page crashed"))
  const browserSession = await browser.newBrowserCDPSession()
  traffic.push({ method: "Browser.getVersion", result: await browserSession.send("Browser.getVersion") })
  const pageSession = await page.context().newCDPSession(page)
  traffic.push({ method: "Runtime.evaluate", result: await pageSession.send("Runtime.evaluate", { expression: "1+1", returnByValue: true }) })
  traffic.push({ method: "Page.getFrameTree", result: await pageSession.send("Page.getFrameTree") })
  const enabled = await pageSession.send("Page.enable")
  traffic.push({ method: "Page.enable", result: enabled })
  expect(enabled).toEqual({})
  await page.setContent(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Morrow browser preflight</title><body><h1>Browser verification</h1><label>Test thought <input id="thought"></label><button id="verify">Verify interaction</button><p role="status" id="status">Ready</p><script>document.getElementById('verify').addEventListener('click',()=>{document.getElementById('status').textContent='Verified: '+document.getElementById('thought').value})</script></body></html>`)
  await page.getByLabel("Test thought").fill("Synthetic test")
  await page.getByRole("button", { name: "Verify interaction" }).focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("status")).toHaveText("Verified: Synthetic test")
  await page.screenshot({ path: "artifacts/phase-2/browser-preflight.png", fullPage: true })
  await fs.writeFile("artifacts/phase-2/preflight-cdp-responses.json", JSON.stringify({ traffic, errors }, null, 2))
  expect(errors).toEqual([])
  await browserSession.detach()
  await pageSession.detach()
})
