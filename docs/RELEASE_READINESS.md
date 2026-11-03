# FullStage Release Readiness — measurable gates
Updated 2026-10-20. **STATUS: BLOCKED — pre-alpha.** Do not publish production claims or label source-only tests as desktop qualification.

## 0. Source integration and legal provenance (required)
- [ ] Full FreeShow v1.6.6 source merged onto reviewed integration branch with original Git ancestry preserved
- [ ] Root LICENSE and upstream notices present; GPL derivative and third-party asset review complete
- [ ] FullStage 0.5 studio, state engine, tests, branding and native adapter imported with source provenance
- [ ] No credentials or redistributable-restricted song/media/Bible assets committed
- [ ] Fresh clone with documented commands reliably installs dependencies

## 1. Build and automated quality (required for alpha)
- [ ] Windows, macOS and Linux CI build jobs actually compile the integrated application, not skip
- [ ] Typecheck has 0 new FullStage errors; upstream baseline error list independently captured
- [ ] Unit, integration and desktop smoke tests pass; test report and build logs linked to commit
- [ ] Electron installer launches on an otherwise clean supported machine
- [ ] Update/uninstall/upgrade preserve show library and settings, with rollback tested

## 2. Volunteer usability (required)
- [ ] First-run: discover screen, load sample service, preview, TAKE, clear and restore without documentation
- [ ] At least five volunteer operators complete service workflow; 4/5 without facilitator correction
- [ ] Hotkeys, focus indicators, accessible labels and contrast checked
- [ ] Operator always sees distinct Preview and Live status; clear/blackout are unmistakable
- [ ] Internet absent: songs, licensed Scripture, local media, scene state and presentation continue

## 3. Live reliability and screen outputs (required)
- [ ] Real projector audience output, independent confidence monitor and OBS/livestream output tested
- [ ] Multiple output profiles preserve unique layouts, names, resolutions and stage assignments across relaunch
- [ ] Output blackout, clear slide, clear media and restore independently exercised
- [ ] Preview edits never appear live before explicit TAKE
- [ ] 2-hour rehearsal with songs, Scripture, image/video, transitions and service order, no critical interruptions
- [ ] Disconnect/reconnect external screens and recover without invalid output routing

## 4. Scene designer (required for scene feature claim)
- [ ] Canvas layer drag, resize, reorder, hide, text/image editing and transitions persist through restart
- [ ] Versioned scene schema, migrations, and on-screen/physical rendering match exported project
- [ ] Independent scene bindings route to chosen outputs without crosstalk
- [ ] Preview scene does not switch real outputs; explicit activation required
- [ ] Undo/redo, asset missing fallback, safe live editing supported

## 5. Media manager (required for media feature claim)
- [ ] Imported assets survive app restart; thumbnail caches rebuild after deletion
- [ ] Folder organization, playlists, preview and missing-file resolution work
- [ ] Video seek, pause, audio control and transitions tested under normal loads
- [ ] All online Creative Commons results have original source, author, license URL, retrieval date and attribution
- [ ] Only authorized/licensed content can be cached or bundled; offline source fallback clear

## 6. Broadcast and advanced compatibility (beta gates)
- [ ] OBS browser source/key-fill transparency tested where supported
- [ ] NDI and other advanced I/O exercised on each advertised platform, with known limits published
- [ ] 1080p/4K/8-output claims explicitly bounded to hardware benchmark results
- [ ] Remote control requires local network authorization and protects from unintended live actions

## Release decision
- **Alpha:** sections 0–3 green, known gaps disclosed, unsigned build warning explicit.
- **Beta:** sections 0–5 green, key OBS and target hardware tests green.
- **Stable:** all advertised features qualified, regression, backups, recovery and user manuals complete.
- No release may pass a check because CI was skipped; link actual passing job and asset hash.

## FullStage v0.6.0-alpha.1 qualification snapshot (2026-11-03)

**Current verdict: NOT RELEASE-READY.** This snapshot does not override the gates above.

### Desktop validation
- Windows/macOS packaging previously passed on branding branch `9ccfaa680`, but new commit `b75237d71` must be retested.
- Linux packaging completed, but the operator smoke test failed because upstream onboarding intercepted real pointer clicks.
- `613ad494` suppresses only the onboarding rendering when **both** `VITE_FULLSTAGE_UI=true` and `VITE_FULLSTAGE_TEST=true` are compiled in; production onboarding stays intact.
- `b75237d71` asserts no onboarding overlay in smoke builds, and keeps actual Preview → TAKE LIVE → CLEAR SLIDE → CLEAR ALL → RESTORE clicks and output-store assertions.
- Any failure of Preview-before-TAKE isolation or restore behavior remains release-blocking; do **not** mark a pass by disabling assertions or forcing clicks.

### Branding and packaging
- Official Ribbon Spotlight F assets belong under `branding/fullstage/` on `feature/fullstage-branding-v1`.
- In a branded build, `scripts/branding/apply-fullstage.cjs` stages approved icons and wordmarks when present, and writes `public/fullstage-branding-status.json` warnings if absent; missing art must never crash startup.
- **Asset existence must still be verified from GitHub's branch tree**. Branding warnings permit engineering builds, but release qualification must record whether artwork actually shipped.
- Inspect installer identity, icon, splash, About attribution, and absence of upstream FreeShow update prompts on all three platforms. GitHub green checks alone are insufficient to prove visual appearance.

### Media persistence scope
- `src/frontend/FullStageMediaLibrary.svelte` persists entries and playlist metadata in `localStorage["fullstage-media-v1"]`; this is a limited alpha capability.
- The current smoke test checks a synthetic metadata entry surviving reload. It does **not** prove that native files are copied, indexed, seekable, playable, or survive restart.
- Do not label this as durable native media persistence. Before making that claim, test real file import via FreeShow's native import layer, process restart, missing-file recovery, thumbnail generation, and playlist playback. Publish the limitation in alpha notes.

### Required sign-off evidence
- [ ] CI for the exact candidate commit: Windows, macOS, Linux jobs all successful
- [ ] Smoke test: Preview untouched before TAKE, LIVE after TAKE, CLEAR/RESTORE transitions proven from real output stores
- [ ] Branding manifests and binaries present in GitHub branch, plus verified package icons and no upstream updater
- [ ] Media metadata survives renderer reload; native-media limitations explicitly disclosed
- [ ] Linux AppImage/deb and Windows/macOS artifacts launched on target systems
- [ ] Release artifacts, hashes, and provenance listed alongside `v0.6.0-alpha.1`
