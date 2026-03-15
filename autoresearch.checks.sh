#!/bin/bash
set -euo pipefail

# Run tests — only show failures
npm run test 2>&1 | grep -E "(FAIL|Error|✗|failed)" | tail -50 || true

# Typecheck
npx tsc --noEmit 2>&1 | grep -i error | tail -20 || true
