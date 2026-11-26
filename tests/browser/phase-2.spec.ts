import { test, expect, type Page } from "@playwright/test"

const stamp = "2026-11-20T12:00:00.000Z"
const ideas = [0, 1, 2, 3].map(i => ({ id: `idea-${i}`, text: `Synthetic thought ${i}: making room for a slower creative process`, status: "active", createdAt: stamp, updatedAt: stamp, retained: "idea metadata" }))
const content = [0, 1, 2, 3].map(i => ({ id: `piece-${i}`, title: `Synthetic draft ${i}`, body: "A synthetic draft for isolated browser verification. Existing words remain yours.", status: "ready", platform: "linkedin", sourceIdeaId: "idea-0", createdAt: stamp, updatedAt: stamp, retained: "draft metadata" }))
const workspace = { version: 1, ideas: [], content: [{ ...content[0], id: "workspace-piece", status: "draft", platform: "whatsapp", sourceIdeaId: null }], retained: "snapshot metadata" }
const fixture = { "morrow:ideas": JSON.stringify(ideas), "morrow:content": JSON.stringify(content), "morrow.workspace.v1": JSON.stringify(workspace) }

async function seed(page: Page, values: Record<string, string> = fixture) {
  await page.addInitScript(values => {
    if (sessionStorage.getItem("fixture-ready")) return
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value)
    sessionStorage.setItem("fixture-ready", "yes")
  }, values)
}
async function stored(page: Page, key: string) { return page.evaluate(key => localStorage.getItem(key), key) }
async function noOverflow(page: Page) {
  const before = await page.evaluate(() => scrollX)
  await page.mouse.move(1, 1)
  await page.mouse.wheel(180, 0)
  await page.waitForTimeout(50)
  const after = await page.evaluate(() => scrollX)
  expect(after).toBe(before)
}

const browserErrors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  browserErrors.set(page, errors)
  page.on("pageerror", error => errors.push(error.message))
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()) })
  await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort())
})
test.afterEach(async ({ page }) => { expect(browserErrors.get(page)).toEqual([]) })

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`Home and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await seed(page)
    const fontRequests: string[] = []
    page.on("request", request => { if (/\.(ttf|woff2?)(\?|$)/.test(request.url())) fontRequests.push(request.url()) })
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Make something of today." })).toBeVisible()
    await expect(page.locator('main a[href^="/ideas/"]')).toHaveCount(1)
    await expect(page.getByRole("link", { name: "View all ideas" })).toHaveAttribute("href", "/ideas")
    await expect(page.getByRole("link", { name: "View all ideas" })).toHaveText("View all")
    await expect(page.locator('main a[href^="/studio?contentId="]')).toHaveCount(1)
    const layout = await page.locator(".home-actions").evaluate((node) => {
      const box = node.getBoundingClientRect()
      const style = getComputedStyle(node)
      const cards = [...node.querySelectorAll(".home-action-card")].map((card) => {
        const box = card.getBoundingClientRect()
        const style = getComputedStyle(card)
        return { left: box.left, right: box.right, width: box.width, top: box.top, height: box.height, minHeight: style.minHeight, maxHeight: style.maxHeight, scrollHeight: card.scrollHeight, clientHeight: card.clientHeight, background: style.backgroundColor, cursor: style.cursor }
      })
      return { actions: box.width, right: box.right, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, display: style.display, gap: style.columnGap, overflowX: style.overflowX, scrollbarWidth: style.scrollbarWidth, scrollSnapType: style.scrollSnapType, touchAction: style.touchAction, cursor: style.cursor, cards }
    })
    const [continueCard, ideaCard, blankCard] = layout.cards
    expect(layout.cards).toHaveLength(3)
    for (const card of layout.cards) {
      expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight + 1)
      expect(card.minHeight).toBe("192px")
      expect(card.maxHeight).toBe("none")
    }
    for (const card of layout.cards) expect(card.height).toBeGreaterThanOrEqual(192)
    expect(Math.max(...layout.cards.map(card => card.height)) - Math.min(...layout.cards.map(card => card.height))).toBeLessThanOrEqual(1)
    if (layout.display === "flex") {
      expect(layout.scrollWidth).toBeGreaterThan(layout.clientWidth)
      expect(layout.gap).toBe("12px")
      expect(layout.overflowX).toBe("auto")
      expect(layout.scrollbarWidth).toBe("none")
      expect(layout.scrollSnapType).toBe("none")
      expect(layout.touchAction).toBe("auto")
      expect(layout.cards[0].cursor).toBe("grab")
      expect(ideaCard.top).toBeCloseTo(continueCard.top, 0)
      expect(blankCard.top).toBeCloseTo(continueCard.top, 0)
      expect(ideaCard.left).toBeGreaterThan(continueCard.left)
      expect(ideaCard.left).toBeLessThan(layout.right)
    } else {
      expect(blankCard.top).toBeCloseTo(continueCard.top, 0)
      expect(ideaCard.top).toBeCloseTo(continueCard.top, 0)
      expect(continueCard.width).toBeCloseTo(ideaCard.width, 0)
      expect(ideaCard.width).toBeCloseTo(blankCard.width, 0)
      expect(continueCard.clientHeight).toBeCloseTo(ideaCard.clientHeight, 0)
      expect(ideaCard.clientHeight).toBeCloseTo(blankCard.clientHeight, 0)
      const composer = await page.locator(".home-capture").boundingBox()
      expect(composer).toBeTruthy()
      expect(continueCard.left - composer!.x).toBeCloseTo(16, 0)
      expect(composer!.x + composer!.width - layout.right).toBeCloseTo(16, 0)
      expect(layout.cards[0].cursor).toBe("pointer")
    }
    await expect(page.getByRole("link", { name: "View all writing" })).toHaveAttribute("href", "/content")
    await expect(page.getByRole("link", { name: "View all ideas" })).toBeVisible()
    const cards = page.locator(".home-action-card")
    await expect(cards.nth(0).locator("a")).toHaveCount(2)
    expect(await cards.nth(0).locator("a").evaluateAll(links => links.every(link => link.parentElement?.tagName !== "A"))).toBe(true)
    await page.getByRole("link", { name: "View all writing" }).click()
    await expect(page).toHaveURL(/\/content$/)
    await page.goto("/")
    expect(await stored(page, "morrow:ideas")).toBe(fixture["morrow:ideas"])
    expect(await stored(page, "morrow.workspace.v1")).toBe(fixture["morrow.workspace.v1"])
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => {
      const family = getComputedStyle(document.body).fontFamily.split(",")[0].replaceAll('"', "").trim()
      return Array.from(document.fonts).some(face => face.family.replaceAll('"', "") === family && face.status === "loaded")
    })).toBe(true)
    expect(fontRequests.length).toBeGreaterThan(0)
    expect(fontRequests.every(url => url.startsWith("http://127.0.0.1:3117/_next/static/media/"))).toBe(true)
    await noOverflow(page)
    await page.screenshot({ path: `artifacts/phase-2/home-populated-${width}.png`, fullPage: true })
    const nav = width < 768 ? page.getByRole("navigation", { name: "Primary destinations" }) : page.getByRole("navigation", { name: "Workspace", exact: true })
    await expect(nav.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page")
    await nav.getByRole("link", { name: "Library", exact: true }).click()
    await expect(page).toHaveURL(/\/content$/)
    await noOverflow(page)
    await nav.getByRole("link", { name: "Ideas", exact: true }).click()
    await expect(page).toHaveURL(/\/ideas$/)
    await noOverflow(page)
    await nav.getByRole("link", { name: "Brand Brain", exact: true }).click()
    await expect(page).toHaveURL(/\/brand-brain$/)
    await noOverflow(page)
    await page.getByRole("link", { name: "You", exact: true }).filter({ visible: true }).click()
    await expect(page.getByText("Appearance: Light.")).toBeVisible()
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(0)
    if (width >= 768) await expect(page.getByRole("link", { name: "You", exact: true }).filter({ visible: true })).toHaveAttribute("aria-current", "page")
    if (width < 768) await expect(nav.getByRole("link", { name: "Brand Brain" })).toHaveText("Brain")
    await page.screenshot({ path: `artifacts/phase-2/you-${width}.png`, fullPage: true })
    await noOverflow(page)
  })
}

test("Home long idea and writing previews clamp to two lines without changing saved text", async ({ page }) => {
  const ideaText = "Guessing my design tool of choice for MORROW... Hint:\n\nIt's not Figma. I used Stitch, Google's AI design tool, and the complete explanation remains saved.\n\nThis final paragraph stays in the idea even when its Home preview is clamped."
  const draftText = "A populated Continue preview with enough writing to exceed two lines at desktop and narrow mobile widths.\n\nThe full draft stays saved and opens intact."
  const savedAt = "2026-11-20T12:00:00.000Z"
  const values = {
    "morrow:ideas": JSON.stringify([{ id: "long-idea", text: ideaText, status: "active", createdAt: savedAt, updatedAt: savedAt }]),
    "morrow:content": JSON.stringify([{ id: "long-draft", title: "Long draft", body: draftText, status: "draft", platform: "linkedin", sourceIdeaId: "long-idea", createdAt: savedAt, updatedAt: savedAt }]),
    "morrow.workspace.v1": JSON.stringify({ version: 1, ideas: [], content: [] }),
  }

  await page.setViewportSize({ width: 1280, height: 900 })
  await seed(page, values)
  await page.goto("/")
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 900 })
    const previews = page.locator(".home-action-preview")
    await expect(previews).toHaveCount(2)

    const rendered = await previews.evaluateAll(nodes => nodes.map(node => {
      const style = getComputedStyle(node)
      return {
        text: node.textContent,
        display: style.display,
        webkitLineClamp: style.webkitLineClamp,
        whiteSpace: style.whiteSpace,
        overflow: style.overflow,
        minWidth: style.minWidth,
        flexGrow: style.flexGrow,
        height: node.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(style.lineHeight),
      }
    }))
    console.log(`Home preview computed styles at ${width}px: ${JSON.stringify(rendered)}`)
    for (const [index, preview] of rendered.entries()) {
      expect(preview.text).toBe(index === 0 ? draftText : ideaText)
      expect(["block", "flow-root", "-webkit-box"]).toContain(preview.display)
      expect(preview.webkitLineClamp).toBe("2")
      expect(preview.whiteSpace).toBe("normal")
      expect(preview.overflow).toBe("hidden")
      expect(preview.minWidth).toBe("0px")
      expect(preview.flexGrow).toBe("0")
      expect(preview.height).toBeLessThanOrEqual(preview.lineHeight * 2 + 1)
    }

    const cardHeights = await page.locator(".home-action-card").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height))
    for (const height of cardHeights) expect(height).toBeGreaterThanOrEqual(192)
    expect(Math.max(...cardHeights) - Math.min(...cardHeights)).toBeLessThanOrEqual(1)
    expect(cardHeights[0]).toBeCloseTo(cardHeights[1], 0)

    await page.screenshot({ path: `artifacts/phase-2/home-long-previews-${width}.png`, fullPage: true })
    if (width === 320) {
      await page.locator(".home-actions").evaluate(rail => {
        const nextCard = rail.children[1] as HTMLElement
        rail.scrollLeft = nextCard.offsetLeft
      })
      await page.waitForTimeout(150)
      await page.screenshot({ path: "artifacts/phase-2/home-long-idea-preview-320.png", fullPage: true })
      await page.getByRole("link", { name: "Revisit idea: Guessing my design tool of choice for MORROW... Hint:" }).click()
      await expect(page.getByRole("textbox", { name: "Edit idea text" })).toHaveValue(ideaText)
      const savedIdeas = JSON.parse((await stored(page, "morrow:ideas")) || "[]")
      expect(savedIdeas[0].text).toBe(ideaText)
    }
  }
})

test("Home composer grows, clamps, scrolls and cards stay equal on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seed(page)
  await page.goto("/")
  const capture = page.getByRole("textbox", { name: "Capture an idea" })
  const composer = page.locator(".home-capture")
  const measure = () => capture.evaluate((node) => {
    const style = getComputedStyle(node)
    return {
      height: Math.round(node.getBoundingClientRect().height),
      overflowY: style.overflowY,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
    }
  })
  const empty = await measure()
  expect(empty.height).toBeGreaterThanOrEqual(52)
  expect(empty.height).toBeLessThanOrEqual(72)
  await capture.fill("One short line")
  const short = await measure()
  expect(short.height).toBeLessThanOrEqual(80)
  const long = Array.from({ length: 12 }, (_, i) => `Line ${i + 1} of a longer thought that should expand the composer.`).join("\n")
  await capture.fill(long)
  await expect.poll(async () => (await measure()).height).toBeGreaterThanOrEqual(150)
  const expanded = await measure()
  expect(expanded.height).toBeLessThanOrEqual(168)
  expect(expanded.overflowY).toBe("auto")
  expect(expanded.scrollHeight).toBeGreaterThan(expanded.clientHeight)
  await expect(composer.getByRole("button", { name: "Save idea" })).toBeVisible()
  const saveBox = await composer.getByRole("button", { name: "Save idea" }).boundingBox()
  expect(saveBox).toBeTruthy()
  await page.screenshot({ path: "artifacts/phase-2/home-composer-expanded-1440.png", fullPage: true })
  await capture.fill("")
  await expect.poll(async () => (await measure()).height).toBeLessThanOrEqual(72)
  await page.screenshot({ path: "artifacts/phase-2/home-composer-compact-1440.png", fullPage: true })
  const blank = page.getByRole("link", { name: "Start a blank draft" })
  await blank.hover()
  const hoverStyles = await blank.locator("xpath=..", {}).evaluate((node) => {
    const style = getComputedStyle(node)
    return {
      background: style.backgroundColor,
      border: style.borderColor,
      transform: style.transform,
    }
  })
  expect(hoverStyles.background).toBe("rgb(255, 255, 255)")
  expect(hoverStyles.border).toBe("rgb(218, 221, 227)")
  expect(hoverStyles.transform).toContain("matrix")
  await page.screenshot({ path: "artifacts/phase-2/home-card-hover-1440.png" })
  await page.keyboard.press("Tab")
  await page.screenshot({ path: "artifacts/phase-2/home-card-keyboard-focus-1440.png" })
  await blank.dispatchEvent("pointerdown")
  const pressed = await blank.evaluate((node) => getComputedStyle(node).transform)
  await page.screenshot({ path: "artifacts/phase-2/home-card-pressed-1440.png" })
  await blank.dispatchEvent("pointerup")
  expect(pressed === "none" || pressed.includes("matrix")).toBe(true)
})

test("Home mobile rail keeps native touch scroll and distinguishes mouse drag from click", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await seed(page)
  await page.goto("/")
  const rail = page.locator(".home-actions")
  await expect(rail).toBeVisible()
  await expect(page.getByRole("link", { name: "Start a blank draft" })).toBeVisible()
  await noOverflow(page)
  await page.screenshot({ path: "artifacts/phase-2/home-rail-populated-390.png", fullPage: true })

  const firstCard = rail.locator(".home-action-card").first()
  const firstPrimary = firstCard.locator(".home-action-primary")
  const linkBox = await page.locator(".home-action-primary").first().boundingBox()
  expect(linkBox).toBeTruthy()
  await page.mouse.move(linkBox!.x + linkBox!.width * 0.75, linkBox!.y + linkBox!.height / 2)
  await page.mouse.down()
  await page.mouse.move(linkBox!.x + linkBox!.width * 0.25, linkBox!.y + linkBox!.height / 2, { steps: 6 })
  const dragState = await rail.evaluate(node => ({ scrollLeft: node.scrollLeft, dragging: node.getAttribute("data-dragging"), scrollWidth: node.scrollWidth, clientWidth: node.clientWidth }))
  expect(dragState.dragging, JSON.stringify(dragState)).toBe("true")
  await page.mouse.up()
  await expect(page).toHaveURL(/\/$/)
  expect(await rail.evaluate(node => node.scrollLeft)).toBeGreaterThan(20)
  await page.screenshot({ path: "artifacts/phase-2/home-rail-mouse-drag-390.png", fullPage: true })

  await page.evaluate(() => { document.querySelector(".home-actions")!.scrollLeft = 0 })
  await page.keyboard.press("Tab")
  const finalPrimary = page.locator(".home-action-primary").last()
  await finalPrimary.focus()
  await expect(finalPrimary).toBeFocused()
  const focusState = await finalPrimary.evaluate(node => ({
    visible: node.matches(":focus-visible"),
    outline: getComputedStyle(node).outlineStyle,
    link: node.getBoundingClientRect().toJSON(),
    rail: node.closest(".home-actions")!.getBoundingClientRect().toJSON(),
  }))
  expect(focusState.visible).toBe(true)
  expect(focusState.outline).toBe("solid")
  expect(focusState.link.left).toBeGreaterThanOrEqual(focusState.rail.left - 1)
  expect(focusState.link.right).toBeLessThanOrEqual(focusState.rail.right + 1)
  await page.screenshot({ path: "artifacts/phase-2/home-rail-keyboard-focus-390.png", fullPage: true })
  await page.evaluate(() => { document.querySelector(".home-actions")!.scrollLeft = 0 })

  const session = await page.context().newCDPSession(page)
  await session.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 })
  const cardBox = await firstCard.boundingBox()
  expect(cardBox).toBeTruthy()
  const touchX = Math.round(cardBox!.x + cardBox!.width * 0.75)
  const touchY = Math.round(cardBox!.y + cardBox!.height / 2)
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: touchX, y: touchY, id: 1 }] })
  await page.waitForTimeout(30)
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: touchX - 200, y: touchY, id: 1 }] })
  await page.waitForTimeout(30)
  await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBeGreaterThan(20)
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBeGreaterThan(20)
  await expect(page).toHaveURL(/\/$/)
  await page.screenshot({ path: "artifacts/phase-2/home-rail-touch-drag-390.png", fullPage: true })

  await page.setViewportSize({ width: 390, height: 500 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.locator(".home-action-card").first().scrollIntoViewIfNeeded()
  const verticalBox = await page.locator(".home-action-card").first().boundingBox()
  expect(verticalBox).toBeTruthy()
  const verticalX = Math.round(verticalBox!.x + verticalBox!.width / 2)
  const verticalY = Math.round(verticalBox!.y + verticalBox!.height / 2)
  const verticalScrollBefore = await page.evaluate(() => window.scrollY)
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: verticalX, y: verticalY, id: 1 }] })
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: verticalX, y: verticalY - 110, id: 1 }] })
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(verticalScrollBefore)
  await noOverflow(page)
  await session.detach()

  await page.setViewportSize({ width: 390, height: 700 })
  await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector(".home-actions")!.scrollLeft = 0 })
  await firstPrimary.click()
  await expect(page).toHaveURL(/\/studio\?contentId=piece-0$/)
})


test("Home mouse rail glides at release speed, reverses, and reaches both ends", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await seed(page)
  await page.goto("/")
  const rail = page.locator(".home-actions")
  await expect(rail).toHaveAttribute("data-overflowing", "true")
  const initial = await rail.evaluate(node => ({ width: node.clientWidth, scrollWidth: node.scrollWidth, snap: getComputedStyle(node).scrollSnapType }))
  expect(initial.scrollWidth).toBeGreaterThan(initial.width)
  expect(initial.snap).toBe("none")
  const pageWidth = async () => page.evaluate(() => {
    const rail = document.querySelector<HTMLElement>(".home-actions")!
    const overflow = [...document.querySelectorAll<HTMLElement>("body *")].map(node => ({
      name: `${node.tagName.toLowerCase()}${node.className && typeof node.className === "string" ? `.${node.className.trim().replace(/\s+/g, ".")}` : ""}`,
      left: node.getBoundingClientRect().left,
      right: node.getBoundingClientRect().right,
      overflowX: getComputedStyle(node).overflowX,
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
    })).filter(node => node.right > innerWidth + 1).sort((a, b) => b.right - a.right).slice(0, 8)
    const srOnly = [...document.querySelectorAll<HTMLElement>(".sr-only")].map(node => ({ text: node.textContent, box: node.getBoundingClientRect().toJSON(), position: getComputedStyle(node).position, clip: getComputedStyle(node).clip, parent: node.parentElement?.outerHTML.slice(0, 220) }))
    const outside = overflow.filter(node => !node.name.includes("home-action-card") && !node.name.includes("home-actions"))
    return { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, scrollX, htmlOverflow: getComputedStyle(document.documentElement).overflowX, bodyOverflow: getComputedStyle(document.body).overflowX, workspace: document.querySelector<HTMLElement>(".home-workspace")!.getBoundingClientRect().toJSON(), rail: rail.getBoundingClientRect().toJSON(), railOverflow: getComputedStyle(rail).overflowX, outside, srOnly }
  })
  console.log("HOME_RAIL_PAGE_WIDTH_REST", JSON.stringify(await pageWidth()))
  await page.screenshot({ path: "artifacts/phase-2/home-rail-rest-390.png", fullPage: true })
  await page.screenshot({ path: "artifacts/phase-2/home-rail-rest-390-viewport.png" })
  const containment = await page.addStyleTag({ content: ".home-actions { contain: inline-size !important; }" })
  console.log("HOME_RAIL_CONTAINMENT", JSON.stringify(await pageWidth()))
  await containment.evaluate(node => node.remove())

  async function drag(delta: number, steps: number, pauseMs = 0, fromFirstLink = false) {
    const railBox = await rail.boundingBox()
    expect(railBox).toBeTruthy()
    const primaryBox = fromFirstLink ? await rail.locator(".home-action-primary").first().boundingBox() : null
    const startX = primaryBox ? primaryBox.x + primaryBox.width * .75 : railBox!.x + railBox!.width * .72
    const y = primaryBox ? primaryBox.y + primaryBox.height / 2 : railBox!.y + railBox!.height / 2
    await page.mouse.move(startX, y)
    await page.mouse.down()
    for (let step = 1; step <= steps; step += 1) {
      await page.mouse.move(startX + delta * step / steps, y, { steps: 1 })
      if (pauseMs && step < steps) await page.waitForTimeout(pauseMs)
    }
    await page.mouse.up()
    const atRelease = await rail.evaluate(node => node.scrollLeft)
    await page.waitForTimeout(80)
    const after80ms = await rail.evaluate(node => node.scrollLeft)
    await expect.poll(() => rail.getAttribute("data-momentum"), { timeout: 2000 }).toBeNull()
    const settled = await rail.evaluate(node => node.scrollLeft)
    return { atRelease, after80ms, settled }
  }

  await rail.evaluate(node => { node.scrollLeft = 0 })
  const fast = await drag(-120, 8, 0, true)
  console.log("HOME_RAIL_PAGE_WIDTH_GLIDE", JSON.stringify(await pageWidth()))
  expect(fast.atRelease).toBeGreaterThan(50)
  expect(fast.after80ms).toBeGreaterThan(fast.atRelease)
  await page.screenshot({ path: "artifacts/phase-2/home-rail-glide-fast-390.png", fullPage: true })

  await rail.evaluate(node => { node.scrollLeft = 0 })
  const slow = await drag(-120, 8, 30)
  expect(slow.atRelease).toBeGreaterThan(50)
  expect(slow.after80ms).toBeGreaterThan(slow.atRelease)
  expect(fast.after80ms).toBeGreaterThan(slow.after80ms)
  console.log("HOME_RAIL_RELEASE_SPEED", JSON.stringify({ fast, slow }))
  await page.screenshot({ path: "artifacts/phase-2/home-rail-glide-slow-390.png", fullPage: true })

  const beforeReverse = await rail.evaluate(node => node.scrollLeft)
  const reverse = await drag(90, 6, 10)
  expect(reverse.atRelease).toBeLessThan(beforeReverse)
  expect(reverse.settled).toBeLessThan(beforeReverse)

  for (let attempt = 0; attempt < 3; attempt += 1) await drag(-300, 4)
  const rightEnd = await rail.evaluate(node => ({ left: node.scrollLeft, max: node.scrollWidth - node.clientWidth }))
  expect(rightEnd.left).toBeCloseTo(rightEnd.max, 0)
  for (let attempt = 0; attempt < 3; attempt += 1) await drag(300, 4)
  expect(await rail.evaluate(node => node.scrollLeft)).toBe(0)
  console.log("HOME_RAIL_PAGE_WIDTH_END", JSON.stringify(await pageWidth()))
  await page.screenshot({ path: "artifacts/phase-2/home-rail-end-390.png", fullPage: true })
  await expect(page).toHaveURL(/\/$/)
})

test("Home empty mobile orders the blank action before inactive Recent writing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await seed(page, { "morrow:ideas": "[]", "morrow:content": "[]", "morrow.workspace.v1": JSON.stringify(workspace) })
  await page.goto("/")
  await expect(page.locator(".home-action-card--empty")).toHaveCount(2)
  await expect(page.locator(".home-action-card").first()).toContainText("Blank draft")
  await expect(page.locator(".home-action-card").nth(1)).toContainText("Continue")
  const inactiveWriting = page.locator(".home-action-card--empty").filter({ hasText: "Continue" })
  await inactiveWriting.hover()
  const emptyCardState = await inactiveWriting.evaluate(node => ({
    cursor: getComputedStyle(node).cursor,
    background: getComputedStyle(node).backgroundColor,
    transform: getComputedStyle(node).transform,
  }))
  expect(emptyCardState.cursor).toBe("default")
  expect(emptyCardState.background).toBe("rgb(255, 255, 255)")
  expect(emptyCardState.transform).toBe("none")
  await expect(page.getByRole("link", { name: "View all writing" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "View all ideas" })).toHaveCount(0)
  await page.screenshot({ path: "artifacts/phase-2/home-rail-empty-390.png", fullPage: true })
  await noOverflow(page)
})

test("Home empty, keyboard capture, failed save, retry and reopen preserve both formats", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "[]", "morrow:content": "[]" })
  await page.goto("/")
  await expect(page.getByText("No drafts yet.", { exact: false })).toBeVisible()
  await expect(page.getByRole("button", { name: "Save idea" })).toBeDisabled()
  await page.screenshot({ path: "artifacts/phase-2/home-empty-390.png", fullPage: true })
  const capture = page.getByRole("textbox", { name: "Capture an idea" })
  await capture.focus()
  await page.keyboard.type("A synthetic thought to keep through a failed save")
  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: "Save idea" })).toBeFocused()
  expect(await page.getByRole("button", { name: "Save idea" }).evaluate(node => getComputedStyle(node).boxShadow)).not.toBe("none")
  await page.evaluate(() => {
    const original = Storage.prototype.setItem
    Object.assign(window, { restoreWrites: () => { Storage.prototype.setItem = original } })
    Storage.prototype.setItem = function(key, value) { if (key === "morrow:ideas") throw new DOMException("Synthetic quota failure", "QuotaExceededError"); original.call(this, key, value) }
  })
  await page.keyboard.press("Enter")
  await expect(page.locator("#home-capture-error")).toContainText("Keep or copy")
  await expect(capture).toHaveValue("A synthetic thought to keep through a failed save")
  expect(await stored(page, "morrow:ideas")).toBe("[]")
  await page.screenshot({ path: "artifacts/phase-2/home-save-error.png", fullPage: true })
  await page.evaluate(() => (window as unknown as { restoreWrites: () => void }).restoreWrites())
  await capture.focus()
  await page.keyboard.press("Control+Enter")
  await expect(capture).toHaveValue("")
  await expect(page.getByText("Saved on this device.", { exact: false })).toBeVisible()
  await page.screenshot({ path: "artifacts/phase-2/home-saved.png", fullPage: true })
  await page.getByRole("link", { name: "View idea", exact: true }).click()
  await expect(page.getByRole("textbox")).toHaveValue("A synthetic thought to keep through a failed save")
  expect(await stored(page, "morrow.workspace.v1")).toBe(fixture["morrow.workspace.v1"])
})

test("Home load failure is recoverable and does not disable blank draft or capture", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": "{broken" })
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Couldn’t load recent work" })).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Capture an idea" })).toBeEditable()
  await page.screenshot({ path: "artifacts/phase-2/home-load-error.png", fullPage: true })
  await page.getByRole("textbox", { name: "Capture an idea" }).fill("Retain during corrupt-data failure")
  await page.getByRole("button", { name: "Save idea" }).click()
  await expect(page.getByRole("textbox")).toHaveValue("Retain during corrupt-data failure")
  expect(await stored(page, "morrow:ideas")).toBe("{broken")
  await page.evaluate(() => localStorage.setItem("morrow:ideas", "[]"))
  await page.getByRole("button", { name: "Try again", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Couldn’t load recent work" })).toHaveCount(0)
  const before = await stored(page, "morrow:content")
  await page.getByRole("link", { name: "Blank draft", exact: false }).click()
  await expect(page).toHaveURL(/\/studio$/)
  expect(await stored(page, "morrow:content")).toBe(before)
  await expect(page.getByRole("navigation", { name: "Primary destinations" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Back", exact: true })).toBeVisible()
})

for (const preference of [null, "light", "dark", "system", "retained-unknown"]) {
  test(`effective Light preserves raw preference ${preference}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" })
    await seed(page, preference === null ? {} : { "morrow.theme": preference })
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    expect(await page.locator("html").evaluate(node => getComputedStyle(node).colorScheme)).toBe("light")
    expect(await page.locator("body").evaluate(node => getComputedStyle(node).backgroundColor)).toBe("rgb(245, 245, 247)")
    expect(await stored(page, "morrow.theme")).toBe(preference)
    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    await page.emulateMedia({ colorScheme: "light" })
    await page.emulateMedia({ colorScheme: "dark" })
    expect(await stored(page, "morrow.theme")).toBe(preference)
    await noOverflow(page)
  })
}

test("blocked storage still paints Light and exposes recovery", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Synthetic access denied", "SecurityError") } }))
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
  await expect(page.getByRole("button", { name: "Try again", exact: true })).toBeVisible()
  await expect(page.getByRole("textbox")).toBeEditable()
})

for (const width of [390, 1440]) {
  test(`editor route regression at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await seed(page)
    for (const route of ["/ideas/idea-0", "/studio?contentId=piece-0", "/content/new", "/content/workspace-piece"]) {
      await page.goto(route)
      const field = page.getByRole("textbox").filter({ visible: true }).last()
      await expect(field).toBeEditable()
      await noOverflow(page)
      if (width < 768 && !route.startsWith("/ideas")) await expect(page.getByRole("navigation", { name: "Primary destinations" })).toHaveCount(0)
      await page.screenshot({ path: `artifacts/phase-2/route-${route.replace(/[^a-z0-9]/gi, "-")}-${width}.png`, fullPage: true })
    }
  })
}

for (const width of [390, 1440]) {
for (const [route, fieldLabel, key] of [["/studio?contentId=piece-0", "Content", "morrow:content"], ["/content/workspace-piece", "Draft", "morrow.workspace.v1"]]) {
  test(`save/retry ${key} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await seed(page)
      await page.goto(route)
      const field = page.getByRole("textbox", { name: fieldLabel, exact: true })
      await expect(field).toBeEditable()
      const original = await stored(page, key)
      await field.fill("First successful browser edit")
      await page.getByRole("button", { name: "Save changes", exact: true }).first().click()
      await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible()
      await field.fill("Later unsaved browser edit")
      await expect(page.getByText("Unsaved changes", { exact: false }).first()).toBeVisible()
      expect(await stored(page, key)).not.toBe(original)
      await page.evaluate(target => {
        const original = Storage.prototype.setItem
        Object.assign(window, { restoreWrites: () => { Storage.prototype.setItem = original } })
        Storage.prototype.setItem = function(key, value) { if (key === target) throw new DOMException("Synthetic quota", "QuotaExceededError"); original.call(this, key, value) }
      }, key)
      const saved = await stored(page, key)
      await page.getByRole("button", { name: "Save changes", exact: true }).first().click()
      await expect(page.getByRole("button", { name: "Retry save", exact: true }).first()).toBeEnabled()
      await expect(field).toHaveValue("Later unsaved browser edit")
      expect(await stored(page, key)).toBe(saved)
      await page.evaluate(() => (window as unknown as { restoreWrites: () => void }).restoreWrites())
      await page.getByRole("button", { name: "Retry save", exact: true }).first().click()
      await expect(page.getByText("Saved on this device", { exact: false }).first()).toBeVisible()
      const result = JSON.parse((await stored(page, key))!)
      const record = key === "morrow:content" ? result[0] : result.content[0]
      expect(record.createdAt).toBe(stamp)
      expect(record.retained).toBe("draft metadata")
      expect(record.body).toBe("Later unsaved browser edit")
      await field.fill("A further edit stays unsaved")
      await expect(page.getByText("Unsaved changes", { exact: false }).first()).toBeVisible()
      await page.reload()
      await expect(page.getByRole("textbox", { name: fieldLabel, exact: true })).toHaveValue("Later unsaved browser edit")
  })
}
}

test("200 percent desktop zoom equivalent reflows and keyboard reaches navigation", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await seed(page)
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Make something of today." })).toBeVisible()
  await noOverflow(page)
  const home = page.getByRole("navigation", { name: "Primary destinations" }).getByRole("link", { name: "Home", exact: true })
  await home.focus()
  await page.keyboard.press("Tab")
  await expect(page.getByRole("navigation", { name: "Primary destinations" }).getByRole("link", { name: "Studio", exact: true })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/studio$/)
})

test("reference-size single-record comparisons, enabled primary action and scroll clearance", async ({ page }) => {
  await seed(page, { ...fixture, "morrow:ideas": JSON.stringify([ideas[0]]), "morrow:content": JSON.stringify([content[0]]) })
  for (const [width, height, name] of [[1280, 1024, "desktop-reference"], [390, 884, "mobile-reference"]] as const) {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    await expect(page.locator('main a[href^="/studio?contentId="]')).toHaveCount(1)
    await page.getByRole("textbox", { name: "Capture an idea" }).fill("A synthetic thought, ready to save")
    await expect(page.getByRole("button", { name: "Save idea" })).toHaveCSS("background-color", "rgb(212, 252, 48)")
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `artifacts/phase-2/${name}.png`, fullPage: true })
    await page.mouse.wheel(0, 2000)
    if (width < 768) {
      const nav = (await page.getByRole("navigation", { name: "Primary destinations" }).boundingBox())!
      await expect.poll(async () => {
        const blank = (await page.getByRole("link", { name: "Blank draft", exact: false }).boundingBox())!
        return blank.y + blank.height <= nav.y
      }).toBe(true)
      await page.screenshot({ path: "artifacts/phase-2/mobile-bottom-clearance.png" })
    }
    await noOverflow(page)
  }
})

test("server loading presentation keeps manual capture and blank draft available", async ({ page }) => {
  // Pause only hydration scripts. Inspect actual server-rendered loading anatomy.
  const held: Array<() => Promise<void>> = []
  await page.route(/\/_next\/.*\.js(?:\?|$)/, route => new Promise<void>(resolve => held.push(async () => { await route.continue(); resolve() })))
  await page.goto("/", { waitUntil: "commit" })
  await expect(page.getByText("Loading recent work…", { exact: true })).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Capture an idea" })).toBeEditable()
  await expect(page.getByRole("link", { name: "Blank draft", exact: false })).toBeVisible()
  await page.screenshot({ path: "artifacts/phase-2/home-loading.png", fullPage: true })
  await page.unroute(/\/_next\/.*\.js(?:\?|$)/)
  await Promise.all(held.map(release => release()))
  await expect(page.getByText("Loading recent work…", { exact: true })).toHaveCount(0)
})
