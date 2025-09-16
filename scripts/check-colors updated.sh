#!/usr/bin/env bash
set -euo pipefail

BASE=${BASE_REF:-origin/main}
TARGET=${TARGET_REF:-HEAD}

echo "BASE=$BASE"
echo "TARGET=$TARGET"

CHANGED="$(git diff --name-only --diff-filter=AMR "$BASE" "$TARGET" -- 'src/**/*.{ts,tsx,css,scss}' || true)"
if [ -z "$CHANGED" ]; then
  echo "No changed files."
  exit 0
fi

echo "Changed files:"
echo "$CHANGED"

# Allow token/tailwind files by design (adjust as needed)
ALLOWLIST_REGEX='^(src/lib/design-tokens\.ts|tailwind\.config\.(js|ts)|src/styles/tokens\.css)$'

FAIL=0
while IFS= read -r f; do
  [ -f "$f" ] || continue
  [[ "$f" =~ $ALLOWLIST_REGEX ]] && { echo "⏭️  Skipping $f"; continue; }

  # HEX (supports 3/4/6/8-digit)
  if git grep -nE '#[0-9a-fA-F]{3,8}\b' -- "$f" >/dev/null; then
    echo "❌ HEX in $f"
    git grep -nE '#[0-9a-fA-F]{3,8}\b' -- "$f" || true
    FAIL=1
  fi

  # Tailwind fixed palettes (incl. gradients & SVG attrs)
  if git grep -nE '\b(bg|text|border|fill|stroke|from|to|via)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}\b' -- "$f" >/dev/null; then
    echo "❌ Fixed Tailwind palette in $f"
    git grep -nE '\b(bg|text|border|fill|stroke|from|to|via)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}\b' -- "$f" || true
    FAIL=1
  fi

  # Literal white in SVG attributes (fill/stroke)
  if git grep -nE '^[[:space:]]*<(svg|g|path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*(fill|stroke)=(["'\''])white\3' -- "$f" >/dev/null; then
    echo "❌ Literal white in SVG attributes in $f"
    git grep -nE '^[[:space:]]*<(svg|g|path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*(fill|stroke)=(["'\''])white\3' -- "$f" || true
    FAIL=1
  fi
done <<< "$CHANGED"

[ $FAIL -eq 0 ] && echo "✅ No new color violations" || exit 1
