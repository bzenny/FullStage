# FullStage PR #6 integration verification (2026-10-20)

## Included in this branch
- `src/frontend/FullStageNative.svelte` embedded through `MainLayout.svelte` behind `VITE_FULLSTAGE_UI=true`, preserving the upstream `Show.svelte` fallback.
- `FullStageStudio.svelte`: scene preset names, styles, overlays and output bindings in FreeShow native scene store.
- `FullStageCanvas.svelte`: drag-to-position freeform text/rectangle layers, reorder and property inspector, preview-only fade/slide animation. Versioned data saved in `scene.fullstageComposition` (an experimental extension that upstream FreeShow's compositor **does not render**).
- `FullStageMediaLibrary.svelte`: browses existing native media, stores supplemental metadata and playlist identifiers in renderer `localStorage`, links Openverse and captures creator/license URLs. **Not** a native import pipeline, license validator, thumbnail service or media transcoder.

## Confirmed previous CI blockers
- GitHub runner `windows-latest`: `node-gyp` could not discover Visual Studio C++ compiler, so changed to `windows-2022`.
- GitHub runner `ubuntu-latest`: native `osr-capture` linker failure, so testing pinned `ubuntu-22.04`.
- macOS: Svelte checker blocked build on upstream errors (original FreeShow 1.6.6 baseline had 186 checker errors). Compile and checker now run independently to reveal separate failures; both must pass to mark CI green.

## Blocking tasks before alpha
1. Run three-platform CI for latest feature branch commit, classify actual TypeScript/Svelte errors in new FullStage components, patch and rerun.
2. Implement a compositor adapter for `fullstageComposition`, with preview/live isolation, safety/lock checks and output selection. Rendering metadata only is **not** live-compositing support.
3. Replace renderer `localStorage` metadata with FreeShow's durable file-backed IPC storage; copy/import media safely with thumbnail previews, playback and missing-media fallback.
4. Implement Openverse API discovery with network permissions, attribution and license provenance—not merely opening external site links.
5. Test physical audience, stage, OBS and NDI outputs with an end-to-end service workflow.
6. Establish signing/packaging and licenses before publishing Windows/macOS/Linux installers.

Never merge this PR or publish a production-ready claim solely on the basis of foundation checks. See `docs/RELEASE_READINESS.md` on main for detailed acceptance gates.
