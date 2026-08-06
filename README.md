# Zestaw demonstracyjny — jeden rdzeń, trzy marki, zasiany rozjazd

Publiczny zestaw tokenów DTCG dla self-hostowanej platformy design systemu. Kanon,
trzy marki na jednym rdzeniu i **celowo zasiany rozjazd każdego wykrywalnego typu** —
żeby zobaczyć raport rozjazdu na własnym terminalu w minutę.

## Jedna komenda

```sh
git clone <to-repozytorium> && cd ds-demo-tokens && ./raport-rozjazdu.sh
```

Wymaganie: sklonowana platforma obok (`../ds-platform`, nadpisywalne zmienną
`DS_PLATFORM_DIR`) z zainstalowanymi zależnościami. **Bez bazy danych, bez sieci,
bez konfiguracji środowiska.**

Zobaczysz 13 znalezisk (11 REAL · 1 ARCHITECTURAL · 1 ASSUMPTION) i kod wyjścia 1 —
bramka zatrzymuje przebieg, bo rozjazd istnieje. To jest oczekiwany wynik: każde
znalezisko jest zasiane celowo i opisane w [opis-rozjazdow.md](opis-rozjazdow.md).

Druga bramka — pomiar pokrycia komponentów:

```sh
./raport-pokrycia.sh   # brama G1, occurrence 60%, próg 50% dotrzymany → kod 0
```

## Co jest w środku

| Ścieżka | Zawartość |
|---|---|
| `zestaw.json` | manifest: nazwy, przestrzeń metadanych, konfiguracja skanu, mapa plików |
| `kanon/tokeny.dtcg.json` | kanon DTCG: prymitywy → semantyka → warstwa komponentowa; metadane w `$extensions` |
| `kanon/tryby.json` | wartości trybu Ciemny |
| `kanon/marki.json` | trzy marki: Alfa (rdzeń), Beta (wierna 100/100/0), Gamma (odstępstwo + dodatki) |
| `kanon/strony.json` | treść witryny zasiewu |
| `zrodlo/zrzut-alfa.json` | zrzut źródła projektowego z zasianym rozjazdem (13 wyzwalaczy) |
| `zrodlo/pokrycie.json` | wejście pomiaru pokrycia (tokenized/partial/untokenized/legacy) |
| `bramki/` | konfiguracje bramek CLI z progami i semantyką kodów wyjścia |

## Zasada jednego zbioru

Ten zestaw ma cztery zastosowania i **jest jednym zbiorem danych**:

1. **Zasiew platformy** — `app seed <katalog-tego-repo>` (albo env `DEMO_SET_DIR`)
   wciąga kanon, marki, tryby i strony do świeżej instalacji.
2. **Publiczne repozytorium** — to, co czytasz.
3. **Źródło publicznego serwera MCP** — wyłącznie nienaruszony zasiew, nigdy treści
   pisane przez odwiedzających.
4. **Szablon piaskownicy** — piaskownice efemeryczne startują z tego samego stanu.

## Trzy miary marki — co pokazują profile

Po zasiewie platforma liczy dla każdej marki trzy OSOBNE miary: **pokrycie** (ile
obowiązkowego rdzenia marka ma), **wierność** (czy wspólne wartości się zgadzają),
**dodatki własne** (tokeny poza rdzeniem). Beta pokazuje profil czysty (100/100/0);
Gamma pokazuje routing rozjazdu: odstępstwo → znalezisko do decyzji, dodatek →
kolejka promocji. Adopcja przestaje być opinią — jest pomiarem.

## Uczciwe ograniczenia

Skanowanie rozjazdu wymaga zrzutu zmiennych ze źródła projektowego. Odczyt przez REST
jest bramkowany planem Enterprise dostawcy narzędzia; bez niego zrzut wytwarza operator
(agent w sesji MCP narzędzia albo wtyczka) i podaje platformie trasą przyjęcia — czyli
**u klienta bez planu Enterprise i bez Tokens Studio skanowanie odbywa się na żądanie**,
a o częstotliwości decyduje dyscyplina operatora, nie harmonogram. Jedynym kanałem
ciągłym bez Enterprise jest repozytorium Tokens Studio. Pełny opis granic kanałów
wejścia: `docs/kanaly-wejscia.md` w repozytorium platformy.

Typ `missing-in-code` nie jest zasiany (wymaga artefaktu buildu) — granica zestawu
zapisana w opisie rozjazdów.
