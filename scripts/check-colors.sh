#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Hex scan…"
git grep -nE '#[0-9a-fA-F]{3,6}\b' -- '*.ts' '*.tsx' '*.css' '*.scss' '*.html' '*.mdx' || true | (! grep .)

echo "🔍 Fixed palette scan…"
git grep -nE '\b(bg|text|border)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}\b' -- '*.ts' '*.tsx' '*.css' '*.scss' '*.html' '*.mdx' || true | (! grep .)

echo "✅ Clean."