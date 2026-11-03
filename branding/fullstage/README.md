# FullStage — Ribbon Spotlight F (approved v1.0)

**FullStage · Open Presenter Software**  
**Tagline:** *Every Screen. Every Moment.*

This is the canonical brand-asset directory for the FreeShow-based FullStage desktop application and future mobile remote. Retain upstream attribution and GPL license notices.

## Source assets

| Path | Use |
| --- | --- |
| `icons/fullstage-icon-full-color.png` | Approved full-color transparent symbol |
| `icons/fullstage-icon-dark.png` | Approved dark-symbol transparent treatment |
| `logos/fullstage-lockup-full-color.png` | Full-color transparent wordmark |
| `logos/fullstage-lockup-simplified.png` | Simplified transparent wordmark |
| `logos/fullstage-lockup-white.png` | Approved light-on-dark wordmark |
| `marketing/fullstage-hero.png` | Large website and desktop launch marketing graphic |
| `guides/fullstage-brand-guide-v1.png` | Approved brand guide |
| `guides/fullstage-brand-quick-sheet-v1.png` | Approved quick reference |

## Exported application assets

- `platform/windows/fullstage.ico` — multi-size Windows desktop icon (16–256 px)
- `platform/macos/fullstage.icns` — macOS Dock and application bundle icon
- `platform/linux/hicolor/<size>x<size>.png` — 16, 24, 32, 48, 64, 128, 256, 512 and 1024 px
- `platform/linux/fullstage.png` — 512 px Linux launcher fallback
- `platform/android/` — density-specific legacy launcher PNGs plus adaptive icon resources
- `platform/ios/FullStage.xcassets/AppIcon.appiconset/` — opaque 1024 px universal AppIcon

A full-resolution Git-ready asset ZIP is supplied with this brand release. **Do not copy the logos as base64 into markdown or regenerate their shape.** Preserve the approved user-supplied PNG bytes. `ASSET-MANIFEST.json` records original SHA-256 hashes and export sizes.

## Brand system

- Stage Blue `#2563FF`
- Spotlight Teal `#06D6A0`
- Accent Gold `#FFC24D`
- Night Stage `#0B1220`
- Soft White `#F5F7FA`
- Font: Inter (Regular, Medium, Semibold)

## Integration and upstream compatibility

1. Extract the asset ZIP to the repository root, retaining `branding/fullstage/`.
2. Run `node scripts/branding/apply-fullstage.cjs` to stage approved PNG, ICO and ICNS binaries into `public/` for packaging.
3. Build with `VITE_FULLSTAGE_UI=true npm run build`, then `npm run pack` (or create the OS installer).
4. Confirm the application title and launcher say FullStage, About credits FreeShow, and the upstream FreeShow update prompt does not appear.
5. Do not push auto-generated icons over FreeShow's upstream source artwork except as an intentional build-time copy.

**Status:** branding configuration is committed in `feature/fullstage-branding-v1`. Binary source files must be committed to the branch from the provided Git-ready ZIP before the brand build can be qualified. Do not merge or publish an alpha without this step.
