#!/usr/bin/env sh

set -e

echo '=== Running Lint ==='
npm run lint

echo '=== Running Build ==='
npm run build

echo '=== All tests passed ==='
