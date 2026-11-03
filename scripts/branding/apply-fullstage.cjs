#!/usr/bin/env node
// Warning-only FullStage brand staging. Missing optional images never abort a build.
const fs = require("node:fs")
const path = require("node:path")
const root = path.resolve(__dirname, "../..")
const source = path.join(root, "branding/fullstage")
const assets = {
    "icons/fullstage-icon-full-color.png": "public/icon.png",
    "platform/windows/fullstage.ico": "public/icon.ico",
    "platform/macos/fullstage.icns": "public/icon.icns",
    "logos/fullstage-lockup-white.png": "public/fullstage-lockup-white.png",
    "logos/fullstage-lockup-full-color.png": "public/fullstage-lockup-full-color.png"
}
const report = { mode: "warning-only", checkedAt: new Date().toISOString(), copied: [], missing: [], warnings: [] }
for (const [file, destination] of Object.entries(assets)) {
    const input = path.join(source, file)
    const output = path.join(root, destination)
    if (!fs.existsSync(input)) {
        const warning = "Missing optional FullStage brand asset: " + file
        report.missing.push(file)
        report.warnings.push(warning)
        console.warn("[FullStage branding] WARNING: " + warning)
        continue
    }
    try {
        fs.mkdirSync(path.dirname(output), { recursive: true })
        fs.copyFileSync(input, output)
        report.copied.push({ file, destination })
        console.log("[FullStage branding] " + file + " -> " + destination)
    } catch (error) {
        const warning = "Could not copy " + file + ": " + (error && error.message ? error.message : error)
        report.warnings.push(warning)
        console.warn("[FullStage branding] WARNING: " + warning)
    }
}
try {
    const output = path.join(root, "public/fullstage-branding-status.json")
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.writeFileSync(output, JSON.stringify(report, null, 2))
} catch (error) {
    console.warn("[FullStage branding] WARNING: could not write status report:", error)
}
console.log("[FullStage branding] " + report.copied.length + " copied, " + report.missing.length + " missing; build may proceed.")
