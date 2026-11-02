// Only notarize signed distributions when Apple credentials are available.
// CI alpha/unpacked builds are intentionally unsigned and must not invoke Apple's service.
const { notarize } = require("@electron/notarize")

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== "darwin") return

    const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env
    if (!APPLE_ID || !APPLE_APP_SPECIFIC_PASSWORD || !APPLE_TEAM_ID) {
        console.log("Skipping Apple notarization for unsigned development build")
        return
    }

    const appName = context.packager.appInfo.productFilename
    return notarize({
        appBundleId: "app.freeshow",
        appPath: `${appOutDir}/${appName}.app`,
        appleId: APPLE_ID,
        appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
        teamId: APPLE_TEAM_ID
    })
}
