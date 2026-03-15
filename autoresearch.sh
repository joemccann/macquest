#!/bin/bash
set -euo pipefail

URL="https://macquest.app"

# Warm the CDN cache (hit multiple edge resources)
curl -s -o /dev/null "$URL"
curl -s -o /dev/null "$URL/_next/static/css/$(curl -s "$URL" | grep -o '[a-f0-9]*\.css' | head -1)" 2>/dev/null || true
sleep 3

# Run Lighthouse and save JSON to temp file
TMPJSON=$(mktemp /tmp/lighthouse-XXXXXX.json)
trap "rm -f $TMPJSON" EXIT

npx lighthouse "$URL" \
  --output=json \
  --output-path="$TMPJSON" \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo \
  2>/dev/null

# Extract metrics from JSON
python3 - "$TMPJSON" <<'PYEOF'
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)

cats = data.get('categories', {})
audits = data.get('audits', {})

perf = int(cats.get('performance', {}).get('score', 0) * 100)
a11y = int(cats.get('accessibility', {}).get('score', 0) * 100)
bp = int(cats.get('best-practices', {}).get('score', 0) * 100)
seo = int(cats.get('seo', {}).get('score', 0) * 100)

fcp = audits.get('first-contentful-paint', {}).get('numericValue', 0)
lcp = audits.get('largest-contentful-paint', {}).get('numericValue', 0)
tbt = audits.get('total-blocking-time', {}).get('numericValue', 0)
cls = audits.get('cumulative-layout-shift', {}).get('numericValue', 0)
si = audits.get('speed-index', {}).get('numericValue', 0)

print(f'METRIC lighthouse_perf={perf}')
print(f'METRIC lcp_ms={lcp:.0f}')
print(f'METRIC speed_index_ms={si:.0f}')
print(f'METRIC tbt_ms={tbt:.0f}')
print(f'METRIC cls={cls:.4f}')
print(f'METRIC fcp_ms={fcp:.0f}')
print(f'METRIC a11y={a11y}')
print(f'METRIC seo={seo}')
print(f'METRIC best_practices={bp}')
PYEOF
