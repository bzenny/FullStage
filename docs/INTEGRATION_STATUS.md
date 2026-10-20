# FullStage consolidation status

## Verified 2026-10-20
- GitHub project contains governance/workflows and `integration/fullstage/FullStageNative.svelte` as an **uncompiled candidate**.
- First FreeShow 1.6.6 Windows baseline failed at npm install due to Windows runner Visual Studio discovery.
- Second baseline successfully installed dependencies and ran unit tests, but failed `npm run test:svelte` with **186 upstream errors, 60 warnings and 238 hints**. The production build was consequently skipped.
- Independent FullStage 0.5 local prototype exists separately, including scene/media studio and local tests.

## Not yet verified
- Single upstream-derived working desktop application
- Fully imported FullStage 0.5 source in the GitHub repository
- Buildable integrated Svelte UI and compositor adapter
- Working Windows installers or hardware-based projection testing

## Integration method
1. On `integration/freeshow-v1.6.6` import FreeShow source with ancestry retained (dedicated `import-upstream.yml` manual workflow).
2. Import FullStage v0.5 source from saved engineering package, keeping the local tests and editable brand assets.
3. Patch `src/frontend/MainLayout.svelte` under `VITE_FULLSTAGE_UI` feature flag, preserve upstream `<Show />` fallback.
4. Evaluate and remediate FullStage-specific Svelte errors against independently tracked upstream baseline errors. Never treat upstream 186 errors as acceptable new defects.
5. Run native production build **independently of typecheck** for diagnosis, then restore all quality gates before producing an alpha.
6. Validate scenes, media persistence and output controls against FreeShow's real IPC, stores and renderer.

See [release readiness](RELEASE_READINESS.md) for acceptance criteria.
