#!/bin/sh
# JEDNA komenda demonstracji: raport rozjazdu kanon × zrzut źródła na własnym terminalu.
# Wymaga platformy obok (domyślnie ../ds-platform; nadpisz zmienną DS_PLATFORM_DIR).
# Działa bez bazy danych i bez dostępu do sieci. Kod wyjścia 1 = bramka zatrzymuje
# (zasiane rozjazdy istnieją — to oczekiwany wynik demonstracji).
set -eu
TU="$(cd "$(dirname "$0")" && pwd)"
PLATFORMA="${DS_PLATFORM_DIR:-$TU/../ds-platform}"
if [ ! -d "$PLATFORMA/apps/server" ]; then
  echo "Nie znaleziono platformy w $PLATFORMA — sklonuj ds-platform obok albo ustaw DS_PLATFORM_DIR" >&2
  exit 2
fi
exec pnpm --dir "$PLATFORMA/apps/server" exec tsx src/cli.ts drift-gate "$TU/bramki/rozjazd.json"
