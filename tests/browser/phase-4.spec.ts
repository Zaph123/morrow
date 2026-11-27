import { test, expect, type Page } from "@playwright/test"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const stamp = "2020-01-02T03:04:05.000Z"
const longDraft = "A deliberate writing surface should leave room for the thought to change.\n\nKeep the full paragraphs intact while the editor reflows across screens. This second paragraph confirms that the complete text remains available after saving and reopening."
const legacyIdea = {
  id: "idea-legacy",
  text: "A small idea that can grow into a longer piece.",
  status: "active",
  createdAt: stamp,
  updatedAt: stamp,
  retainedIdeaField: "keep this",
}
const legacyDraft = {
  id: "legacy-draft",
  title: "Speed vs clarity",
  body: "Most tools are built to help you finish faster. The good ones help you notice what you actually think before you start.",
  status: "draft",
  platform: "linkedin",
  sourceIdeaId: "idea-legacy",
  createdAt: stamp,
  updatedAt: stamp,
  retainedMetadata: { owner: "synthetic" },
}
const workspaceIdea = {
  id: "idea-workspace",
  body: "A workspace idea that should remain separate from legacy data.",
  createdAt: stamp,
  updatedAt: stamp,
}
const workspaceDraft = {
  id: "workspace-draft",
  title: "Speed vs clarity",
  body: "Most tools are built to help you finish faster. The good ones help you notice what you actually think before you start.",
  status: "draft",
  platform: "linkedin",
  sourceIdeaId: "idea-workspace",
  createdAt: stamp,
  updatedAt: stamp,
  retainedMetadata: { owner: "synthetic" },
}
const fixture = {
  "morrow:ideas": JSON.stringify([legacyIdea]),
  "morrow:content": JSON.stringify([legacyDraft]),
  "morrow.workspace.v1": JSON.stringify({ version: 1, ideas: [workspaceIdea], content: [workspaceDraft], retained: "keep workspace root" }),
}

async function seed(page: Page) {
  await page.addInitScript((values) => {
    if (sessionStorage.getItem("phase4-seeded")) return
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value)
    sessionStorage.setItem("phase4-seeded", "yes")
  }, fixture)
}

async function stored(page: Page, key: string) {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key)
}

async function blockOneWrite(page: Page, key: string) {
  await page.evaluate((storageKey) => {
    const original = Storage.prototype.setItem
    let shouldFail = true
    Storage.prototype.setItem = function (name, value) {
      if (shouldFail && name === storageKey) {
        shouldFail = false
        throw new DOMException("Synthetic quota", "QuotaExceededError")
      }
      return original.call(this, name, value)
    }
  }, key)
}

async function waitForEditor(page: Page) {
  await expect(page.getByRole("textbox", { name: "Draft content" })).toBeVisible()
}

async function capture(page: Page, name: string, sourceRelativePath: string, rootSelector = ".studio-writing-surface") {
  const viewport = page.viewportSize()!
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator(rootSelector).first()).toBeVisible()
  const output = await page.screenshot({ animations: "disabled" })
  const measurements = await page.evaluate((isStart) => {
    const selectors = isStart
      ? [".studio-start", ".studio-start-page-title", ".studio-start-layout", ".studio-start-intro", ".studio-start-primary", ".studio-start-options", ".studio-resume", ".studio-resume-card", ".studio-resume-preview"]
      : [".studio-writing-surface", ".studio-editor-toolbar", ".studio-editor-title", ".studio-editor-actions", ".studio-platform-control", ".studio-writing-card", ".studio-source-context", ".studio-writing-body", ".studio-writing-footer"]
    return Object.fromEntries(selectors.map((selector) => {
      const node = document.querySelector(selector)
      if (!node) return [selector, null]
      const style = getComputedStyle(node)
      return [selector, {
        bounds: node.getBoundingClientRect().toJSON(),
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        color: style.color,
        background: style.backgroundColor,
        border: style.border,
        padding: style.padding,
        minHeight: style.minHeight,
      }]
    }))
  }, rootSelector === ".studio-start")
  const outputDir = resolve("artifacts/phase-4")
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(resolve(outputDir, `${name}-morrow.png`), output)
  writeFileSync(resolve(outputDir, `${name}-measurements.json`), JSON.stringify({ viewport, measured: measurements }, null, 2))

  const source = readFileSync(resolve("artifacts/references/stitch", sourceRelativePath))
  const dataUrl = `data:image/png;base64,${source.toString("base64")}`
  const appUrl = `data:image/png;base64,${output.toString("base64")}`
  const comparisonPage = await page.context().newPage()
  await comparisonPage.setViewportSize({ width: viewport.width * 2, height: viewport.height + 32 })
  await comparisonPage.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;background:#fff;font:12px Arial,sans-serif}
    main{display:grid;grid-template-columns:${viewport.width}px ${viewport.width}px;grid-template-rows:32px ${viewport.height}px}
    header{display:flex;align-items:center;padding:0 12px;border-bottom:1px solid #ddd;color:#121316}
    img{display:block;width:${viewport.width}px;height:${viewport.height}px;object-fit:fill}
  </style></head><body><main><header>Selected original Stitch source</header><header>Morrow app output</header><img alt="Original Stitch PNG" src="${dataUrl}"><img alt="Morrow app screenshot" src="${appUrl}"></main></body></html>`, { waitUntil: "domcontentloaded" })
  await comparisonPage.locator("img").evaluateAll((images) => Promise.all(images.map((image) => (image as HTMLImageElement).decode())))
  await comparisonPage.screenshot({ path: resolve(outputDir, `${name}-comparison.png`) })
  await comparisonPage.close()
}

test.beforeEach(async ({ page }) => {
  await seed(page)
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort())
})

test("Studio opens its reference-based start page and resumes only legacy Studio drafts", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await page.goto("/studio")
  await expect(page.getByRole("heading", { name: "Make room for your next draft." })).toBeVisible()
  await expect(page.getByRole("link", { name: "Start writing" })).toHaveAttribute("href", "/studio/new")
  await expect(page.getByRole("link", { name: /Speed vs clarity/ })).toHaveAttribute("href", "/studio?contentId=legacy-draft")
  await expect(page.getByRole("link", { name: /Workspace draft/ })).toHaveCount(0)

  await page.evaluate((draft) => {
    localStorage.setItem("morrow:content", JSON.stringify([
      { ...draft, id: "published-record", title: "A published piece", status: "published", updatedAt: "2026-01-03T03:04:05.000Z" },
      draft,
    ]))
  }, legacyDraft)
  await page.reload()
  await expect(page.getByRole("link", { name: /Speed vs clarity/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /A published piece/ })).toHaveCount(0)
  await capture(page, "studio-start-desktop", "source-b/reference-export/studio_desktop_start_refined/screen.png", ".studio-start")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(page.locator(".mobile-top-bar")).toBeHidden()
  await expect(page.getByRole("navigation", { name: "Primary destinations" })).toBeVisible()
  await expect(page.getByRole("link", { name: "From an idea" })).toBeVisible()
  await expect(page.getByText("AI discussion isn’t available yet.")).toBeVisible()
  await capture(page, "studio-start-mobile", "source-a/reference-export/studio_mobile_start/screen.png", ".studio-start")

  await page.getByRole("link", { name: "Start writing" }).click()
  await expect(page).toHaveURL(/\/studio\/new$/)
  await waitForEditor(page)
  await expect(page.locator(".mobile-top-bar")).toBeHidden()
  await expect(page.getByRole("navigation", { name: "Primary destinations" })).toHaveCount(0)
})

test("legacy blank draft from Home keeps its store and saves full text", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await page.goto("/")
  await page.getByRole("link", { name: "Start a blank draft" }).click()
  await waitForEditor(page)
  await expect(page.getByRole("textbox", { name: "Draft title" })).toBeVisible()
  await expect(page.getByRole("combobox", { name: "Platform" })).toHaveValue("")
  await capture(page, "studio-blank-desktop", "source-b/reference-export/studio_desktop_blank_draft/screen.png")

  await page.getByRole("textbox", { name: "Draft content" }).fill(longDraft)
  await page.getByRole("combobox", { name: "Platform" }).selectOption("x")
  await page.getByRole("button", { name: "Save draft" }).click()
  await expect(page).toHaveURL(/\/studio\?contentId=/)
  const legacy = JSON.parse((await stored(page, "morrow:content"))!)
  const created = legacy[0]
  expect(created.body).toBe(longDraft)
  expect(created.platform).toBe("x")
  expect(created.sourceIdeaId).toBeNull()
  expect(created.status).toBe("draft")
  expect(JSON.parse((await stored(page, "morrow.workspace.v1"))!).content).toEqual([workspaceDraft])
})

test("legacy idea entry seeds, retries a failed save and reopens the same record", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/ideas/idea-legacy")
  await page.getByRole("link", { name: "New draft from this idea" }).click()
  await waitForEditor(page)
  await expect(page.getByRole("textbox", { name: "Draft content" })).toHaveValue(legacyIdea.text)
  await capture(page, "studio-idea-seeded-mobile", "source-b/reference-export/studio_mobile_write/screen.png")
  await page.getByRole("textbox", { name: "Draft title" }).fill("An idea in progress")
  await page.getByRole("textbox", { name: "Draft content" }).fill(longDraft)
  await blockOneWrite(page, "morrow:content")
  await page.getByRole("button", { name: "Save draft" }).click()
  await expect(page.locator(".studio-editor-save-status[role='alert']")).toContainText(/Could not save|storage/i)
  await expect(page.getByRole("textbox", { name: "Draft content" })).toHaveValue(longDraft)
  await capture(page, "studio-save-failure-mobile", "source-b/reference-export/studio_mobile_write/screen.png")
  await page.getByRole("button", { name: "Retry save" }).click()
  await expect(page).toHaveURL(/\/studio\?contentId=/)
  const saved = JSON.parse((await stored(page, "morrow:content"))!).find((item: { title: string }) => item.title === "An idea in progress")
  expect(saved.body).toBe(longDraft)
  expect(saved.sourceIdeaId).toBe(legacyIdea.id)
  await page.goto(`/studio?contentId=${saved.id}`)
  await waitForEditor(page)
  await expect(page.getByRole("textbox", { name: "Draft content" })).toHaveValue(longDraft)
  expect(JSON.parse((await stored(page, "morrow:ideas"))!)[0]).toEqual(legacyIdea)
})

test("workspace blank draft stays in the workspace store", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await page.goto("/content/new")
  await waitForEditor(page)
  await expect(page.getByRole("textbox", { name: "Draft content" })).toHaveValue("")
  await capture(page, "studio-workspace-blank-desktop", "source-b/reference-export/studio_desktop_blank_draft/screen.png")
  await page.getByRole("textbox", { name: "Draft title" }).fill("Workspace blank")
  await page.getByRole("textbox", { name: "Draft content" }).fill(longDraft)
  await page.getByRole("button", { name: "Create draft" }).click()
  const snapshot = JSON.parse((await stored(page, "morrow.workspace.v1"))!)
  const created = snapshot.content.find((item: { title: string }) => item.title === "Workspace blank")
  expect(created.body).toBe(longDraft)
  expect(created.sourceIdeaId).toBeNull()
  await expect(page).toHaveURL(new RegExp(`/content/${created.id}$`))
  expect(JSON.parse((await stored(page, "morrow:content"))!)).toEqual([legacyDraft])
})

test("workspace editor seeds from its own store and preserves failed-save recovery", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/content/new?from=idea-workspace")
  await waitForEditor(page)
  await expect(page.getByRole("textbox", { name: "Draft content" })).toHaveValue(workspaceIdea.body)
  await page.getByRole("textbox", { name: "Draft title" }).fill("Workspace draft")
  await page.getByRole("textbox", { name: "Draft content" }).fill(longDraft)
  await page.getByRole("combobox", { name: "Platform" }).selectOption("whatsapp")
  await page.getByRole("button", { name: "Create draft" }).click()
  let workspace = JSON.parse((await stored(page, "morrow.workspace.v1"))!)
  const created = workspace.content.find((item: { title: string }) => item.title === "Workspace draft")
  const id = created?.id
  expect(id).toBeTruthy()
  await expect(page).toHaveURL(new RegExp(`/content/${id}$`))
  const settledUrl = new URL(page.url())
  expect(settledUrl.pathname).toBe(`/content/${id}`)
  expect(created.body).toBe(longDraft)
  expect(created.platform).toBe("whatsapp")
  expect(created.sourceIdeaId).toBe(workspaceIdea.id)
  await capture(page, "studio-existing-mobile", "source-a/reference-export/studio_mobile_write_after_accept/screen.png")
  await page.setViewportSize({ width: 1280, height: 1024 })
  await capture(page, "studio-workspace-existing-desktop", "source-b/reference-export/studio_desktop_canonical/screen.png")
  await page.setViewportSize({ width: 390, height: 844 })

  await page.getByRole("textbox", { name: "Draft content" }).fill(`${longDraft}\nAn unsaved revision.`)
  await blockOneWrite(page, "morrow.workspace.v1")
  await page.getByRole("button", { name: "Save changes" }).click()
  await expect(page.locator(".studio-editor-save-status[role='alert']")).toContainText(/Could not save/i)
  await expect(page.getByRole("textbox", { name: "Draft content" })).toHaveValue(`${longDraft}\nAn unsaved revision.`)
  await page.getByRole("button", { name: "Retry save" }).click()
  await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled()
  workspace = JSON.parse((await stored(page, "morrow.workspace.v1"))!)
  const updated = workspace.content.find((item: { id: string }) => item.id === id)
  expect(updated.createdAt).toBe(created.createdAt)
  expect(updated.updatedAt).not.toBe(created.updatedAt)
  expect(updated.sourceIdeaId).toBe(workspaceIdea.id)
  expect(JSON.parse((await stored(page, "morrow:content"))!)).toEqual([legacyDraft])
})

test("existing legacy draft can be reopened and updated without changing creation metadata", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1024 })
  await page.goto("/content")
  await page.getByRole("link", { name: /Speed vs clarity/ }).click()
  await expect(page).toHaveURL(/\/studio\?contentId=legacy-draft/)
  await waitForEditor(page)
  await expect(page.getByRole("textbox", { name: "Draft title" })).toHaveValue(legacyDraft.title)
  await capture(page, "studio-existing-desktop", "source-b/reference-export/studio_desktop_canonical/screen.png")
  await page.getByRole("textbox", { name: "Draft content" }).fill(longDraft)
  await page.getByRole("button", { name: "Save changes" }).click()
  const after = JSON.parse((await stored(page, "morrow:content"))!).find((item: { id: string }) => item.id === legacyDraft.id)
  expect(after.createdAt).toBe(stamp)
  expect(after.updatedAt).not.toBe(stamp)
  expect(after.sourceIdeaId).toBe(legacyDraft.sourceIdeaId)
  expect(after.retainedMetadata).toEqual(legacyDraft.retainedMetadata)
})

test("missing source relationships remain distinct and drafts stay editable", async ({ page }) => {
  await page.goto("/studio?sourceIdeaId=missing-legacy")
  await expect(page.getByRole("heading", { name: "Couldn’t load your writing" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible()

  await page.goto("/content/new?from=missing-workspace")
  await expect(page.getByRole("heading", { name: "Source idea not found" })).toBeVisible()
  await page.getByRole("link", { name: "Start a blank draft" }).click()
  await waitForEditor(page)

  await page.evaluate(() => {
    const key = "morrow.workspace.v1"
    const snapshot = JSON.parse(localStorage.getItem(key)!)
    snapshot.ideas = []
    localStorage.setItem(key, JSON.stringify(snapshot))
  })
  await page.goto("/content/workspace-draft")
  await waitForEditor(page)
  await expect(page.locator(".studio-source-unavailable")).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Draft content" })).toBeEditable()
  expect(JSON.parse((await stored(page, "morrow.workspace.v1"))!).content[0].sourceIdeaId).toBe(workspaceDraft.sourceIdeaId)
})
