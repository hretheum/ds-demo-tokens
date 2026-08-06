# Zasiane rozjazdy — opis i oś czasu

Zrzut źródła projektowego jest celowo rozjechany z kanonem zestawu. Rozjazd narasta
przez sześć miesięcy (`zrodlo/stany/2026-03` … `2026-08`); stan ostatniego miesiąca to
`zrodlo/zrzut-alfa.json`, na którym działa bramka `drift-gate`. Wynik na stanie
bieżącym: **44 znaleziska** (36 REAL · 4 ARCHITECTURAL · 4 ASSUMPTION;
1 P0 · 6 P1 · 34 P2 · 3 P3). Pełna lista z numeracją w polu `expected` pliku
`zrodlo/zrzut-alfa.json` — poniżej opis znaczeniowy.

Przebieg miesięczny (bramka na kolejnych stanach): **6 → 10 → 17 → 27 → 39 → 44**.

## Miesiąc 2026-03 — dług istniejący od startu (6)

- **layer-mismatch ×3 (P1)** — trzy tokeny komponentowe (`przycisk-tlo`,
  `pole-obwodka`, `znacznik-tlo`) deklarują warstwę komponentową, ale aliasują wprost
  prymityw, omijając warstwę roli (`component-skips-role`). To rozjazd wewnętrzny
  kanonu — widoczny w każdym skanie, niezależnie od źródła.
- **deprecated-still-used ×3 (P3)** — źródło od początku używa trzech wycofanych
  tokenów (`sygnalowy-stary`, `akcent-stary`, `odstep-stary`); każdy ma następcę
  wskazanego w `replaced-by`.

## Miesiąc 2026-04 — pierwsze przemalowania (+4)

- **value-mismatch ×3 (P2)** — projektant przemalował `blekit-500` i `zielen-600`
  oraz zmienił `odstep-300` na 26 px (kanon: 24 px) bez zmiany kanonu.
- **metadata-drift ×1 (P2)** — opis `blekit-900` w źródle rozjechany z kanonem.

## Miesiąc 2026-05 — tryb ciemny zaniedbany, znikają tokeny źródłowe (+7)

- **mode-incomplete ×4 (P2, REAL)** — dwa tokeny z pustym trybem Ciemnym
  (`empty-mode`), dwa z zaślepką `#000000` (`placeholder-value`).
- **missing-in-figma ×2 (P1)** — `zrodlowe.poswiata` i `zrodlowe.mgla` (pochodzenie:
  źródło projektowe) zniknęły ze źródła.
- **naming-mismatch ×1 (P2)** — literówka `rodzina-podstawowej` (kropki zamiast
  ukośników uniemożliwiają mapowanie; heurystyka odległości edycyjnej wskazuje kanon).

## Miesiąc 2026-06 — dostawa z zewnątrz (+10)

- **value-mismatch ×4** — w tym **P0**: semantyczny kolor głównej akcji
  (`semantic.akcja-podstawowa`) zaszyty na sztywno INNĄ wartością niż kanon.
  Reguła severity podnosi każdy rozjazd wartości na ścieżce `rdzen.semantic.` do P0.
- **hardcoded-anti-pattern ×3 (P2)** — zmienne semantyczne z wartością surową zamiast
  aliasu; dwie mają wartość równą rozwiązanej (antywzorzec bez rozjazdu wartości),
  jedna to P0 powyżej.
- **missing-in-canonical ×3 (P2)** — dostawa dodała `color.neon`,
  `color.akcent-sezonowy` i semantyczne `tlo-reklamowe` bez odpowiednika w kanonie.

## Miesiąc 2026-07 — typy się sypią, wewnętrzne wypływają (+12)

- **type-mismatch ×2 (P2)** — promień odtworzony jako kolor, grubość pisma jako tekst.
- **alias-broken ×2 (P2)** — aliasy do nieistniejących zmiennych (`blekit-650`,
  skala `lazur`).
- **value-mismatch ×2 (ARCHITECTURAL)** — progi przełamania odtworzone w źródle
  z innymi wartościami; prefiks `rdzen.wewnetrzne` jest modelowany wyłącznie w kodzie,
  więc kategoria to ARCHITECTURAL, nie REAL.
- **missing-in-canonical ×2 (ARCHITECTURAL)** — zmienne wymyślone w źródle w obszarze
  modelowanym wyłącznie w kodzie.
- **mode-incomplete ×4 (ASSUMPTION)** — tryb `Okolicznosciowy` (lista trybów-zaślepek
  w konfiguracji) założony i niedomknięty: założenie do rozstrzygnięcia, nie błąd.

## Miesiąc 2026-08 — stan bieżący (+5)

- **missing-in-figma ×1 (P1)** — trzeci token źródłowy (`zrodlowe.zorza`) zniknął.
- **missing-in-canonical ×1 (P2)** — `odstep-850` wymyślony poza skalą kanonu.
- **naming-mismatch ×1 (P2)** — druga literówka (`krycie.pollowa`).
- **metadata-drift ×1 (P2)** — opis `semantic.tekst-podstawowy` rozjechany.
- **value-mismatch ×1 (P2)** — warstwa nakładki 120 zamiast 100.

## Jawne granice zestawu

- Typ **missing-in-code** wymaga artefaktu buildu i nie jest zasiany.
- Trzy kategorie mają w zestawie po co najmniej jednym reprezentancie: REAL
  (do naprawy), ARCHITECTURAL (rozjazd modelowania, nie wartości), ASSUMPTION
  (założenie do domknięcia) — routing każdej jest inny i to jest teza produktu.
- Odchylenia marek od rdzenia (wierność) i dodatki własne NIE są częścią tego pliku —
  liczy je kalkulator trzech miar na kolekcjach lustrzanych marek (`marki/`).
