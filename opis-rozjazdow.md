# Opis zasianych rozjazdów — co, gdzie i czego oczekiwać

Zrzut `zrodlo/zrzut-alfa.json` jest CELOWO rozjechany z kanonem `kanon/tokeny.dtcg.json`.
Każdy typ rozjazdu wykrywalny przez skan wartości ma tu dokładnie jeden wyzwalacz.
Bramka `bramki/rozjazd.json` zatrzymuje przebieg (kod wyjścia 1), bo znaleziska kategorii
REAL o severity ≥ P2 istnieją — **to jest oczekiwany wynik demonstracji**.

| # | Typ rozjazdu | Zasianie | Oczekiwane znalezisko |
|---|---|---|---|
| 1 | `value-mismatch` | źródło `rdzen/color/podstawowy` = `#1d4ed9`, kanon `#1d4ed8` | P2 REAL |
| 2 | `type-mismatch` | źródło `rdzen/rozmiar/odstep` typu COLOR, kanon dimension | P2 REAL |
| 3 | `alias-broken` | źródło `rdzen/semantic/tlo` aliasuje nieistniejącą zmienną | P2 REAL |
| 4 | `mode-incomplete` (REAL) | `rdzen/color/tekst` — tryb Ciemny pusty | P2 REAL, powód `empty-mode` |
| 5 | `mode-incomplete` (ASSUMPTION) | `rdzen/color/tekst` — tryb Okolicznosciowy z zaślepką `#000000` | P2 ASSUMPTION, powód `placeholder-value` |
| 6 | `deprecated-still-used` | kanon `rdzen.color.przestarzaly` ma status deprecated, źródło wciąż go niesie | P2 REAL, wskazówka „Zastąp przez rdzen.color.podstawowy" |
| 7 | `metadata-drift` | opis źródła `rdzen/color/tekst` różny od `$description` kanonu | P2 REAL, `description-mismatch` |
| 8 | `missing-in-figma` | kanon `rdzen.color.zrodlowy` ma provenance=figma, w źródle go nie ma | **P1** REAL |
| 9 | `missing-in-canonical` (REAL) | źródło `rdzen/color/nowy` — brak w kanonie | P2 REAL |
| 10 | `missing-in-canonical` (ARCHITECTURAL) | źródło `rdzen/wewnetrzne/uklad` — prefiks modelowany tylko w kodzie | P2 ARCHITECTURAL |
| 11 | `hardcoded-anti-pattern` | `rdzen/semantic/akcja` w kolekcji Semantyka z wartością surową zamiast aliasu | P2 REAL |
| 12 | `naming-mismatch` | źródło `rdzen.color.obwudka` (literówka, kropki) ↔ kanon `rdzen.color.obwodka` | P2 REAL |
| 13 | `layer-mismatch` | kanon `rdzen.komponent.przycisk-tlo`: deklaracja component, alias wprost do prymitywu (wyprowadzenie semantic) — rozjazd liczony z samego kanonu | **P1** REAL, `component-skips-role` |

Razem: **13 znalezisk = 11 REAL · 1 ARCHITECTURAL · 1 ASSUMPTION** — dokładnie 13
ponumerowanych wierszy tabeli wyżej; ta sama lista, wpis po wpisie, w polu `expected`
pliku `zrodlo/zrzut-alfa.json` (licząc słowa w tym dokumencie, trafisz też na nazwy
kategorii w opisach — wiążąca jest numeracja). Typ `missing-in-code`
wymaga artefaktu buildu (konfiguracja `buildArtifactPaths`) i nie jest zasiany w zrzucie —
to jawna granica zestawu, nie przeoczenie.

Uwagi techniczne:

- Wartości zaślepek (`placeholderValues`) podaje się w formie znormalizowanej porównania
  (`"\"#000000\""` dla tekstu) — tak definiuje je silnik skanu.
- Metadane kanonu żyją w `$extensions` jako PŁASKIE klucze pod przestrzenią instalacji
  (`com.example.provenance`), zgodnie z jedną warstwą metadanych platformy.

## Pokrycie (bramki/pokrycie.json)

`zrodlo/pokrycie.json` zasiewa pięć definicji komponentów: `przycisk` (tokenized),
`karta` (partial), `baner` (untokenized), `przycisk-legacy` (odcięty heurystyką nazwy
LEGACY — brama G1), `ikona` (tokenized; poddrzewo zagnieżdżonej instancji wyłączone
z liczenia). Oczekiwany raport: brama G1, 2 tokenized · 1 partial · 2 untokenized,
occurrence 6/10 (60%), bramka z progiem 50% DOTRZYMANA — kod wyjścia 0.

## Profile marek pod trzy miary

- **Marka Alfa** — rdzeń (marka bazowa, punkt odniesienia miar).
- **Marka Beta** — wierna: dziedziczy cały rdzeń bez nadpisań → pokrycie 100, wierność 100,
  dodatki 0.
- **Marka Gamma** — nadpisanie motywem `rdzen.color.podstawowy` → **odstępstwo** (wierność
  < 100, znalezisko REAL w kolejce decyzji) oraz dwa tokeny własne `gamma.wlasne.*` →
  **dodatki** (kolejka promocji, kandydat a nie błąd).

Trzy miary mają dzięki temu co rozróżniać; routing trzech rodzajów rozjazdu (luka →
backlog migracji, odstępstwo → znalezisko, dodatek → promocja) widać w platformie po
zasiewie tego samego zbioru.
