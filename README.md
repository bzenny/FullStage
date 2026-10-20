# FullStage — Open Presenter Software

**Every Screen. Every Moment.**

FullStage is an open-source, offline-first worship and live presentation project aiming to combine the simplicity of OpenLP and FreeShow with professional stage, media, and multi-output production workflows.

## Project status

**Pre-alpha repository foundation.** FullStage's independent scene/media prototype and source-level adapters have been developed separately. They have **not** yet been compiled or validated as a complete FreeShow-based desktop application. No installers are published.

## Architecture direction

- **Upstream foundation:** [ChurchApps/FreeShow](https://github.com/ChurchApps/FreeShow), pinned initially to **v1.6.6**.
- **Desktop stack:** Electron, Svelte, TypeScript; preserve FreeShow's existing render and storage paths unless testing justifies a change.
- **Primary features:** song and Scripture projection; configurable scene layers; local media library; stage displays; audience/broadcast/lobby output profiles; operator preview/live safety; OBS integrations.
- **Creative libraries:** licensed and attributed media discovery, with local/offline operation as the default.
- **Development principle:** preserve upstream attribution and implement new capabilities behind opt-in flags, with reproducible tests.

## Roadmap

1. Import verified upstream v1.6.6 source, retain provenance, compile unmodified baseline.
2. Integrate FullStage brand and opt-in Svelte workspace with native state adapters.
3. Connect scene composer and media library to persistent application stores and renderer.
4. Validate audience, stage, and broadcast outputs on Windows/macOS/Linux.
5. Publish alpha builds **only after** end-to-end integration and licensing checks.

See [Development roadmap](docs/ROADMAP.md), [Architecture and source mapping](docs/ARCHITECTURE.md), and [Contributing](CONTRIBUTING.md).

## Existing local engineering package

The FullStage 0.5 studio and source files were prepared prior to this repository's creation. Their **Git history and tested provenance must be preserved when importing them**. Until imported, this GitHub repository represents the governance and integration starting point, not the finished application.

## License and attribution

FullStage is intended to be distributed under GPL-3.0-compatible terms. FreeShow is GPL-3.0, copyright its respective contributors. Do not copy upstream sources without retaining its license and attribution. Media, translations, photos, videos, and other third-party assets require independent license checks.
