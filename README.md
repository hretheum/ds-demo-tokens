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
| Tokeny kanonu | **254** (161 prymitywów · 49 semantycznych · 20 funkcjonalnych · 20 komponentowych · 4 propozycje z piaskownic) |
| Rdzeń obowiązkowy (mianownik pokrycia marek) | 203 ścieżki (`kanon/rdzen-obowiazkowy.json`) |
| Definicje komponentów w pomiarze pokrycia | 38 (w tym 2 odcięte heurystyką LEGACY) |
| Model komponentów (rejestr, oczekiwania, inwentarz) | **35 komponentów**, 37 oczekiwań, zasiane rozbieżności w 9 typach |
| Kontrakty komponentów z przepisem renderowania | **35 z 35** (33 w zestawie + 2 od dostawcy zewnętrznego) |
| Osie wariantów w źródle projektowym | 33 z 35 (Separator i Wiersz tabeli nie mają wariantów) |
| Zbiór ikon | 16 własnych SVG (`zasoby/ikona-*.svg`), bez zależności licencyjnych |
| Strony treści dokumentacyjnej | **55** w 7 sekcjach — wszystkie 28 typów bloków renderera |
| Pochodzenie tokenów | code 609 · figma 4 · proposed 4 · unknown 10 (każde `unknown` uzasadnione treścią) |
| Zasiane rozjazdy (stan bieżący) | **44**, w trzech kategoriach |
| Stany źródła (miesiące) | 6 (`zrodlo/stany/2026-03` … `2026-08`) |
| Pary kontrastu WCAG | 12 (jedna celowo poniżej progu AA) |
| Tryby | rdzeń: Jasny i Ciemny (96 wartości) · marka Beta prowadzi własny tryb Ciemny (92 wartości) |

Wszystkie pliki JSON generuje deterministycznie `scripts/generuj.mjs` — wartości barw
są wyliczane (HSL → hex), więc żaden hex nie pochodzi z realnego wdrożenia.

## Sześć miesięcy, trzy historie

Zestaw niesie sześć następujących po sobie stanów źródła i kolekcji marek. Zasiew
platformy przepuszcza każdy stan przez realny potok pomiarowy (import → skan →
pokrycie → trzy miary) i zapisuje migawki z datą wsteczną — liczby są policzone
przez silniki produktu, nie wpisane do bazy.

- **Marka Alfa** (rdzeń, wzorzec) — stoi: 100 / 100 / 0 z definicji.
- **Marka Beta** — rośnie równo: pokrycie 55,2 → 95,6; wierność ~97 → 99;
  dodatki 1 → 3.
- **Marka Gamma** — stała na 79,8 pokrycia, do **dostawy z zewnątrz w 2026-06**,
  po której wierność spada z ~97,5 do ~71 i nie wraca, a dodatki skaczą z 4 na 13.

Rozjazd źródło↔kanon narasta w tym samym czasie: **6 → 10 → 17 → 27 → 39 → 44**
znalezisk. Pokrycie komponentów rośnie: occurrence 5,7% → 89,8%.

## Co jest w środku

| Ścieżka | Zawartość |
|---|---|
| `zestaw.json` | manifest: nazwy, przestrzeń metadanych, konfiguracja skanu, stany miesięczne, słowniki nazw marek |
| `kanon/tokeny.dtcg.json` | kanon DTCG: pełna piramida z metadanymi w `$extensions` |
| `kanon/tryby.json` | wartości trybu Ciemny rdzenia (96 wpisów) |
| `marki/beta/tryby.json` | tryb Ciemny kolekcji marki Beta (92 wpisy) — marka prowadzi własne tryby |
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
| `dostawcy/wykonawca.json` | dostawca zewnętrzny (autor dostawy do Gammy), kontrakty Przycisku i Karty z przepisami |
| `zrodlo/kontrakty.json` | kontrakty pozostałych 33 pozycji katalogu wraz z przepisami renderowania |
| `zasoby/ikona-*.svg` | zbiór 16 ikon zestawu (kształty geometryczne, rysunek czarny — barwę nadaje token) |
| `scripts/generuj.mjs` | deterministyczny generator całego zestawu |
| `scripts/kontrakty-komponentow.mjs` | kontrakty i przepisy renderowania per pozycja katalogu (materiał źródłowy generatora) |
| `scripts/sprawdz-kontrakty.mjs` | kontrola spójności przepisów: ścieżki wobec kanonu, deklaracja zużycia, osie, brak wypełniacza |
| `scripts/tabela-pokrycia.mjs` | tabela pokrycia katalogu: pozycja → przepis → osie → stany → reakcja na markę |

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

## Przepisy renderowania: dokumentacja, która sama się przemalowuje

Każda pozycja katalogu ma w kontrakcie **przepis renderowania**: deklarację, z jakich
elementów składa się komponent i który token steruje którą właściwością, w rozbiciu na
warianty i stany. Widoki dokumentacji (macierz wariantów, budowa z wymiarami, zachowanie)
powstają z tego przepisu przy każdym wyświetleniu, dla wybranej marki i trybu — nie ma
tu ani jednego zrzutu ekranu ani liczby wpisanej ręcznie obok komponentu.

Dzięki temu render jest **drugim detektorem rozjazdu**, niezależnym od skanu: pozycja,
której marka nie ma czym przemalować, jest oznaczona na widoku i policzona nad nim.
Zestaw niesie dwa takie sygnały zasiane celowo:

- **Baner** (status „wycofywany") zużywa wyłącznie przestarzałe prymitywy spoza kolekcji
  marek — przełączenie marki go nie rusza,
- **Wiersz tabeli** niesie trzy wartości wpisane na sztywno, wypisane imiennie w widoku
  budowy.

Kontrola spójności przepisów: `node scripts/sprawdz-kontrakty.mjs`
(ścieżki wobec kanonu, typy tokenów wobec właściwości, zgodność deklaracji zużycia
z przepisem, osie wobec rejestru, próg długości opisów przeciw wypełniaczowi).
Tabela pokrycia katalogu: `node scripts/tabela-pokrycia.mjs`.

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

Przepis renderowania opisuje komponent na tyle, na ile potrzebuje tego dokumentacja:
układ, wymiary, barwy, stany. Nie jest kodem komponentu i nie uruchamia kodu klienta —
platforma renderuje własne prymitywy referencyjne malowane tokenami. Jeśli komponent
klienta wygląda inaczej niż jego przepis, jest to rozjazd deklaracji ze stanem, czyli
ta sama klasa problemu, którą produkt mierzy w tokenach, przeniesiona na komponenty.
