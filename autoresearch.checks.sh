#!/bin/bash
set -euo pipefail

# Type check
npx tsc --noEmit 2>&1 | grep -i error || true

# Build check
pnpm build 2>&1 | tail -20
