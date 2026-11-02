import { _electron as electron } from "playwright"
import { expect, test } from "@playwright/test"
import tmp from "tmp"

// Development-only smoke suite: run after building with VITE_FULLSTAGE_UI=true.
// This tests operator affordances and local media metadata. It does NOT certify
// audience-display output, native media persistence or hardware blackout.
test("FullStage native operator: preview, guard, clear/restore and metadata reload", async () => {
    const settings = tmp.dirSync({ unsafeCleanup: true })
    const data = tmp.dirSync({ unsafeCleanup: true })
    const app = await electron.launch({
        args: [".", "--no-sandbox"],
        env: { ...process.env, NODE_ENV: "production", FS_MOCK_STORE_PATH: settings.name }
    })
    try {
        await app.evaluate(async ({ dialog }, path) => {
            dialog.showOpenDialog = async (): Promise<any> => ({ canceled: false, filePaths: [path] })
        }, data.name)
        let window = app.windows().find(w => w.url().includes("index.html"))
        for (let i = 0; i < 40 && !window; i++) {
            await new Promise(resolve => setTimeout(resolve, 500))
            window = app.windows().find(w => w.url().includes("index.html"))
        }
        if (!window) throw new Error("Main Electron window did not open")
        await window.locator(".popup button.start, .top").first().waitFor({ timeout: 30_000 })
        const setup = window.locator(".popup button.start")
        if (await setup.isVisible().catch(() => false)) {
            const popup = window.locator(".popup")
            await popup.locator(".dropdown-trigger").first().click()
            await popup.locator("li[role=option]").filter({ hasText: "English" }).first().click()
            await popup.locator(".button-trigger").first().click()
            await setup.click()
            const skip = window.locator("#guideButtons").getByText("Skip")
            if (await skip.isVisible({ timeout: 10_000 }).catch(() => false)) await skip.click()
        }

        const workspace = window.getByRole("region", { name: "FullStage operator workspace" })
        await expect(workspace).toBeVisible({ timeout: 30_000 })
        const take = workspace.getByRole("button", { name: "TAKE LIVE" })
        // Without a selected show, TAKE cannot transmit any output.
        await expect(take).toBeDisabled()
        await expect(workspace.getByRole("button", { name: "CLEAR SLIDE" })).toBeVisible()
        await expect(workspace.getByRole("button", { name: "CLEAR ALL" })).toBeVisible()
        await expect(workspace.getByRole("button", { name: "RESTORE" })).toBeVisible()

        // Use the CI-only native-store fixture rather than first-run project dialogs.
        const fixture = await window.evaluate(() => {
            const probe = (window as any).__fullstageSmoke
            if (!probe?.seedFixture) throw new Error("Missing CI fixture bridge")
            return probe.seedFixture() as { showId: string; outputId: string }
        })
        await expect(take).toBeEnabled({ timeout: 15_000 })
        await expect(workspace.getByRole("button", { name: /Cue 2/ })).toBeVisible()
        // Inspect real FreeShow outputs, not merely displayed button labels.
        // The read-only bridge is compiled exclusively into VITE_FULLSTAGE_TEST builds.
        const snapshot = () => window.evaluate(() => {
            const probe = (window as any).__fullstageSmoke
            if (!probe) throw new Error("Missing test-only FullStage output probe")
            return probe.snapshot() as Record<string, { enabled?: boolean; out?: { slide?: { id?: string; index?: number } | null } }>
        })
        const outputsBefore = await snapshot()
        const liveIds = [fixture.outputId]
        expect(outputsBefore[fixture.outputId]?.enabled).toBe(true)
        if (!liveIds.length) throw new Error("Cannot prove preview/live isolation: no enabled outputs configured")
        const unchanged = (a: typeof outputsBefore, b: typeof outputsBefore) =>
            liveIds.every(id => JSON.stringify(a[id]?.out ?? null) === JSON.stringify(b[id]?.out ?? null))

        // Cue selection alone is forbidden to mutate the actual output stores.
        await workspace.getByRole("button", { name: /Cue 2/ }).first().click()
        await expect.poll(async () => window.evaluate(() => (window as any).__fullstageSmoke.selectedIndex())).toBe(1)
        const outputsAfterPreview = await snapshot()
        expect(unchanged(outputsBefore, outputsAfterPreview), "preview selection must not alter live outputs").toBe(true)
        await take.click()
        await expect.poll(async () => {
            const current = await snapshot()
            return current[fixture.outputId]?.out?.slide?.id === fixture.showId && current[fixture.outputId]?.out?.slide?.index === 1
        }, { timeout: 10_000 }).toBe(true)
        const liveAfterTake = await snapshot()
        // CLEAR SLIDE only clears slide data; RESTORE recovers the CLEAR ALL cache.
        await workspace.getByRole("button", { name: "CLEAR SLIDE" }).click()
        await expect.poll(async () => (await snapshot())[fixture.outputId]?.out?.slide ?? null).toBeNull()
        await take.click()
        await expect.poll(async () => (await snapshot())[fixture.outputId]?.out?.slide?.index).toBe(1)
        await workspace.getByRole("button", { name: "CLEAR ALL" }).click()
        await expect.poll(async () => (await snapshot())[fixture.outputId]?.out?.slide ?? null).toBeNull()
        await workspace.getByRole("button", { name: "RESTORE" }).click()
        await expect.poll(async () => (await snapshot())[fixture.outputId]?.out?.slide?.index).toBe(1)
        expect(liveAfterTake).not.toEqual(outputsBefore)
        // The media playlist is explicitly metadata-only localStorage today.
        await workspace.getByRole("button", { name: "studio", exact: true }).click()
        await workspace.getByRole("button", { name: "Media Studio", exact: true }).click()
        const playlist = workspace.getByText("Playlist").locator("..").locator("input")
        await playlist.fill("CI Smoke Playlist")
        // LocalStorage persistence is verified using a harmless synthetic entry.
        await window.evaluate(() => {
            localStorage.setItem("fullstage-media-v1", JSON.stringify({
                version: 1,
                entries: [{ id: "smoke-entry", name: "CI Smoke Asset", path: "", type: "image/png", folder: "Local imports" }],
                playlists: { "CI Smoke Playlist": ["smoke-entry"] }
            }))
        })
        await window.reload()
        await expect(workspace).toBeVisible({ timeout: 30_000 })
        await workspace.getByRole("button", { name: "studio", exact: true }).click()
        await workspace.getByRole("button", { name: "Media Studio", exact: true }).click()
        await expect(workspace.getByText("CI Smoke Asset")).toBeVisible()
        await workspace.getByText("Playlist").locator("..").locator("input").fill("CI Smoke Playlist")
        await expect(workspace.getByText("1 items")).toBeVisible()
        // Physical output and actual file durability still require separate tests.
    } finally {
        await Promise.race([app.close(), new Promise(resolve => setTimeout(resolve, 5000))]).catch(() => {})
        const p = app.process()
        if (p && !p.killed) try { p.kill("SIGKILL") } catch {}
        data.removeCallback()
        settings.removeCallback()
    }
})
