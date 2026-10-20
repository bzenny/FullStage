# CI and alpha release process

## Current status
The GitHub repository initially contains governance files only. `Desktop CI` detects the absence of Electron/Svelte source and skips the desktop matrix intentionally. It does not create a fake installer. `Alpha release (manual)` fails with a precise message until the original FreeShow-derived source is imported and the LICENSE is reviewed.

## Branch policy
- `main`: reviewed integration baseline.
- `feature/*`: focused changes through pull requests.
- `integration/*`: upstream FreeShow adaptation.
- Tags: `vMAJOR.MINOR.PATCH-alpha.N` for early testing, `-beta.N` after native tests, stable only after validated hardware outputs.

## Before enabling desktop builds
1. Fetch FreeShow `v1.6.6`, preserve copyright notices and commit provenance.
2. Import source, lockfile and Electron configuration. Confirm `npm ci`, `npm run build`, `npm run pack` locally.
3. Validate that the unpacked output directories match the artifact globs in the workflow (build config may need adaptation).
4. Review native dependencies and runner system packages.
5. Add Playwright virtual-display tests and physical HDMI/NDI/OBS test records. CI cannot replace physical hardware tests.
6. Add installer signing and notarization credentials later through protected GitHub environments. Never commit signing secrets.

## Workflow behavior
- `foundation-ci.yml`: verifies repository governance.
- `desktop-ci.yml`: on PR/push, runs three-platform tests and uploads **unpacked app** artifacts only when source prerequisites exist.
- `alpha-release.yml`: manual workflow, requires valid alpha version, license, desktop source and successful builds. Creates a **draft prerelease**, not an automatically public release.
- Approve draft releases manually after artifact review.

## Known limitations
FreeShow native modules may require further Linux/macOS/Windows packages. The upstream `electron-builder` output directory has not been confirmed in this GitHub repository. Build jobs are configured but cannot pass before source integration. The workflow uses available unsigned packaging and should not be treated as production certification.

## Suggested repository protection
Require PR reviews, passing foundation and desktop CI checks when applicable, and restrict direct pushes after the build is established. Enable Dependabot and secret scanning in repository settings.
