# Zestaw demonstracyjny — jeden rdzeń, trzy marki, sześć miesięcy pomiaru

Publiczny zestaw tokenów DTCG dla self-hostowanej platformy design systemu.
Pełna piramida tokenów, trzy marki na jednym rdzeniu, **narastający przez sześć
miesięcy zasiany rozjazd** i historia adopcji, którą platforma liczy własnymi
silnikami — żeby pierwsze spojrzenie na instancję dawało werdykt, a raport rozjazdu
dało się obejrzeć na własnym terminalu w minutę.

## Jedna komenda

```sh
git clone <to-repozytorium> && cd ds-demo-tokens && ./raport-rozjazdu.sh
```

Wymaganie: sklonowana platforma obok (`../ds-platform`, nadpisywalne zmienną
`DS_PLATFORM_DIR`) z zainstalowanymi zależnościami. **Bez bazy danych, bez sieci,
bez konfiguracji środowiska.**

Zobaczysz **44 znaleziska** (36 REAL · 4 ARCHITECTURAL · 4 ASSUMPTION;
1 P0 · 6 P1 · 34 P2 · 3 P3) i kod wyjścia 1 — bramka zatrzymuje przebieg, bo rozjazd
istnieje. To jest oczekiwany wynik: każde znalezisko jest zasiane celowo i opisane
w [opis-rozjazdow.md](opis-rozjazdow.md).

Druga bramka — pomiar pokrycia komponentów:

```sh
./raport-pokrycia.sh   # brama G1, occurrence 89,8%, próg 50% dotrzymany → kod 0
```

## Skala zestawu

| Co | Ile |
|---|---|
| Tokeny kanonu | **249** (160 prymitywów · 49 semantycznych · 20 funkcjonalnych · 20 komponentowych) |
| Rdzeń obowiązkowy (mianownik pokrycia marek) | 202 ścieżki (`kanon/rdzen-obowiazkowy.json`) |
| Definicje komponentów w pomiarze pokrycia | 38 (w tym 2 odcięte heurystyką LEGACY) |
| Zasiane rozjazdy (stan bieżący) | **44**, w trzech kategoriach |
| Stany źródła (miesiące) | 6 (`zrodlo/stany/2026-03` … `2026-08`) |
| Pary kontrastu WCAG | 12 (jedna celowo poniżej progu AA) |

Wszystkie pliki JSON generuje deterministycznie `scripts/generuj.mjs` — wartości barw
są wyliczane (HSL → hex), więc żaden hex nie pochodzi z realnego wdrożenia.

## Sześć miesięcy, trzy historie

Zestaw niesie sześć następujących po sobie stanów źródła i kolekcji marek. Zasiew
platformy przepuszcza każdy stan przez realny potok pomiarowy (import → skan →
pokrycie → trzy miary) i zapisuje migawki z datą wsteczną — liczby są policzone
przez silniki produktu, nie wpisane do bazy.

- **Marka Alfa** (rdzeń, wzorzec) — stoi: 100 / 100 / 0 z definicji.
- **Marka Beta** — rośnie równo: pokrycie 55,4 → 96,0; wierność ~97 → 99;
  dodatki 1 → 3.
- **Marka Gamma** — stała na 80,2 pokrycia, do **dostawy z zewnątrz w 2026-06**,
  po której wierność spada z ~97,5 do ~71 i nie wraca, a dodatki skaczą z 4 na 13.

Rozjazd źródło↔kanon narasta w tym samym czasie: **6 → 10 → 17 → 27 → 39 → 44**
znalezisk. Pokrycie komponentów rośnie: occurrence 5,7% → 89,8%.

## Co jest w środku

| Ścieżka | Zawartość |
|---|---|
| `zestaw.json` | manifest: nazwy, przestrzeń metadanych, konfiguracja skanu, stany miesięczne, słowniki nazw marek |
| `kanon/tokeny.dtcg.json` | kanon DTCG: pełna piramida z metadanymi w `$extensions` |
| `kanon/tryby.json` | wartości trybu Ciemny (96 wpisów) |
| `kanon/rdzen-obowiazkowy.json` | jawny mianownik pokrycia marek |
| `kanon/marki.json` | trzy marki + nakładki motywów (różnicowanie wizualne) |
| `kanon/strony.json` | treść witryny zasiewu |
| `marki/beta/`, `marki/gamma/` | kolekcje lustrzane marek — 6 stanów miesięcznych każda |
| `zrodlo/stany/<okres>/` | 6 stanów zrzutu źródła + pomiaru pokrycia; stan 1 także w kształcie surowym (trasa przyjęcia) |
| `zrodlo/zrzut-alfa.json` | stan bieżący zrzutu (== `stany/2026-08`) z listą `expected` |
| `zrodlo/pokrycie.json` | stan bieżący pomiaru pokrycia |
| `zrodlo/komponenty.json` | inwentarz skanera komponentów rejestr-vs-stan |
| `zrodlo/oczekiwania-komponentow.json` | rejestr oczekiwań komponentów |
| `bramki/` | konfiguracje bramek CLI (rozjazd, pokrycie, kontrast) z progami |
| `dostawcy/wykonawca.json` | dostawca zewnętrzny (autor dostawy do Gammy), kontrakty komponentów |
| `scripts/generuj.mjs` | deterministyczny generator całego zestawu |

## Zasada jednego zbioru

Ten zestaw ma cztery zastosowania i **jest jednym zbiorem danych**:

1. **Zasiew platformy** — `app seed <katalog-tego-repo>` (albo env `DEMO_SET_DIR`)
   wciąga kanon, marki, tryby, strony ORAZ przepuszcza sześć stanów źródła przez
   silniki produktu, zostawiając policzoną warstwę dowodową.
2. **Publiczne repozytorium** — to, co czytasz.
3. **Źródło publicznego serwera MCP** — wyłącznie nienaruszony zasiew, nigdy treści
   pisane przez odwiedzających.
4. **Szablon piaskownicy** — piaskownice efemeryczne startują z tego samego stanu.

## Trzy miary marki — jak są liczone

Adopcję marek mierzą **kolekcje lustrzane** (`marki/`): zespół marki utrzymuje własną
kolekcję (`marka-beta.*`, `marka-gamma.*`), a dopasowanie do rdzenia odbywa się po
jawnym słowniku nazw (`zestaw.json` → `slugMapyMarek`), nigdy „po wartości".
Trzy OSOBNE miary: **pokrycie** (ile obowiązkowego rdzenia marka ma — mianownik
w `kanon/rdzen-obowiazkowy.json`), **wierność** (czy wspólne wartości się zgadzają),
**dodatki własne** (tokeny poza rdzeniem; dużo = znak dojrzałej marki, nie błąd).
Routing: luka → backlog migracji · odstępstwo → znalezisko do decyzji · dodatek →
kolejka promocji. Nakładki motywów w `kanon/marki.json` służą różnicowaniu
wizualnemu (przełączanie marek na witrynie) i nie wchodzą do pomiaru adopcji.

## Uczciwe ograniczenia

Skanowanie rozjazdu wymaga zrzutu zmiennych ze źródła projektowego. Odczyt przez REST
jest bramkowany planem Enterprise dostawcy narzędzia; bez niego zrzut wytwarza operator
(agent w sesji MCP narzędzia albo wtyczka) i podaje platformie trasą przyjęcia — czyli
**u klienta bez planu Enterprise i bez Tokens Studio skanowanie odbywa się na żądanie**,
a o częstotliwości decyduje dyscyplina operatora, nie harmonogram. Jedynym kanałem
ciągłym bez Enterprise jest repozytorium Tokens Studio. Pełny opis granic kanałów
wejścia: `docs/kanaly-wejscia.md` w repozytorium platformy.

Typ `missing-in-code` nie jest zasiany (wymaga artefaktu buildu) — granica zestawu
zapisana w opisie rozjazdów. Wsteczne datowanie migawek historycznych dotyczy
wyłącznie znacznika czasu; wartości pozostają policzone przez silniki.
