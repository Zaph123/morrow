import { spawn, spawnSync } from "node:child_process"
import { setTimeout as delay } from "node:timers/promises"

const port = 3117
const url = `http://127.0.0.1:${port}`

export default async function setupBrowserServer() {
  try {
    await fetch(url, { signal: AbortSignal.timeout(750) })
    throw new Error(`${url} is already serving a page; refusing to reuse or stop it.`)
  } catch (error) {
    if (error instanceof Error && error.message.includes("already serving")) throw error
  }

  const child = spawn(process.execPath, ["./node_modules/next/dist/bin/next", "start", "--port", String(port), "--hostname", "127.0.0.1"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  })
  const exited = new Promise(resolve => child.once("exit", (code, signal) => resolve({ code, signal })))
  let exitInfo
  child.once("error", error => { exitInfo = { error } })

  try {
    const deadline = Date.now() + 90_000
    while (Date.now() < deadline) {
      if (exitInfo) throw exitInfo.error ?? new Error("The Next.js browser server exited during startup.")
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(750) })
        if (response.ok) return async () => stopServer(child, exited)
      } catch {
        // The listener is not ready yet; retry within the bounded startup window.
      }
      await delay(250)
    }
    throw new Error("The Next.js browser server did not become ready within 90 seconds.")
  } catch (error) {
    await stopServer(child, exited)
    throw error
  }
}

async function stopServer(child, exited) {
  if (child.exitCode !== null || child.signalCode !== null) return
  child.kill("SIGTERM")
  const result = await Promise.race([exited, delay(3_000).then(() => null)])
  if (result) return
  if (process.platform === "win32" && child.pid) {
    spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true })
  } else {
    child.kill("SIGKILL")
  }
  await Promise.race([exited, delay(3_000)])
}
