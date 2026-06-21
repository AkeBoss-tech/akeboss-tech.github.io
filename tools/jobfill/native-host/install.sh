#!/usr/bin/env bash
# Registers the JobFill native messaging host for Chrome on macOS.
# Usage: ./install.sh <EXTENSION_ID>
# Find the extension id at chrome://extensions (enable Developer mode, load
# tools/jobfill/extension as an unpacked extension, copy its ID).
set -euo pipefail

EXT_ID="${1:?Pass the unpacked extension ID: ./install.sh <EXTENSION_ID>}"
DIR="$(cd "$(dirname "$0")" && pwd)"
HOST_NAME="com.akash.jobfill"

# A tiny launcher so Chrome gets an absolute, env-stable entrypoint.
# (Chrome's PATH is minimal; resolve node explicitly.)
NODE_BIN="$(command -v node)"
LAUNCHER="$DIR/jobfill-host-launcher.sh"
cat > "$LAUNCHER" <<EOF
#!/usr/bin/env bash
exec "$NODE_BIN" "$DIR/jobfill-host.mjs"
EOF
chmod +x "$LAUNCHER" "$DIR/jobfill-host.mjs"

# Chrome host manifest location on macOS:
TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
mkdir -p "$TARGET_DIR"
sed -e "s#REPLACE_WITH_ABSOLUTE_PATH/jobfill-host-launcher.sh#$LAUNCHER#" \
    -e "s#REPLACE_WITH_EXTENSION_ID#$EXT_ID#" \
    "$DIR/com.akash.jobfill.template.json" > "$TARGET_DIR/$HOST_NAME.json"

echo "Installed host manifest -> $TARGET_DIR/$HOST_NAME.json"
echo "Launcher -> $LAUNCHER"
echo "Restart Chrome, then use the side panel. (Linux path: ~/.config/google-chrome/NativeMessagingHosts/)"
