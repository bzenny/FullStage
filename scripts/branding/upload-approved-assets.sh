#!/usr/bin/env bash
set -euo pipefail
ZIP="${1:-${HOME}/Downloads/FullStage_Branding_v1_WarningReady.zip}"
BRANCH="feature/fullstage-branding-v1"
if [[ ! -f "$ZIP" ]]; then
  echo "Brand ZIP not found: $ZIP" >&2
  echo "Usage: bash scripts/branding/upload-approved-assets.sh /path/to/FullStage_Branding_v1_WarningReady.zip" >&2
  exit 2
fi
git rev-parse --is-inside-work-tree >/dev/null
git fetch origin "$BRANCH"
if [[ "$(git branch --show-current)" != "$BRANCH" ]]; then
  echo "Switch to $BRANCH before uploading approved brand assets." >&2
  exit 2
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit or stash unrelated changes first." >&2
  exit 2
fi
git pull --ff-only origin "$BRANCH"
# Extract only the approved branding tree, never arbitrary paths from the package.
unzip -oq "$ZIP" 'branding/fullstage/*'
test -f branding/fullstage/icons/fullstage-icon-full-color.png
test -f branding/fullstage/platform/windows/fullstage.ico
test -f branding/fullstage/platform/macos/fullstage.icns
git add branding/fullstage/
if git diff --cached --quiet; then
  echo "Approved branding files are already committed."
  exit 0
fi
git commit -m "assets: commit approved FullStage logo and platform icons"
git push origin "$BRANCH"
echo "Approved branding assets committed and pushed to $BRANCH"
