#!/bin/bash
set -euo pipefail

# Build check — must succeed (includes type checking for source files)
npx next build 2>&1 | tail -10
