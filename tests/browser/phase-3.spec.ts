import { test, expect, type Page } from "@playwright/test"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const stamp = "2026-11-20T12:00:00.000Z"
const ideas = [
  { id: "idea-0", text: "Why tools designed for speed make thinking harder.\nThe faster a tool gets you to a finished answer, the less room it leaves to notice what you actually think.", status: "active", createdAt: stamp, updatedAt: stamp, retained: "idea metadata" },
  { id: "idea-1", text: "The difference between an authentic angle and manufactured vulnerability", status: "active", createdAt: stamp, updatedAt: stamp },
  { id: "idea-2", text: "Notes from the talk on invisible craft: why friction sometimes protects meaning", status: "archived", createdAt: stamp, updatedAt: stamp },
  { id: "idea-3", text: "Nobody warns you about the last 10%.\nThe empty state, the error message, the second look at a spinner.", status: "active", createdAt: stamp, updatedAt: stamp },
]
const content = [
  { id: "piece-0", title: "Speed vs clarity", body: "Most tools are built to help you finish faster. The good ones help you notice what you actually think before you start.", status: "draft", platform: "linkedin", sourceIdeaId: "idea-0", createdAt: stamp, updatedAt: stamp, retained: "writing metadata" },
  { id: "piece-1", title: "Taste without permission", body: "Strong convictions about quality can begin before a job title.", status: "ready", platform: "linkedin", sourceIdeaId: null, createdAt: stamp, updatedAt: stamp },
  { id: "piece-2", title: "Finishing vs noticing", body: "Fast tools reward finishing, not noticing.", status: "draft", platform: "linkedin", sourceIdeaId: "idea-0", createdAt: stamp, updatedAt: stamp },
  { id: "piece-3", title: "The silent audience", body: "The people who read your work may never leave a comment.", status: "published", platform: "x", sourceIdeaId: null, createdAt: stamp, updatedAt: stamp },
]
const workspace = JSON.stringify({ version: 1, ideas: [], content: [], retained: "workspace unchanged" })
const fixture = { "morrow:ideas": JSON.stringify(ideas), "morrow:content": JSON.stringify(content), "morrow.workspace.v1": workspace }
async function seed(page: Page, values = fixture) {
  await page.addInitScript(values => {
    if (sessionStorage.getItem("phase3-seeded")) return
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value)
    sessionStorage.setItem("phase3-seeded", "yes")
  }, values)
}
async function stored(page: Page, key: string) { return page.evaluate(key => localStorage.getItem(key), key) }
async function screenshot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `artifacts/phase-3/${name}.png`, fullPage: true })
}
async function emulatePointer(page: Page, profile: "coarse" | "fine") {
  const session = await page.context().newCDPSession(page)
  const value = profile === "coarse" ? "coarse" : "fine"
  const hover = profile === "coarse" ? "none" : "hover"
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "pointer", value }, { name: "hover", value: hover }],
  })
  await session.send("Emulation.setTouchEmulationEnabled", {
    enabled: profile === "coarse",
    maxTouchPoints: 1,
  })
}
async function compareSourceAndOutput(page: Page, name: string, sourceInput: string | Buffer) {
  const { width, height } = page.viewportSize()!
  const output = await page.screenshot({ animations: "disabled" })
  const source = Buffer.isBuffer(sourceInput) ? sourceInput : readFileSync(sourceInput)
  const outputPath = resolve("artifacts/phase-3/comparisons")
  mkdirSync(outputPath, { recursive: true })
  writeFileSync(resolve(outputPath, `${name}-morrow.png`), output)
  await page.setViewportSize({ width: width * 2, height: height + 32 })
  const image = (bytes: Buffer) => `data:image/png;base64,${bytes.toString("base64")}`
  await page.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}html,body{margin:0;background:#fff;font:12px Arial,sans-serif}
    main{display:grid;grid-template-columns:${width}px ${width}px;grid-template-rows:32px ${height}px}
    header{display:flex;align-items:center;padding:0 12px;border-bottom:1px solid #ddd}
    img{display:block;width:${width}px;height:${height}px;object-fit:fill}
  </style></head><body><main>
    <header>Selected Stitch reference</header><header>Morrow output</header>
    <img alt="Selected Stitch reference" src="${image(source)}"><img alt="Morrow output" src="${image(output)}">
  </main></body></html>`, { waitUntil: "domcontentloaded" })
  await page.locator("img").evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())))
  await page.screenshot({ path: resolve(outputPath, `${name}-comparison.png`) })
}
async function blockWrites(page: Page, key: string) {
  await page.evaluate(key => {
    const original = Storage.prototype.setItem
    Object.assign(window, { restoreWrites: () => { Storage.prototype.setItem = original } })
    Storage.prototype.setItem = function(k, v) {
      if (key === k) throw new DOMException("Synthetic quota", "QuotaExceededError")
      original.call(this, k, v)
    }
  }, key)
}
async function restoreWrites(page: Page) { await page.evaluate(() => (window as unknown as { restoreWrites: () => void }).restoreWrites()) }
const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on("pageerror", e => messages.push(e.message))
  page.on("console", m => { if (m.type() === "error") messages.push(m.text()) })
  await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort())
})
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]) })

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`browse, filter, keyboard and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 884 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await seed(page)
    await page.goto("/ideas")
    await expect(page.locator(".collection-list a")).toHaveCount(4)
    await expect(page.getByRole("textbox", { name: "Capture an idea" })).toHaveCount(0)
    await screenshot(page, `ideas-list-${width}`)
    await page.getByRole("searchbox", { name: "Search ideas", exact: true }).fill("nobody")
    await expect(page.locator(".collection-list a")).toHaveCount(1)
    await page.getByRole("searchbox").fill("does not exist")
    await expect(page.getByRole("heading", { name: "No ideas found" })).toBeVisible()
    await screenshot(page, `ideas-no-results-${width}`)
    await page.getByRole("button", { name: "Clear filters" }).click()
    const ideasFilter = page.getByRole("group", { name: "Filter ideas" })
    const undeveloped = ideasFilter.getByRole("button", { name: "Not developed" })
    await ideasFilter.getByRole("button", { name: "All" }).focus()
    await page.keyboard.press("ArrowRight")
    await expect(undeveloped).toHaveAttribute("aria-pressed", "true")
    await expect(page.locator(".collection-list a")).toHaveCount(3)
    await page.keyboard.press("Home")
    await expect(ideasFilter.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true")
    await page.locator(".collection-list a").first().focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue(ideas[0].text)
    await screenshot(page, `idea-detail-${width}`)
    await expect(page.getByRole("heading", { name: "Drafts from this idea" })).toBeVisible()
    await page.goto("/ideas/idea-1")
    await expect(page.getByRole("link", { name: "Develop in Studio" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Drafts from this idea" })).toHaveCount(0)
    await screenshot(page, `idea-no-drafts-${width}`)
    await page.goto("/content")
    await expect(page.getByRole("heading", { name: "Library", exact: true })).toBeVisible()
    await expect(page.locator(".collection-list a")).toHaveCount(4)
    await screenshot(page, `library-list-${width}`)
    if (width < 768) {
      await page.mouse.wheel(0, 3000)
      const last = page.locator(".collection-list a").last()
      await last.scrollIntoViewIfNeeded()
      await expect.poll(async () => {
        const row = (await last.boundingBox())!
        const nav = (await page.getByRole("navigation", { name: "Primary destinations" }).boundingBox())!
        return row.y + row.height <= nav.y
      }).toBe(true)
    }
    const libraryFilter = page.getByRole("group", { name: "Filter writing" })
    await libraryFilter.getByRole("button", { name: "Ready" }).click()
    await expect(page.locator(".collection-list a")).toHaveCount(1)
    await libraryFilter.getByRole("button", { name: "Published" }).click()
    await expect(libraryFilter.getByRole("button", { name: "Published" })).toHaveAttribute("aria-pressed", "true")
    await expect(page.locator(".collection-list a")).toHaveCount(1)
    await page.getByRole("searchbox").fill("absent")
    await screenshot(page, `library-no-results-${width}`)
    await page.getByRole("button", { name: "Clear filters" }).click()
    await page.locator(".collection-list a").first().click()
    await expect(page).toHaveURL(/\/studio\?contentId=piece-0$/)
    expect(await stored(page, "morrow:ideas")).toBe(fixture["morrow:ideas"])
    expect(await stored(page, "morrow:content")).toBe(fixture["morrow:content"])
    expect(await stored(page, "morrow.workspace.v1")).toBe(workspace)
  })
}

test("desktop sidebar collapse persists, keeps the active route and leaves mobile navigation unchanged", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]" })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/ideas")
  await emulatePointer(page, "fine")
  const sidebar = page.getByRole("complementary", { name: "Primary" })
  const width = () => sidebar.evaluate(node => Math.round(node.getBoundingClientRect().width))
  await expect(sidebar).toHaveAttribute("data-collapsed", "false")
  await expect.poll(width).toBe(240)
  await screenshot(page, "sidebar-expanded-desktop")
  const expandedToggle = sidebar.locator(".sidebar-collapse-toggle")
  const expandedToggleStyle = await expandedToggle.evaluate(node => getComputedStyle(node).backgroundColor)
  expect(expandedToggleStyle).toBe("rgba(0, 0, 0, 0)")
  const headerBounds = await page.locator(".app-sidebar > div").first().boundingBox()
  const newIdeaBounds = await sidebar.getByRole("button", { name: "New idea" }).boundingBox()
  const chevronBounds = await expandedToggle.boundingBox()
  expect(headerBounds && newIdeaBounds && chevronBounds).toBeTruthy()
  expect(newIdeaBounds!.x + newIdeaBounds!.width).toBeLessThanOrEqual(chevronBounds!.x)
  expect(chevronBounds!.x + chevronBounds!.width).toBeLessThanOrEqual(headerBounds!.x + headerBounds!.width)
  await expandedToggle.hover()
  expect(await expandedToggle.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)")
  await page.mouse.move(640, 450)
  const rail = sidebar.locator("[data-sidebar-edge-rail]")
  expect(await rail.evaluate(node => getComputedStyle(node).cursor)).toBe("ew-resize")
  await rail.hover()
  await expect.poll(() => rail.evaluate(node => getComputedStyle(node, "::after").opacity)).toBe("1")
  await rail.click()
  await expect(sidebar).toHaveAttribute("data-collapsed", "true")
  await expect.poll(width).toBe(72)
  await rail.click()
  await expect(sidebar).toHaveAttribute("data-collapsed", "false")
  await expect.poll(width).toBe(240)
  await sidebar.locator(".sidebar-collapse-toggle").click()
  await expect(sidebar).toHaveAttribute("data-collapsed", "true")
  await expect.poll(width).toBe(72)
  await screenshot(page, "sidebar-collapsed-desktop")
  await expect(sidebar.getByRole("link", { name: "Ideas" })).toHaveAttribute("aria-current", "page")
  await expect(sidebar.getByRole("button", { name: "New idea" })).toBeVisible()
  const expand = sidebar.locator(".sidebar-collapse-toggle")
  await sidebar.getByRole("button", { name: "New idea" }).focus()
  await page.keyboard.press("Tab")
  await expect(expand).toBeFocused()
  expect(await expand.evaluate(node => getComputedStyle(node).boxShadow)).not.toBe("none")
  await expect(page.getByRole("tooltip", { name: "Expand sidebar" })).toBeVisible()
  await page.keyboard.press("Enter")
  await expect(sidebar).toHaveAttribute("data-collapsed", "false")
  await expect.poll(width).toBe(240)
  await page.keyboard.press("Enter")
  await expect(sidebar).toHaveAttribute("data-collapsed", "true")
  await expect.poll(width).toBe(72)
  await page.getByRole("link", { name: "Library" }).click()
  await expect(page).toHaveURL(/\/content$/)
  await expect(page.getByRole("complementary", { name: "Primary" }).getByRole("link", { name: "Library" })).toHaveAttribute("aria-current", "page")
  await page.reload()
  const reloadedSidebar = page.getByRole("complementary", { name: "Primary" })
  await expect(reloadedSidebar).toHaveAttribute("data-collapsed", "true")
  await expect.poll(() => reloadedSidebar.evaluate(node => Math.round(node.getBoundingClientRect().width))).toBe(72)
  await page.setViewportSize({ width: 390, height: 844 })
  await emulatePointer(page, "coarse")
  await expect(page.getByRole("navigation", { name: "Primary destinations" }).getByRole("link")).toHaveCount(5)
  await expect(reloadedSidebar).toBeHidden()
  await expect(page.locator("[data-sidebar-edge-rail]")).toBeHidden()
  await screenshot(page, "sidebar-mobile-navigation")
})

test("You sidebar matches the selected component reference region", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await seed(page, { ...fixture, "morrow:ideas": "[]" })
  await page.goto("/settings")
  const sidebar = page.getByRole("complementary", { name: "Primary" })
  await expect(sidebar).toHaveAttribute("data-collapsed", "false")
  await expect(sidebar.getByRole("link", { name: "You" })).toHaveAttribute("aria-current", "page")
  await expect.poll(() => sidebar.evaluate(node => Math.round(node.getBoundingClientRect().width))).toBe(240)
  const output = await sidebar.screenshot()
  const source = readFileSync(resolve("artifacts/references/stitch/source-b/reference-export/component_desktop_sidebar_you_active/screen.png"))
  const directory = resolve("artifacts/phase-3/comparisons")
  mkdirSync(directory, { recursive: true })
  writeFileSync(resolve(directory, "sidebar-you-expanded-morrow.png"), output)
  await page.setViewportSize({ width: 480, height: 1056 })
  const image = (bytes: Buffer) => `data:image/png;base64,${bytes.toString("base64")}`
  await page.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}html,body{margin:0;background:#fff;font:12px Arial,sans-serif}
    main{display:grid;grid-template-columns:240px 240px;grid-template-rows:32px 1024px}
    header{display:flex;align-items:center;padding:0 8px;border-bottom:1px solid #ddd}
    .panel{width:240px;height:1024px;overflow:hidden;background:#fff}
    .source{display:block;width:1280px;height:1024px;max-width:none}
    .output{display:block;width:240px;height:1024px;object-fit:fill}
  </style></head><body><main>
    <header>Selected Stitch sidebar region, normalized to 1280 × 1024</header><header>Morrow sidebar at 1280 × 1024</header>
    <div class="panel"><img class="source" alt="Selected Stitch sidebar" src="${image(source)}"></div>
    <div class="panel"><img class="output" alt="Morrow sidebar" src="${image(output)}"></div>
  </main></body></html>`, { waitUntil: "domcontentloaded" })
  await page.locator("img").evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())))
  await page.screenshot({ path: resolve(directory, "sidebar-you-expanded-comparison.png") })
})

test("text capture failure, retry and reopen use only the legacy store", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await seed(page)
  await page.goto("/content")
  await expect(page.getByRole("textbox", { name: "Capture an idea" })).toHaveCount(0)
  await page.getByRole("button", { name: "New idea" }).click()
  await expect(page).toHaveURL(/\/content$/)
  const field = page.getByRole("textbox", { name: "Capture an idea" })
  await expect(field).toBeFocused()
  await field.fill("A synthetic thought kept after failure")
  await blockWrites(page, "morrow:ideas")
  await field.press("Control+Enter")
  await expect(page.getByRole("alert")).toContainText("Your text is preserved")
  await expect(field).toHaveValue("A synthetic thought kept after failure")
  expect(await stored(page, "morrow:ideas")).toBe(fixture["morrow:ideas"])
  await screenshot(page, "ideas-capture-failure")
  await restoreWrites(page)
  await page.getByRole("button", { name: "Save idea" }).click()
  await expect(field).toHaveCount(0)
  await expect(page.getByText("Saved on this device", { exact: true })).toBeVisible()
  const saved = JSON.parse((await stored(page, "morrow:ideas"))!)
  expect(saved).toHaveLength(5)
  await page.getByRole("button", { name: "View idea" }).click()
  const newlySaved = saved.find((idea: { text: string }) => idea.text === "A synthetic thought kept after failure")!
  await expect(page).toHaveURL(new RegExp(`/ideas/${newlySaved.id}$`))
  await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue("A synthetic thought kept after failure")
  await page.goto("/ideas")
  await page.getByRole("button", { name: "New idea" }).first().click()
  const reopened = page.getByRole("textbox", { name: "Capture an idea" })
  await expect(reopened).toBeFocused()
  await expect(reopened).toHaveValue("")
  await page.getByRole("button", { name: "Cancel" }).click()
  await page.locator(".collection-list a").filter({ hasText: "A synthetic thought kept" }).click()
  await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue("A synthetic thought kept after failure")
  expect(await stored(page, "morrow.workspace.v1")).toBe(workspace)
})

test("reference-size desktop comparisons and narrow long-content reflow", async ({ page }) => {
  await seed(page)
  await page.setViewportSize({ width: 1280, height: 1024 })
  for (const [route, name] of [["/ideas", "ideas-reference-desktop"], ["/content", "library-reference-desktop"], ["/ideas/idea-0", "detail-reference-desktop"]]) {
    await page.goto(route)
    await expect(page.locator(".collection-list a").first()).toBeVisible()
    await screenshot(page, name)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const [route, name] of [["/ideas", "ideas-reference-mobile"], ["/content", "library-reference-mobile"], ["/ideas/idea-0", "detail-reference-mobile"]]) {
    await page.goto(route)
    await expect(page.locator(".collection-list a").first()).toBeVisible()
    await screenshot(page, name)
  }
  await page.evaluate(value => localStorage.setItem("morrow:ideas", JSON.stringify([{ ...value, text: "Long unbroken thought " + "length".repeat(150) }])), ideas[0])
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/ideas")
  await expect(page.locator(".collection-list a")).toHaveCount(1)
  await screenshot(page, "ideas-long-320")
  await page.locator(".collection-list a").click()
  await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue(/^Long unbroken thought /)
  await screenshot(page, "detail-long-320")
})

test("capture matched Stitch and Morrow collection states", async ({ page, context }) => {
  test.setTimeout(120_000)
  const refs = "artifacts/references/stitch"
  const source = (group: string, screen: string) => resolve(refs, group, "reference-export", screen, "screen.png")
  await seed(page, { ...fixture, "morrow:ideas": "[]", "morrow:content": "[]" })

  const emptyCases = [
    ["/ideas", "ideas-empty-desktop", 1280, 1024, source("source-a", "ideas_desktop_empty")],
    ["/ideas", "ideas-empty-mobile", 353, 800, source("source-a", "ideas_mobile_empty")],
    ["/content", "library-empty-desktop", 1280, 1024, source("source-b", "library_desktop_empty")],
    ["/content", "library-empty-mobile", 353, 800, source("source-a", "library_mobile_empty")],
  ] as const
  for (const [route, name, width, height, reference] of emptyCases) {
    await page.setViewportSize({ width, height })
    await page.goto(route)
    await expect(page.getByRole("heading", { name: route === "/ideas" ? "No ideas yet" : "No writing yet" })).toBeVisible()
    await compareSourceAndOutput(page, name, reference)
  }

  await page.evaluate(values => {
    localStorage.setItem("morrow:ideas", values.ideas)
    localStorage.setItem("morrow:content", values.content)
  }, { ideas: fixture["morrow:ideas"], content: fixture["morrow:content"] })

  const sourcePage = await context.newPage()
  await sourcePage.setViewportSize({ width: 353, height: 800 })
  const ideasMobileHtml = readFileSync(resolve(refs, "source-b", "reference-export", "ideas_mobile_list", "code.html"), "utf8")
  await sourcePage.route("http://127.0.0.1:3117/__stitch-ideas-mobile", route => route.fulfill({
    status: 200,
    contentType: "text/html; charset=utf-8",
    body: ideasMobileHtml,
  }))
  const sourceRequestFailures: string[] = []
  sourcePage.on("requestfailed", request => sourceRequestFailures.push(`${request.url()}: ${request.failure()?.errorText ?? "unknown request failure"}`))
  await sourcePage.goto("http://127.0.0.1:3117/__stitch-ideas-mobile", { waitUntil: "domcontentloaded" })
  await expect(sourcePage.locator("body")).toContainText("Why tools designed for speed")
  const mobileSourceStyled = await expect.poll(
    () => sourcePage.locator("main").evaluate(node => getComputedStyle(node).display),
    { timeout: 8_000 }
  ).toBe("flex").then(() => true, () => false)
  let ideasMobileSource: Buffer | undefined
  if (mobileSourceStyled) {
    await sourcePage.evaluate(() => document.fonts.ready)
    ideasMobileSource = await sourcePage.screenshot({ animations: "disabled" })
  } else {
    const directory = resolve("artifacts/phase-3/comparisons")
    mkdirSync(directory, { recursive: true })
    writeFileSync(resolve(directory, "ideas-mobile-source-render-status.md"), [
      "# Ideas populated mobile source render",
      "",
      "The selected source is `artifacts/references/stitch/source-b/reference-export/ideas_mobile_list/code.html`. Its HTML loaded from loopback, but the Tailwind CDN script did not run: the main element remained `display: block` instead of the expected `display: flex`.",
      "",
      "Failed browser requests:",
      ...(sourceRequestFailures.length ? sourceRequestFailures.map(failure => `- ${failure}`) : ["- No request failure surfaced; the remote script still did not install the utility styles."]),
      "",
      "The raw unstyled preview was excluded as a design comparison. See `ideas-list-mobile-morrow.png` for the app output; the original HTML remains unchanged.",
    ].join("\n"))
  }
  await sourcePage.close()

  const populatedCases = [
    ["/ideas", "ideas-list-desktop", 1280, 1024, source("source-a", "ideas_desktop_spacious_list")],
    ["/content", "library-list-desktop", 1280, 1024, source("source-b", "library_desktop_list")],
    ["/content", "library-list-mobile", 343, 800, source("source-b", "library_mobile_list_revised")],
  ] as const
  for (const [route, name, width, height, reference] of populatedCases) {
    await page.setViewportSize({ width, height })
    await page.goto(route)
    await expect(page.locator(".collection-list a").first()).toBeVisible()
    if (name === "ideas-list-desktop") {
      const computed = await page.getByRole("group", { name: "Filter ideas" }).evaluate(node => {
        const root = getComputedStyle(node)
        const button = getComputedStyle(node.querySelector("button")!)
        return { classes: node.className, rootBackground: root.backgroundColor, rootWidth: node.getBoundingClientRect().width, buttonPadding: button.padding }
      })
      expect(computed.classes).not.toContain("undefined")
      expect(computed.rootBackground).not.toBe("rgba(0, 0, 0, 0)")
      expect(computed.buttonPadding).toContain("12px")
      expect(computed.rootWidth).toBeLessThan(400)
    }
    await compareSourceAndOutput(page, name, reference)
  }
  if (!ideasMobileSource) {
    await page.setViewportSize({ width: 353, height: 800 })
    await page.goto("/ideas")
    await expect(page.locator(".collection-list a").first()).toBeVisible()
    const directory = resolve("artifacts/phase-3/comparisons")
    mkdirSync(directory, { recursive: true })
    writeFileSync(resolve(directory, "ideas-list-mobile-morrow.png"), await page.screenshot({ animations: "disabled" }))
  } else {
    await page.setViewportSize({ width: 353, height: 800 })
    await page.goto("/ideas")
    await expect(page.locator(".collection-list a").first()).toBeVisible()
    await compareSourceAndOutput(page, "ideas-list-mobile", ideasMobileSource)
  }
})

test("detail successful revision, later dirty edits, quota retry and metadata", async ({ page }) => {
  await seed(page)
  await page.goto("/ideas/idea-0")
  const field = page.getByRole("textbox", { name: "Edit idea text" })
  await field.fill("First successful revision")
  await page.getByRole("button", { name: "Save changes", exact: true }).first().click()
  await expect(page.getByText("Saved on this device", { exact: true })).toBeVisible()
  await field.fill("Later unsaved revision")
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible()
  await screenshot(page, "idea-dirty")
  const saved = await stored(page, "morrow:ideas")
  await blockWrites(page, "morrow:ideas")
  await page.getByRole("button", { name: "Save changes", exact: true }).first().click()
  await expect(page.getByRole("button", { name: "Retry save" }).first()).toBeEnabled()
  expect(await stored(page, "morrow:ideas")).toBe(saved)
  await expect(field).toHaveValue("Later unsaved revision")
  await screenshot(page, "idea-save-failure")
  await restoreWrites(page)
  await page.getByRole("button", { name: "Retry save" }).first().click()
  const record = JSON.parse((await stored(page, "morrow:ideas"))!).find((i: {id: string}) => i.id === "idea-0")
  expect(record.createdAt).toBe(stamp)
  expect(record.retained).toBe("idea metadata")
  expect(record.text).toBe("Later unsaved revision")
  expect(record.updatedAt).not.toBe(stamp)
  await screenshot(page, "idea-saved")
  await field.fill("Further edit remains unsaved")
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible()
  await page.reload()
  await expect(field).toHaveValue("Later unsaved revision")
  expect(await stored(page, "morrow:content")).toBe(fixture["morrow:content"])
  expect(await stored(page, "morrow.workspace.v1")).toBe(workspace)
})

test("detail copy reports clipboard outcome and copies displayed unsaved text", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value: string) => {
        const state = window as typeof window & { __morrowClipboardValue?: string; __morrowClipboardFailure?: boolean }
        if (state.__morrowClipboardFailure) throw new Error("clipboard unavailable")
        state.__morrowClipboardValue = value
      } },
    })
  })
  await seed(page)
  await page.goto("/ideas/idea-0")
  const field = page.getByRole("textbox", { name: "Edit idea text" })
  await field.fill("Displayed edited idea, still unsaved")
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible()
  const copyButton = page.getByRole("button", { name: "Copy", exact: true })
  expect(await copyButton.locator(".morrow-copy-button__measure").evaluateAll(nodes => nodes.every(node => getComputedStyle(node).visibility === "hidden"))).toBe(true)
  const desktopCopy = await copyButton.evaluate(node => ({
    box: node.getBoundingClientRect().toJSON(),
    paddingLeft: getComputedStyle(node).paddingLeft,
    paddingRight: getComputedStyle(node).paddingRight,
    label: node.querySelector<HTMLElement>(".morrow-copy-button__label")!.getBoundingClientRect().toJSON(),
  }))
  expect(desktopCopy.box.height).toBeGreaterThanOrEqual(38)
  expect(desktopCopy.box.height).toBeLessThanOrEqual(40)
  expect(desktopCopy.paddingLeft).toBe("13px")
  expect(desktopCopy.paddingRight).toBe("13px")
  expect(desktopCopy.label.right).toBeLessThanOrEqual(desktopCopy.box.right - 12)
  await copyButton.click()
  await expect(page.getByText("Copy: Copied")).toBeAttached()
  expect(await page.evaluate(() => (window as typeof window & { __morrowClipboardValue?: string }).__morrowClipboardValue)).toBe("Displayed edited idea, still unsaved")
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible()
  await expect(copyButton).toHaveAttribute("data-copy-state", "copied")
  await screenshot(page, "idea-copy-copied-desktop")
  await page.evaluate(() => { (window as typeof window & { __morrowClipboardFailure?: boolean }).__morrowClipboardFailure = true })
  await page.setViewportSize({ width: 390, height: 844 })
  await copyButton.click()
  await expect(page.getByText("Copy: Could not copy")).toBeAttached()
  await expect(copyButton).toHaveAttribute("data-copy-state", "error")
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible()
  expect((JSON.parse((await stored(page, "morrow:ideas"))!) as Array<{ id: string; text: string }>).find(item => item.id === "idea-0")?.text).not.toBe("Displayed edited idea, still unsaved")
  const mobileCopyBox = await copyButton.boundingBox()
  expect(mobileCopyBox).toBeTruthy()
  expect(mobileCopyBox!.height).toBeGreaterThanOrEqual(44)
  const mobileCopy = await copyButton.evaluate(node => {
    const box = node.getBoundingClientRect()
    const label = node.querySelector<HTMLElement>(".morrow-copy-button__label")!
    const labelBox = label.getBoundingClientRect()
    const toolbar = node.closest(".idea-detail-toolbar")!.getBoundingClientRect()
    const card = document.querySelector(".idea-original")!.getBoundingClientRect()
    return { labelDisplay: getComputedStyle(label).display, labelScrollWidth: label.scrollWidth, labelClientWidth: label.clientWidth, labelRight: labelBox.right, buttonRight: box.right, toolbarRight: toolbar.right, cardRight: card.right }
  })
  expect(mobileCopy.labelDisplay).not.toBe("none")
  expect(mobileCopy.labelScrollWidth).toBeLessThanOrEqual(mobileCopy.labelClientWidth + 1)
  expect(mobileCopy.labelRight).toBeLessThanOrEqual(mobileCopy.buttonRight - 12)
  expect(mobileCopy.toolbarRight).toBeCloseTo(mobileCopy.cardRight, 0)
  await screenshot(page, "idea-copy-mobile-failed")
})

test("collection and linked draft row hovers stay on the semantic muted surface", async ({ page }) => {
  await seed(page)
  await page.goto("/ideas/idea-0")
  const row = page.locator(".collection-list a").first()
  await expect(row).toBeVisible()
  const canvas = await page.locator("body").evaluate(node => getComputedStyle(node).backgroundColor)
  await row.hover()
  const hovered = await row.evaluate((node, canvasColor) => {
    const probe = document.createElement("div")
    probe.style.backgroundColor = "var(--workspace-row-hover)"
    document.body.append(probe)
    const expected = getComputedStyle(probe).backgroundColor
    probe.remove()
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return { actual: style.backgroundColor, expected, token: style.getPropertyValue("--workspace-row-hover").trim(), canvas: canvasColor, bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }
  }, canvas)
  expect(hovered.actual).toBe(hovered.expected)
  expect(hovered.actual).not.toBe("rgb(255, 255, 255)")
  expect(hovered.actual).not.toBe(canvas)
  const directory = resolve("artifacts/phase-3/comparisons")
  mkdirSync(directory, { recursive: true })
  writeFileSync(resolve(directory, "linked-draft-hover-measurement.json"), JSON.stringify(hovered, null, 2))
  await screenshot(page, "idea-linked-row-hover")

  await page.goto("/content")
  const contentRow = page.locator(".collection-list a").first()
  await expect(contentRow).toBeVisible()
  const contentCanvas = await page.locator("body").evaluate(node => getComputedStyle(node).backgroundColor)
  await contentRow.hover()
  const contentHover = await contentRow.evaluate((node, canvasColor) => {
    const probe = document.createElement("div")
    probe.style.backgroundColor = "var(--workspace-row-hover)"
    document.body.append(probe)
    const expected = getComputedStyle(probe).backgroundColor
    probe.remove()
    const style = getComputedStyle(node)
    const rect = node.getBoundingClientRect()
    return { actual: style.backgroundColor, expected, token: style.getPropertyValue("--workspace-row-hover").trim(), canvas: canvasColor, bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }
  }, contentCanvas)
  expect(contentHover.actual).toBe(contentHover.expected)
  expect(contentHover.actual).not.toBe("rgb(255, 255, 255)")
  expect(contentHover.actual).not.toBe(contentCanvas)
  writeFileSync(resolve(directory, "library-row-hover-measurement.json"), JSON.stringify(contentHover, null, 2))
  await screenshot(page, "library-row-hover")
})

test("idea detail correction compares selected Stitch states at their source viewports", async ({ page }) => {
  const measurements: Record<string, unknown>[] = []
  const cases = [
    { id: "idea-0", width: 1280, height: 1024, name: "idea-detail-linked-desktop", source: "idea_desktop_detail" },
    { id: "idea-1", width: 1280, height: 1024, name: "idea-detail-empty-desktop", source: "idea_desktop_detail_no_drafts" },
    { id: "idea-0", width: 639, height: 1600, name: "idea-detail-linked-mobile", source: "idea_mobile_detail" },
    { id: "idea-1", width: 706, height: 1600, name: "idea-detail-empty-mobile", source: "idea_mobile_detail_no_drafts" },
  ]
  for (const item of cases) {
    await seed(page)
    await page.setViewportSize({ width: item.width, height: item.height })
    await page.goto(`/ideas/${item.id}`)
    await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue(ideas[Number(item.id.at(-1))]!.text)
    measurements.push(await page.evaluate(() => {
      const measure = (selector: string) => {
        const node = document.querySelector<HTMLElement>(selector)
        if (!node) return null
        const rect = node.getBoundingClientRect()
        const style = getComputedStyle(node)
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, fontSize: style.fontSize, lineHeight: style.lineHeight, color: style.color, backgroundColor: style.backgroundColor, borderRadius: style.borderRadius }
      }
      return { viewport: { width: innerWidth, height: innerHeight }, sidebar: measure(".app-sidebar"), toolbar: measure(".idea-detail-toolbar"), breadcrumbs: measure(".idea-detail-breadcrumbs"), surface: measure(".idea-original"), developAction: measure(".idea-develop-action"), firstDraft: measure(".collection-list a") }
    }).then(metrics => ({ name: item.name, ...metrics })))
    const source = resolve("artifacts/references/stitch/source-" + (item.width >= 768 ? "a" : "b"), "reference-export", item.source, "screen.png")
    await compareSourceAndOutput(page, item.name, source)
  }
  writeFileSync(resolve("artifacts/phase-3/comparisons/idea-detail-measurements.json"), JSON.stringify(measurements, null, 2))
})

test("empty, unreadable and recoverable collection states", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]", "morrow:content": "[]" })
  for (const [route, title, name] of [["/ideas", "No ideas yet", "ideas-empty"], ["/content", "No writing yet", "library-empty"]]) {
    await page.goto(route)
    await expect(page.getByRole("heading", { name: title })).toBeVisible()
    await expect(page.getByRole("searchbox")).toHaveCount(0)
    await expect(page.getByRole("group", { name: route === "/ideas" ? "Filter ideas" : "Filter writing" })).toHaveCount(0)
    await screenshot(page, name)
    const helper = page.locator(".collection-empty p")
    const nav = page.getByRole("navigation", { name: "Primary destinations" })
    await expect.poll(async () => {
      const copy = (await helper.boundingBox())!
      const destinations = (await nav.boundingBox())!
      return copy.y + copy.height <= destinations.y
    }).toBe(true)
    if (route === "/ideas") {
      const headerNewIdea = page.locator(".collection-heading").getByRole("button", { name: "New idea" })
      await expect(headerNewIdea).toBeVisible()
      await expect(headerNewIdea).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
      await page.locator(".ideas-empty").getByRole("button", { name: "New idea", exact: true }).click()
      const dialog = page.getByRole("dialog", { name: "New idea" })
      const field = page.getByRole("textbox", { name: "Capture an idea" })
      await expect(dialog).toBeVisible()
      await expect(field).toBeFocused()
      await field.fill("A thought stays until discard is confirmed")
      await page.getByRole("button", { name: "Cancel" }).click()
      await expect(page.getByRole("dialog", { name: "Discard idea?" })).toBeVisible()
      await page.getByRole("button", { name: "Keep editing" }).click()
      await expect(field).toHaveValue("A thought stays until discard is confirmed")
      await page.getByRole("button", { name: "Cancel" }).click()
      await page.getByRole("button", { name: "Discard" }).click()
      await expect(dialog).toHaveCount(0)
      await page.locator(".collection-heading").getByRole("button", { name: "New idea" }).click()
      await expect(field).toHaveValue("")
    }
  }
  await page.evaluate(() => localStorage.setItem("morrow:ideas", "{broken"))
  for (const [route, name] of [["/ideas", "ideas-load-error"], ["/content", "library-load-error"], ["/ideas/idea-0", "idea-load-error"]]) {
    await page.goto(route)
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible()
    if (route === "/ideas" || route === "/content") {
      await expect(page.getByRole("searchbox")).toHaveCount(1)
      await expect(page.getByRole("group", { name: route === "/ideas" ? "Filter ideas" : "Filter writing" })).toHaveCount(1)
    }
    await screenshot(page, name)
    expect(await stored(page, "morrow:ideas")).toBe("{broken")
  }
  await page.evaluate(value => localStorage.setItem("morrow:ideas", value), fixture["morrow:ideas"])
  await page.getByRole("button", { name: "Try again" }).click()
  await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue(ideas[0].text)
  await page.goto("/ideas/missing")
  await expect(page.getByRole("heading", { name: "Idea not found" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Back to ideas" })).toBeVisible()
})

test("empty Home wording and idea detail mobile actions are clear", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]", "morrow:content": "[]" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Continue" })).toBeVisible()
  await expect(page.getByText("No drafts yet. Start whenever you’re ready.")).toBeVisible()
  await screenshot(page, "home-empty-writing-hierarchy")

  await page.evaluate(values => {
    localStorage.setItem("morrow:ideas", values.ideas)
    localStorage.setItem("morrow:content", values.content)
  }, { ideas: JSON.stringify(ideas), content: JSON.stringify(content) })
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto("/ideas/idea-1")
  const title = "The difference between an authentic angle and manufactured vulnerability"
  const currentCrumb = page.locator('.morrow-breadcrumb [aria-current="page"]')
  await expect(currentCrumb).toHaveText(title)
  await expect(currentCrumb).toHaveAttribute("title", title)
  await expect(page.getByRole("button", { name: "Delete idea", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Develop in Studio" })).toBeVisible()
  const crumbStyle = await currentCrumb.evaluate(element => ({
    lineClamp: getComputedStyle(element).webkitLineClamp,
    whiteSpace: getComputedStyle(element).whiteSpace,
    maxWidth: element.getBoundingClientRect().width,
  }))
  expect(crumbStyle.lineClamp).toBe("none")
  expect(crumbStyle.whiteSpace).toBe("normal")
  await screenshot(page, "idea-detail-mobile-readable-actions")
})

test("capture keeps its text selection while switching between desktop and mobile surfaces", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]" })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/ideas")
  await emulatePointer(page, "fine")
  await page.locator(".app-sidebar").getByRole("button", { name: "New idea" }).click()
  const field = page.getByRole("textbox", { name: "Capture an idea" })
  await expect(field).toBeFocused()
  await field.fill("A draft whose selection survives the responsive surface change")
  await field.evaluate((node) => {
    const textarea = node as HTMLTextAreaElement
    textarea.focus()
    textarea.setSelectionRange(3, 21, "forward")
  })
  await screenshot(page, "new-idea-desktop-dialog")

  await page.setViewportSize({ width: 390, height: 844 })
  await emulatePointer(page, "coarse")
  await expect(page.getByRole("button", { name: "Collapse sheet" })).toBeVisible()
  await expect(field).toHaveValue("A draft whose selection survives the responsive surface change")
  await expect(field).toBeFocused()
  await expect.poll(() => field.evaluate((node) => [(node as HTMLTextAreaElement).selectionStart, (node as HTMLTextAreaElement).selectionEnd])).toEqual([3, 21])
  await screenshot(page, "new-idea-mobile-sheet")

  await page.setViewportSize({ width: 1280, height: 900 })
  await emulatePointer(page, "fine")
  await expect(page.getByRole("dialog", { name: "New idea" })).toBeVisible()
  await expect(field).toHaveValue("A draft whose selection survives the responsive surface change")
  await expect(field).toBeFocused()
  await expect.poll(() => field.evaluate((node) => [(node as HTMLTextAreaElement).selectionStart, (node as HTMLTextAreaElement).selectionEnd])).toEqual([3, 21])
})

test("mobile drag, Close, Escape and outside press all guard unsaved capture text", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/ideas")
  await emulatePointer(page, "coarse")
  await page.locator(".ideas-empty").getByRole("button", { name: "New idea", exact: true }).click()
  const field = page.getByRole("textbox", { name: "Capture an idea" })
  const sheet = page.getByRole("dialog", { name: "New idea" })
  const longDraft = Array.from({ length: 48 }, (_, index) => `Scrollable capture line ${index + 1}`).join("\n")
  await field.fill(longDraft)
  const textareaCanScroll = await field.evaluate(node => {
    const textarea = node as HTMLTextAreaElement
    textarea.scrollTop = textarea.scrollHeight
    return textarea.scrollHeight > textarea.clientHeight && textarea.scrollTop > 0
  })
  expect(textareaCanScroll).toBe(true)
  const touchMoveWasCanceled = await field.evaluate(node => {
    const target = node as HTMLTextAreaElement
    const start = new Touch({ identifier: 7, target, clientX: 30, clientY: 260 })
    const move = new Touch({ identifier: 7, target, clientX: 30, clientY: 80 })
    target.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, touches: [start], targetTouches: [start], changedTouches: [start] }))
    const moveEvent = new TouchEvent("touchmove", { bubbles: true, cancelable: true, touches: [move], targetTouches: [move], changedTouches: [move] })
    target.dispatchEvent(moveEvent)
    target.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, touches: [], changedTouches: [move] }))
    return moveEvent.defaultPrevented
  })
  expect(touchMoveWasCanceled).toBe(false)
  await expect(sheet).not.toHaveAttribute("data-dragging")
  await field.fill("Do not discard this thought until I confirm")
  await screenshot(page, "new-idea-mobile-writing")

  const dragDown = async () => {
    const handle = page.getByRole("button", { name: "Collapse sheet" })
    const box = (await handle.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2, Math.min(box.y + 720, 830), { steps: 12 })
    await page.mouse.up()
  }
  await dragDown()
  const discard = page.getByRole("dialog", { name: "Discard idea?" })
  await expect(discard).toBeVisible()
  await expect(sheet.locator("textarea")).toHaveValue("Do not discard this thought until I confirm")
  await expect(sheet).toBeVisible()
  await screenshot(page, "new-idea-mobile-drag-discard-guard")
  await page.getByRole("button", { name: "Keep editing" }).click()
  await expect(discard).toHaveCount(0)
  await expect(field).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(discard).toBeVisible()
  await page.getByRole("button", { name: "Keep editing" }).click()
  await page.getByRole("button", { name: "Close" }).click()
  await expect(discard).toBeVisible()
  await page.getByRole("button", { name: "Keep editing" }).click()
  await page.locator(".morrow-uia-bottom-sheet-overlay").click({ position: { x: 8, y: 8 } })
  await expect(discard).toBeVisible()
  await expect(sheet.locator("textarea")).toHaveValue("Do not discard this thought until I confirm")
  await page.getByRole("button", { name: "Discard" }).click()
  await expect(sheet).toHaveCount(0)
  expect(await stored(page, "morrow:ideas")).toBe("[]")
})

test("delete confirmation keeps drafts; retry succeeds and notification survives navigation", async ({ page }) => {
  await seed(page)
  await page.goto("/ideas/idea-0")
  await blockWrites(page, "morrow:ideas")
  await page.getByRole("button", { name: "Delete idea" }).click()
  const confirmation = page.getByRole("dialog", { name: "Delete idea?" })
  await expect(confirmation).toContainText("Drafts created from this idea will remain available")
  await confirmation.getByRole("button", { name: "Delete idea" }).click()
  await expect(confirmation.getByRole("alert")).toContainText("Couldn")
  await screenshot(page, "idea-delete-failure")
  expect(await stored(page, "morrow:ideas")).toBe(fixture["morrow:ideas"])
  await restoreWrites(page)
  await confirmation.getByRole("button", { name: "Retry delete" }).click()
  await expect(page).toHaveURL(/\/ideas$/)
  expect(await stored(page, "morrow:content")).toBe(fixture["morrow:content"])
  await expect(page.getByText("Idea deleted.", { exact: true })).toBeVisible()
})

test("dialog header divider follows body scroll and short confirms avoid double padding", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await seed(page)
  await page.goto("/ideas/idea-0")
  await page.getByRole("button", { name: "Delete idea" }).click()

  const dialog = page.locator(".morrow-uia-dialog-content").filter({ hasText: "Delete idea?" })
  const header = dialog.locator(".morrow-uia-dialog-header")
  const body = dialog.locator(".morrow-uia-dialog-body")
  await expect(dialog).toBeVisible()
  await expect(dialog).not.toHaveAttribute("data-scrolled")
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))

  const compact = await dialog.evaluate(node => {
    const header = node.querySelector(".morrow-uia-dialog-header")!
    return {
      outerPadding: getComputedStyle(node).paddingTop,
      headerPadding: getComputedStyle(header).paddingTop,
      dividerOpacity: getComputedStyle(header, "::after").opacity,
    }
  })
  expect(compact).toEqual({ outerPadding: "32px", headerPadding: "0px", dividerOpacity: "0" })

  await body.evaluate(node => {
    const content = document.createElement("div")
    content.style.height = "1200px"
    node.style.height = "80px"
    node.style.flex = "none"
    node.append(content)
  })
  const scrollable = await body.evaluate(node => node.scrollHeight > node.clientHeight)
  expect(scrollable).toBe(true)
  await body.evaluate(node => {
    node.scrollTop = 80
    node.dispatchEvent(new Event("scroll"))
  })
  await expect(dialog).toHaveAttribute("data-scrolled")

  const scrolled = await dialog.evaluate(node => {
    const header = node.querySelector(".morrow-uia-dialog-header")!
    return {
      outerPadding: getComputedStyle(node).paddingTop,
      headerPadding: getComputedStyle(header).paddingTop,
      dividerOpacity: getComputedStyle(header, "::after").opacity,
    }
  })
  expect(scrolled).toEqual({ outerPadding: "0px", headerPadding: "32px", dividerOpacity: "1" })

  await body.evaluate(node => {
    node.scrollTop = 0
    node.dispatchEvent(new Event("scroll"))
  })
  await expect(dialog).not.toHaveAttribute("data-scrolled")
  await expect.poll(() => header.evaluate(node => getComputedStyle(node, "::after").opacity)).toBe("0")
  const restoredPadding = await dialog.evaluate(node => ({
    outer: getComputedStyle(node).paddingTop,
    header: getComputedStyle(node.querySelector(".morrow-uia-dialog-header")!).paddingTop,
  }))
  expect(restoredPadding).toEqual({ outer: "32px", header: "0px" })
})

test("server loading states and Home composer focus appearance", async ({ page }) => {
  for (const [route, label, name] of [["/ideas", "Loading ideas", "ideas-loading"], ["/content", "Loading writing", "library-loading"]]) {
    const held: Array<() => Promise<void>> = []
    const pattern = /\/_next\/.*\.js(?:\?|$)/
    await page.route(pattern, route => new Promise<void>(resolve => held.push(async () => { await route.continue(); resolve() })))
    await page.goto(route, { waitUntil: "commit" })
    await expect(page.getByRole("status", { name: label })).toBeVisible()
    await screenshot(page, name)
    await page.unroute(pattern)
    await Promise.all(held.map(release => release()))
  }
  await page.goto("/")
  const composer = page.locator(".home-capture")
  const styles = () => composer.evaluate(node => {
    const s = getComputedStyle(node)
    const field = getComputedStyle(node.querySelector("textarea")!)
    // Outline color can change while style stays none; compare the visible frame.
    return {
      borderColor: s.borderColor,
      outlineStyle: s.outlineStyle,
      boxShadow: s.boxShadow,
      fieldBorder: field.border,
      fieldOutlineStyle: field.outlineStyle,
      fieldBoxShadow: field.boxShadow,
    }
  })
  const resting = await styles()
  await screenshot(page, "home-rest")
  await page.getByRole("textbox", { name: "Capture an idea" }).focus()
  expect(await styles()).toEqual(resting)
  expect(resting.outlineStyle).toBe("none")
  expect(resting.fieldOutlineStyle).toBe("none")
  expect(resting.boxShadow).toBe("none")
  expect(resting.fieldBoxShadow).toBe("none")
  await screenshot(page, "home-focused")
})

test("narrow mobile capture actions stay separate and close to the sheet footer", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]" })
  await page.setViewportSize({ width: 359, height: 655 })
  await page.goto("/ideas")
  await emulatePointer(page, "coarse")
  await page.locator(".ideas-empty").getByRole("button", { name: "New idea", exact: true }).click()

  const sheet = page.getByRole("dialog", { name: "New idea" })
  const field = sheet.getByRole("textbox", { name: "Capture an idea" })
  await field.fill("Check the mobile capture action layout")

  const actions = sheet.locator(".idea-capture-actions")
  const cancel = sheet.getByRole("button", { name: "Cancel" })
  const save = sheet.getByRole("button", { name: "Save idea" })
  await expect(cancel).toBeVisible()
  await expect(save).toBeVisible()
  const layout = await Promise.all([actions, cancel, save].map(locator => locator.boundingBox()))
  const [actionBox, cancelBox, saveBox] = layout
  expect(actionBox && cancelBox && saveBox).toBeTruthy()
  expect(cancelBox!.x + cancelBox!.width).toBeLessThanOrEqual(saveBox!.x)
  expect(Math.abs(cancelBox!.y - saveBox!.y)).toBeLessThanOrEqual(2)
  expect(await page.evaluate(() => innerHeight) - (actionBox!.y + actionBox!.height)).toBeLessThanOrEqual(40)
  await page.screenshot({ path: "artifacts/phase-3/new-idea-mobile-actions.png" })
})

test("device-toolbar widths keep capture and discard actions inside their rows", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]" })
  const measurements: Record<string, unknown>[] = []
  for (const viewport of [
    { width: 577, height: 429, profile: "desktop" },
    { width: 577, height: 429, profile: "mobile" },
    { width: 620, height: 522, profile: "mobile" },
  ]) {
    await page.setViewportSize(viewport)
    const desktopPointer = viewport.profile === "desktop"
    if (!page.url().includes("/ideas")) await page.goto("/ideas")
    await emulatePointer(page, desktopPointer ? "fine" : "coarse")
    expect(await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      fine: matchMedia("(pointer: fine)").matches,
      hover: matchMedia("(hover: hover)").matches,
      maxTouchPoints: navigator.maxTouchPoints,
    }))).toEqual({ coarse: !desktopPointer, fine: desktopPointer, hover: desktopPointer, maxTouchPoints: desktopPointer ? 0 : 1 })
    await page.locator(".ideas-empty").getByRole("button", { name: "New idea", exact: true }).click()
    const sheet = page.getByRole("dialog", { name: "New idea" })
    const isSheet = await page.locator(".morrow-capture-sheet").count() === 1
    expect(isSheet).toBe(!desktopPointer)
    if (isSheet) await expect(sheet).toHaveAttribute("data-expanded", "")
    const field = sheet.getByRole("textbox", { name: "Capture an idea" })
    await field.fill("A device-toolbar layout check")
    await page.waitForTimeout(350)

    const inspectRow = async (row: ReturnType<typeof page.locator>) => row.evaluate(node => {
      const box = node.getBoundingClientRect()
      const buttons = Array.from(node.querySelectorAll("button")).map(button => {
        const rect = button.getBoundingClientRect()
        const style = getComputedStyle(button)
        return { label: button.innerText, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, flexShrink: style.flexShrink, whiteSpace: style.whiteSpace }
      })
      const style = getComputedStyle(node)
      return { left: box.left, right: box.right, width: box.width, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, display: style.display, flexWrap: style.flexWrap, gap: style.gap, buttons }
    })
    const captureRow = sheet.locator(".idea-capture-actions")
    const captureLayout = await inspectRow(captureRow)
    expect(captureLayout.buttons).toHaveLength(2)
    expect(captureLayout.scrollWidth).toBeLessThanOrEqual(captureLayout.clientWidth + 1)
    expect(captureLayout.buttons[0]!.right + 8).toBeLessThanOrEqual(captureLayout.buttons[1]!.left)
    expect(captureLayout.buttons.every(button => button.flexShrink === "0" && button.width >= 64)).toBe(true)
    const saveButton = sheet.getByRole("button", { name: "Save idea" })
    await expect(saveButton).toBeEnabled()
    await saveButton.scrollIntoViewIfNeeded()
    if (isSheet) {
      await sheet.locator(".morrow-uia-bottom-sheet-body").evaluate(node => {
        node.scrollTop = node.scrollHeight
      })
    }
    const saveBounds = await saveButton.boundingBox()
    expect(saveBounds && saveBounds.y >= 0 && saveBounds.y + saveBounds.height <= viewport.height).toBeTruthy()
    if (isSheet) expect(viewport.height - (saveBounds!.y + saveBounds!.height)).toBeGreaterThanOrEqual(8)
    if (isSheet) expect(viewport.height - (saveBounds!.y + saveBounds!.height)).toBeLessThanOrEqual(40)
    const captureLayoutAfterScroll = await inspectRow(captureRow)
    const surfaceBounds = await sheet.boundingBox()
    if (isSheet && viewport.height <= 600) {
      expect(Math.abs(surfaceBounds!.y - viewport.height * 0.3)).toBeLessThanOrEqual(2)
    }
    measurements.push({ viewport, pointer: desktopPointer ? "fine / desktop" : "coarse / mobile", mode: isSheet ? "expanded sheet" : "centered dialog", surfaceBounds, capture: captureLayout, captureAfterScroll: captureLayoutAfterScroll, saveBounds })
    await page.screenshot({ path: `artifacts/phase-3/device-toolbar-${viewport.width}-${viewport.profile}-capture.png` })

    await sheet.getByRole("button", { name: "Cancel" }).click()
    const discard = page.getByRole("dialog", { name: "Discard idea?" })
    await expect(discard).toBeVisible()
    const discardLayout = await inspectRow(discard)
    measurements.push({ viewport, discard: discardLayout })
    expect(discardLayout.buttons).toHaveLength(2)
    expect(discardLayout.scrollWidth).toBeLessThanOrEqual(discardLayout.clientWidth + 1)
    expect(discardLayout.buttons[0]!.right + 8).toBeLessThanOrEqual(discardLayout.buttons[1]!.left)
    expect(discardLayout.buttons.every(button => button.flexShrink === "0" && button.width >= 64), JSON.stringify({ viewport, discardLayout })).toBe(true)
    await page.screenshot({ path: `artifacts/phase-3/device-toolbar-${viewport.width}-${viewport.profile}-discard.png` })
    await discard.getByRole("button", { name: "Discard" }).click()
  }
  const directory = resolve("artifacts/phase-3/comparisons")
  mkdirSync(directory, { recursive: true })
  writeFileSync(resolve(directory, "capture-action-measurements.json"), JSON.stringify(measurements, null, 2))
})
