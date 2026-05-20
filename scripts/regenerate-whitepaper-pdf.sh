#!/usr/bin/env bash
# Regenerates docs/whitepaper.pdf from the live web design.
#
# Prereqs:
#   - Dev server running on localhost:3001 (`npm run dev`)
#   - Google Chrome installed at the standard macOS path
#
# Usage:   bash scripts/regenerate-whitepaper-pdf.sh
# Notes:
#   - Renders /whitepaper?print=true (server-side strips nav + floating widgets)
#   - Paper size 9.375"×12.135" matches the web design's 900×1165px @ 96dpi
#   - Each <Page> block in WhitepaperView gets page-break-after via print CSS
#   - Sections whose content overflows 1165px will span two PDF pages
#     (e.g. Section 01 today); that's intended.

set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="http://localhost:3001/whitepaper?print=true"
OUTPUT="docs/whitepaper.pdf"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at $CHROME. Install Google Chrome and retry." >&2
  exit 1
fi

if ! curl -fsS -o /dev/null "$URL"; then
  echo "Dev server not responding at $URL. Run 'npm run dev' first." >&2
  exit 1
fi

TMP=$(mktemp -t whitepaper.XXXXXX.pdf)
trap 'rm -f "$TMP"' EXIT

echo "Rendering $URL → $TMP …"
"$CHROME" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf-no-header \
  --print-to-pdf="$TMP" \
  "$URL" 2>&1 | grep -E "bytes written|error" || true

if [ ! -s "$TMP" ]; then
  echo "Render produced an empty file. Check Chrome output above." >&2
  exit 1
fi

mv "$TMP" "$OUTPUT"
echo "Wrote $OUTPUT ($(wc -c < "$OUTPUT" | tr -d ' ') bytes)"

if command -v pdfinfo >/dev/null 2>&1; then
  echo "---"
  pdfinfo "$OUTPUT" | grep -E "Pages|Page size"
fi

echo
echo "Done. Commit + deploy when ready."
