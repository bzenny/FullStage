# FullStage development roadmap

## Gate 0 — Repository foundation
- [x] Public repository established
- [x] Project status and upstream attribution documented
- [ ] FullStage 0.5 starter source imported
- [ ] Choose and review final license terms

## Gate 1 — FreeShow baseline
- [ ] Fetch official FreeShow v1.6.6 tag and record immutable commit SHA
- [ ] Build baseline unmodified on Windows, macOS and Linux
- [ ] Run upstream test suite
- [ ] Inventory assets, native modules and dependency licenses

## Gate 2 — Native operator integration
- [ ] Opt-in FullStage workspace compiles in upstream app
- [ ] Preview/take/clear/restore use native stores and functions
- [ ] Blackout is distinct from clear all and tested on displays
- [ ] Operator regression suite prevents live/preview leakage

## Gate 3 — Scenes, media and outputs
- [ ] Persist scene-composition schema with upgrade path
- [ ] Render layered scene edits through real output compositor
- [ ] Persistent media catalog, thumbnails, playlists, video previews
- [ ] License/provenance metadata for externally discovered media
- [ ] Independent output configurations and stage display layouts

## Gate 4 — Release qualification
- [ ] Automated builds for three desktop platforms
- [ ] Hardware validation: audience, confidence, OBS and NDI
- [ ] Service-long endurance and recovery tests
- [ ] Accessible operator usability checks
- [ ] GPL notices and third-party media licenses verified
- [ ] Signed or clearly marked unsigned alpha assets
