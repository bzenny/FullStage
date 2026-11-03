#!/usr/bin/env node
/**
 * Apply the approved FullStage brand assets to a local build working tree.
 * Run before npm run build, after unpacking branding/fullstage source assets.
 * Does not alter FreeShow source artwork kept in the Git history.
 */
const fs = require("node:fs")
const path = require("node:path")
const root = path.resolve(__dirname, "../..")
const source = path.join(root, "branding/fullstage")
const required = {
    "icons/fullstage-icon-full-color.png": "public/icon.png",
    "platform/windows/fullstage.ico": "public/icon.ico",
    "platform/macos/fullstage.icns": "public/icon.icns",
    "logos/fullstage-lockup-white.png": "public/fullstage-lockup-white.png",
    "logos/fullstage-lockup-full-color.png": "public/fullstage-lockup-full-color.png"
}
for (const [src] of Object.entries(required)) {
    const location = path.join(source, src)
    if (!fs.existsSync(location)) {
        console.error("Missing approved FullStage branding asset: " + location)
        console.error("Extract the complete FullStage_Branding_v1_Git_Ready.zip into the repository root first.")
        process.exit(1)
    }
}
for (const [src, dest] of Object.entries(required)) {
    const location = path.join(root, dest)
    fs.mkdirSync(path.dirname(location), { recursive: true })
    fs.copyFileSync(path.join(source, src), location)
    console.log("Applied " + src + " -> " + dest)
}
console.log("FullStage branding assets installed into public/ for this build.")
