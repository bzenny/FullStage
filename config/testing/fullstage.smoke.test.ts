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

        // Exercise a real cue rather than asserting button labels alone.
        await window.getByText("New project").first().click({ timeout: 15_000 })
        await window.getByText("New show").first().click({ timeout: 15_000 })
        await window.locator("#name").fill("FullStage Smoke Show")
        await window.getByText("Quick Lyrics").click()
        await window.getByPlaceholder("[Verse]").fill("[Verse]\\nFullStage smoke cue")
        await window.getByTestId("create.show.popup.new.show").click()
        await expect(take).toBeEnabled({ timeout: 15_000 })
        // Selecting a cue should only update preview selection until TAKE is clicked.
        await workspace.getByRole("button", { name: /Cue 1/ }).first().click()
        await take.click()
        await workspace.getByRole("button", { name: "CLEAR SLIDE" }).click()
        await workspace.getByRole("button", { name: "RESTORE" }).click()
        // CLEAR ALL uses FreeShow's clear action; this is not physical blackout.
        await workspace.getByRole("button", { name: "CLEAR ALL" }).click()
        await expect(workspace).toBeVisible()
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
        // Preview/live and actual file durability still require separate tests.
    } finally {
        await Promise.race([app.close(), new Promise(resolve => setTimeout(resolve, 5000))]).catch(() => {})
        const p = app.process()
        if (p && !p.killed) try { p.kill("SIGKILL") } catch {}
        data.removeCallback()
        settings.removeCallback()
    }
})
