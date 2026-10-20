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
