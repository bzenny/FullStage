# Architecture and upstream implementation map

Pinned research target: `ChurchApps/FreeShow` tag `v1.6.6`.

| Upstream path | Ownership | FullStage plan |
| --- | --- | --- |
| `src/frontend/App.svelte` | Startup/root UI | Preserve |
| `src/frontend/MainLayout.svelte` | Operator layout | Opt-in FullStage workspace |
| `src/frontend/MainOutput.svelte` | Output window | Preserve pending compositor tests |
| `src/frontend/stores.ts` | Global Svelte stores | Reuse native state and persistence |
| `src/frontend/components/show/Show.svelte` | Existing show workspace | Retain as fallback |
| `src/frontend/components/output/preview/Preview.svelte` | Live preview actions | Reuse playback semantics |
| `src/frontend/components/helpers/showActions.ts` | Slide actions | `updateOut` |
| `src/frontend/components/helpers/output.ts` | Output, scenes | `setOutput`, `startScene`, `toggleOutput` |
| `src/frontend/components/output/clear.ts` | Clearing | `clearSlide`, `clearAll`, `restoreOutput` |
| `src/frontend/components/stage/StageLayouts.svelte` | Stage-layout management | Preserve and extend |
| `src/frontend/components/output/Output.svelte` | Visual compositor | Introduce new layer adapter only after tests |
| `src/electron/index.ts` | Electron runtime | Preserve |
| `src/types/Output.ts`, `src/types/Show.ts` | Data types | Map profiles and scene schema, migration reviewed |

## Data-contract warning

FreeShow `Scene.content` provides media, style, overlays and hidden overlays; it does **not** inherently encode the FullStage prototype's arbitrary draggable layers. An explicit versioned composition schema and rendering adapter are required.

## Safety invariant

Preview edits cannot affect audience outputs before an explicit TAKE command. When upstream output lock is enabled, operator actions should be prevented. Clearing slide/background and true video blackout are distinct operations.

## Delivery status

This is a reviewed file-level integration **plan**, not a claim that the adapter has been compiled or tested on hardware.
