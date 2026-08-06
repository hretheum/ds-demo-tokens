#!/bin/sh
# Druga bramka odczytowa: pomiar pokrycia komponentów (G0/G1/G2) z kodem wyjścia.
set -eu
TU="$(cd "$(dirname "$0")" && pwd)"
PLATFORMA="${DS_PLATFORM_DIR:-$TU/../ds-platform}"
if [ ! -d "$PLATFORMA/apps/server" ]; then
  echo "Nie znaleziono platformy w $PLATFORMA — sklonuj ds-platform obok albo ustaw DS_PLATFORM_DIR" >&2
  exit 2
fi
exec pnpm --dir "$PLATFORMA/apps/server" exec tsx src/cli.ts coverage-gate "$TU/bramki/pokrycie.json"
