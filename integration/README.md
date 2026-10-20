# FullStage native integration (experimental)

This directory contains an **uncompiled candidate** opt-in Svelte panel whose relative imports are designed for installation at `src/frontend/FullStageNative.svelte` inside FreeShow 1.6.6. It **does not** represent a compiled desktop application. The current panel reuses native FreeShow actions but may require Svelte/TypeScript adjustments.

## Integrate in a cloned FreeShow source checkout

1. Confirm the upstream baseline builds.
2. Copy `integration/fullstage/FullStageNative.svelte` to `src/frontend/FullStageNative.svelte`.
3. In `src/frontend/MainLayout.svelte`, import `FullStageNative from "./FullStageNative.svelte"`.
4. Replace the existing `<Show />` branch (only when `page === "show"`) with a conditional controlled by `import.meta.env.VITE_FULLSTAGE_UI === "true"`. Keep `<Show />` as the fallback.
5. Run `npm run test:svelte`, `npm run build`, and native output testing before shipping.

This is a small native-connected operator scaffold, **not** the complete prior FullStage 0.5 visual scene/media studio. Integrate those local packages independently after FreeShow's persistence and renderer adapters are implemented.

Do not remove FreeShow attribution or license. Preview selection must remain isolated from live state until TAKE.
