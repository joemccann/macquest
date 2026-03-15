#!/bin/bash
set -euo pipefail

# Quick syntax check — fail fast on source file errors (skip test files)
SRC_ERRORS=$(npx tsc --noEmit --pretty false 2>&1 | grep -v "tests/" | grep "error TS" | head -5 || true)
if [ -n "$SRC_ERRORS" ]; then
  echo "$SRC_ERRORS"
  exit 1
fi

# Build and capture output
BUILD_OUTPUT=$(npx next build 2>&1)

# Extract First Load JS for the main page (/)
# Format: "○ /                                    54.3 kB         156 kB"
FIRST_LOAD_KB=$(echo "$BUILD_OUTPUT" | grep -E '○\s+/' | head -1 | awk '{for(i=1;i<=NF;i++) if($i=="kB" && $(i-1) ~ /^[0-9.]+$/) last=$(i-1); print last}')

# Extract page-specific JS size
PAGE_KB=$(echo "$BUILD_OUTPUT" | grep -E '○\s+/' | head -1 | awk '{for(i=1;i<=NF;i++) if($i=="kB") {first=$(i-1); break}} END{print first}')

# Extract shared JS size
SHARED_KB=$(echo "$BUILD_OUTPUT" | grep "First Load JS shared" | awk '{for(i=1;i<=NF;i++) if($i=="kB") {print $(i-1); break}}')

# Get gzipped sizes of key chunks
CHUNKS_DIR=".next/static/chunks"
APP_CHUNK=$(find "$CHUNKS_DIR/app" -maxdepth 1 -name "page-*.js" 2>/dev/null | head -1)
APP_CHUNK_RAW_KB=0
APP_CHUNK_GZ_KB=0
if [ -n "$APP_CHUNK" ]; then
  APP_CHUNK_RAW_KB=$(echo "scale=1; $(wc -c < "$APP_CHUNK") / 1024" | bc)
  APP_CHUNK_GZ_KB=$(echo "scale=1; $(gzip -c "$APP_CHUNK" | wc -c) / 1024" | bc)
fi

# Total JS across all chunks (raw)
TOTAL_JS_RAW_KB=$(echo "scale=1; $(find "$CHUNKS_DIR" -name "*.js" -exec cat {} + | wc -c) / 1024" | bc)
TOTAL_JS_GZ_KB=$(echo "scale=1; $(find "$CHUNKS_DIR" -name "*.js" -exec cat {} + | gzip | wc -c) / 1024" | bc)

# CSS size
CSS_DIR=".next/static/css"
TOTAL_CSS_RAW_KB=0
TOTAL_CSS_GZ_KB=0
if [ -d "$CSS_DIR" ]; then
  TOTAL_CSS_RAW_KB=$(echo "scale=1; $(find "$CSS_DIR" -name "*.css" -exec cat {} + | wc -c) / 1024" | bc)
  TOTAL_CSS_GZ_KB=$(echo "scale=1; $(find "$CSS_DIR" -name "*.css" -exec cat {} + | gzip | wc -c) / 1024" | bc)
fi

echo "METRIC first_load_kb=$FIRST_LOAD_KB"
echo "METRIC page_kb=$PAGE_KB"
echo "METRIC shared_kb=$SHARED_KB"
echo "METRIC app_chunk_raw_kb=$APP_CHUNK_RAW_KB"
echo "METRIC app_chunk_gz_kb=$APP_CHUNK_GZ_KB"
echo "METRIC total_js_raw_kb=$TOTAL_JS_RAW_KB"
echo "METRIC total_js_gz_kb=$TOTAL_JS_GZ_KB"
echo "METRIC total_css_raw_kb=$TOTAL_CSS_RAW_KB"
echo "METRIC total_css_gz_kb=$TOTAL_CSS_GZ_KB"

# Print the full build output for reference
echo ""
echo "=== BUILD OUTPUT ==="
echo "$BUILD_OUTPUT" | grep -A 20 "Route (app)"
