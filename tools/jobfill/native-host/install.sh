#!/usr/bin/env bash
# Installs the JobFill native host for Chrome (macOS).
# Usage: ./install.sh <EXTENSION_ID>
#
# The runtime is installed to ~/.jobfill (NOT the repo): macOS TCC blocks
# Chrome's hardened runtime from executing scripts inside ~/Documents, so the
# launcher + host + your data must live in an unprotected location.
set -euo pipefail

EXT_ID="${1:?Pass the unpacked extension ID: ./install.sh <EXTENSION_ID>}"
SRC="$(cd "$(dirname "$0")" && pwd)"          # repo .../native-host
REPO="$(cd "$SRC/../../.." && pwd)"
RT="$HOME/.jobfill"                            # runtime dir (unprotected)
HOST_NAME="com.akash.jobfill"

NODE_BIN="$(command -v node || true)";   [ -z "$NODE_BIN" ] && { echo "ERROR: node not on PATH"; exit 1; }
CLAUDE_BIN="$(command -v claude || true)"
CODEX_BIN="$(command -v codex || true)"

mkdir -p "$RT"
cp "$SRC/jobfill-host.mjs" "$RT/jobfill-host.mjs"
# Copy data the agent needs (so the host never reads from ~/Documents).
[ -f "$SRC/../profile.json" ] && cp "$SRC/../profile.json" "$RT/profile.json" || echo "note: profile.json missing"
[ -f "$SRC/../about.md" ]     && cp "$SRC/../about.md"     "$RT/about.md"     || true
if   [ -f "$REPO/career/cv.md" ];      then cp "$REPO/career/cv.md"      "$RT/resume.md"
elif [ -f "$REPO/files/resume.tex" ];  then cp "$REPO/files/resume.tex"  "$RT/resume.md"; fi

# Launcher: absolute interpreter + absolute node (Chrome spawns with minimal PATH).
LAUNCHER="$RT/jobfill-host-launcher.sh"
cat > "$LAUNCHER" <<EOF
#!/bin/bash
export PATH="$(dirname "$NODE_BIN"):${CLAUDE_BIN:+$(dirname "$CLAUDE_BIN"):}/usr/local/bin:/usr/bin:/bin:\$HOME/.local/bin"
export JOBFILL_CLAUDE_BIN="${CLAUDE_BIN:-claude}"
export JOBFILL_CODEX_BIN="${CODEX_BIN:-codex}"
exec "$NODE_BIN" "$RT/jobfill-host.mjs"
EOF
chmod +x "$LAUNCHER" "$RT/jobfill-host.mjs"

# Chrome host manifest -> points at the ~/.jobfill launcher.
TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
mkdir -p "$TARGET_DIR"
cat > "$TARGET_DIR/$HOST_NAME.json" <<EOF
{
  "name": "$HOST_NAME",
  "description": "JobFill native host",
  "path": "$LAUNCHER",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://$EXT_ID/"]
}
EOF

echo "Runtime:  $RT"
echo "Launcher: $LAUNCHER"
echo "Manifest: $TARGET_DIR/$HOST_NAME.json"
echo "node=$NODE_BIN  claude=${CLAUDE_BIN:-MISSING}  codex=${CODEX_BIN:-MISSING}"
echo "Done. Restart Chrome, then use the side panel."
echo "Re-run this whenever profile.json / about.md / your resume change (it re-copies them)."
