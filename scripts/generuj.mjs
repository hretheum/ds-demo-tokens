#!/usr/bin/env node
// =============================================================================
// Generator zestawu demonstracyjnego — jedyne źródło danych tego repozytorium.
//
// Wszystkie pliki JSON zestawu (kanon, tryby, marki, stany źródła, pokrycie,
// komponenty, bramki, manifest) powstają z tego skryptu deterministycznie:
// dwa uruchomienia dają bajtowo ten sam wynik. Wartości barw są WYLICZANE
// (HSL → hex), więc żaden hex nie pochodzi z realnego wdrożenia (zasada zera
// nazw własnych). Rozjazd jest zasiewany jawną listą zaburzeń z osią czasu —
// sześć stanów źródła odpowiada sześciu kolejnym miesiącom.
//
// Uruchomienie:  node scripts/generuj.mjs   (z katalogu głównego zestawu)
// =============================================================================

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const NS = 'com.example'
const OKRESY = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08']

// ---------------------------------------------------------------------------
// Barwy: HSL → hex (wyliczane, nie kopiowane)
// ---------------------------------------------------------------------------

function hslHex(h, s, l) {
  s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const kanal = (v) => Math.round(255 * v).toString(16).padStart(2, '0')
  return `#${kanal(f(0))}${kanal(f(8))}${kanal(f(4))}`
}

// WCAG 2.x — luminancja względna i kontrast (do PROJEKTOWANIA par bramki;
// wynik ostateczny i tak liczy silnik platformy)
function luminancja(hex) {
  const kanal = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * kanal(1) + 0.7152 * kanal(3) + 0.0722 * kanal(5)
}
function kontrast(a, b) {
  const [x, y] = [luminancja(a), luminancja(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

// Skale barw: 9 skal × 10 kroków. Jasność opada od 050 do 900; tryb Ciemny
// używa kroku lustrzanego (050 ↔ 900). Nazwy skal neutralne, opisowe.
const KROKI = ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const JASNOSCI = [96, 90, 81, 71, 61, 51, 43, 35, 27, 19]
const SKALE = {
  blekit: { h: 224, s: 76 },
  morski: { h: 192, s: 68 },
  zielen: { h: 152, s: 56 },
  oliwka: { h: 84, s: 48 },
  bursztyn: { h: 42, s: 88 },
  czerwien: { h: 10, s: 72 },
  purpura: { h: 276, s: 60 },
  roz: { h: 330, s: 64 },
  grafit: { h: 222, s: 10 },
}
function krokHex(skala, i) {
  const { h, s } = SKALE[skala]
  return hslHex(h, s, JASNOSCI[i])
}
function krokHexCiemny(skala, i) {
  return krokHex(skala, KROKI.length - 1 - i) // krok lustrzany
}

// ---------------------------------------------------------------------------
// Kanon: pełna piramida (prymitywy → semantyka → warstwa funkcjonalna →
// warstwa komponentowa) + grupy specjalne (zrodlowe, wewnetrzne, przestarzałe)
// ---------------------------------------------------------------------------

/** @type {Array<{path:string,type:string,value:unknown,dark?:unknown,layer:string,provenance?:string,status?:string,desc?:string,extra?:Record<string,unknown>}>} */
const tokeny = []
const dodaj = (t) => { tokeny.push({ provenance: 'code', status: 'active', ...t }) }
const px = (v) => ({ value: v, unit: 'px' })
const alias = (p) => `{${p}}`

// --- prymitywy: barwy (92) --------------------------------------------------
for (const skala of Object.keys(SKALE)) {
  for (let i = 0; i < KROKI.length; i++) {
    dodaj({
      path: `rdzen.color.${skala}-${KROKI[i]}`,
      type: 'color', value: krokHex(skala, i), dark: krokHexCiemny(skala, i),
      layer: 'primitive',
      ...(KROKI[i] === '900' && skala === 'blekit'
        ? { desc: 'Najciemniejszy krok skali błękitu — podstawa tekstu akcentowego' }
        : {}),
    })
  }
}
dodaj({ path: 'rdzen.color.biel', type: 'color', value: '#ffffff', dark: '#15171c', layer: 'primitive' })
dodaj({ path: 'rdzen.color.czern', type: 'color', value: '#101216', dark: '#f5f6f8', layer: 'primitive' })

// --- prymitywy: przestarzałe (3) — źródło wciąż ich używa (rozjazd zasiany) --
dodaj({
  path: 'rdzen.color.sygnalowy-stary', type: 'color', value: krokHex('czerwien', 6), layer: 'primitive',
  status: 'deprecated',
  extra: { 'replaced-by': 'rdzen.color.czerwien-600', 'deprecated-since': '2026-01-15', 'deprecated-deadline': '2026-12-31' },
})
dodaj({
  path: 'rdzen.color.akcent-stary', type: 'color', value: krokHex('bursztyn', 5), layer: 'primitive',
  status: 'deprecated',
  extra: { 'replaced-by': 'rdzen.color.bursztyn-500', 'deprecated-since': '2026-02-01', 'deprecated-deadline': '2026-12-31' },
})

// --- prymitywy: wymiary (25, z jednym przestarzałym) -------------------------
const ODSTEPY = [['000', 0], ['025', 2], ['050', 4], ['075', 6], ['100', 8], ['150', 12], ['200', 16], ['250', 20], ['300', 24], ['400', 32], ['500', 40], ['600', 48]]
for (const [n, v] of ODSTEPY) dodaj({ path: `rdzen.rozmiar.odstep-${n}`, type: 'space', value: px(v), layer: 'primitive' })
dodaj({
  path: 'rdzen.rozmiar.odstep-stary', type: 'space', value: px(10), layer: 'primitive',
  status: 'deprecated',
  extra: { 'replaced-by': 'rdzen.rozmiar.odstep-150', 'deprecated-since': '2026-03-01', 'deprecated-deadline': '2026-12-31' },
})
for (const [n, v] of [['zaden', 0], ['maly', 4], ['sredni', 8], ['duzy', 16], ['pelny', 999]]) {
  dodaj({ path: `rdzen.rozmiar.promien-${n}`, type: 'radius', value: px(v), layer: 'primitive' })
}
for (const [n, v] of [['cienka', 1], ['srednia', 2], ['gruba', 4]]) {
  dodaj({ path: `rdzen.rozmiar.obwodka-${n}`, type: 'borderWidth', value: px(v), layer: 'primitive' })
}
for (const [n, v] of [['maly', 16], ['sredni', 20], ['duzy', 24], ['wielki', 32]]) {
  dodaj({ path: `rdzen.rozmiar.ikona-${n}`, type: 'size', value: px(v), layer: 'primitive' })
}

// --- prymitywy: typografia (19) ----------------------------------------------
const ROZMIARY_TEKSTU = [['drobny', 12], ['podpis', 13], ['tresc', 15], ['tresc-duza', 17], ['naglowek-4', 20], ['naglowek-3', 24], ['naglowek-2', 30], ['naglowek-1', 38], ['tytul', 48]]
for (const [n, v] of ROZMIARY_TEKSTU) dodaj({ path: `rdzen.typografia.rozmiar-${n}`, type: 'fontSize', value: px(v), layer: 'primitive' })
for (const [n, v] of [['ciasna', 1.2], ['zwarta', 1.35], ['zwykla', 1.5], ['luzna', 1.7]]) {
  dodaj({ path: `rdzen.typografia.wysokosc-${n}`, type: 'lineHeight', value: v, layer: 'primitive' })
}
for (const [n, v] of [['zwykla', 400], ['srednia', 500], ['pogrubiona', 600], ['mocna', 700]]) {
  dodaj({ path: `rdzen.typografia.grubosc-${n}`, type: 'fontWeight', value: v, layer: 'primitive' })
}
dodaj({ path: 'rdzen.typografia.rodzina-podstawowa', type: 'fontFamily', value: 'system-ui, sans-serif', layer: 'primitive' })
dodaj({ path: 'rdzen.typografia.rodzina-o-stalej-szerokosci', type: 'fontFamily', value: 'ui-monospace, monospace', layer: 'primitive' })

// --- prymitywy: czas, krycie, warstwa (14) -----------------------------------
for (const [n, v] of [['blysk', 80], ['szybki', 140], ['zwykly', 220], ['wolny', 360]]) {
  // kanoniczna forma duration to obiekt {value, unit} — zgodna z normalizatorem importu
  dodaj({ path: `rdzen.czas.${n}`, type: 'duration', value: { value: v, unit: 'ms' }, layer: 'primitive' })
}
for (const [n, v] of [['przezroczyste', 0], ['ledwie', 0.12], ['polowa', 0.5], ['mocne', 0.84], ['pelne', 1]]) {
  dodaj({ path: `rdzen.krycie.${n}`, type: 'opacity', value: v, layer: 'primitive' })
}
for (const [n, v] of [['podloga', 0], ['wyniesienie', 10], ['nakladka', 100], ['okno', 1000], ['powiadomienie', 1100]]) {
  dodaj({ path: `rdzen.warstwa.${n}`, type: 'zIndex', value: v, layer: 'primitive' })
}

// --- prymitywy: zrodlowe (4, pochodzenie figma — historia importu) -----------
for (const [n, skala, i] of [['poswiata', 'blekit', 0], ['mgla', 'grafit', 1], ['poranek', 'bursztyn', 0], ['zorza', 'roz', 1]]) {
  dodaj({
    path: `rdzen.zrodlowe.${n}`, type: 'color', value: krokHex(skala, i), dark: krokHexCiemny(skala, i),
    layer: 'primitive', provenance: 'figma',
    desc: 'Token przyjęty z pliku projektowego (pochodzenie: źródło projektowe)',
  })
}

// --- prymitywy: wewnetrzne (4, modelowane wyłącznie w kodzie) ----------------
dodaj({ path: 'rdzen.wewnetrzne.siatka-kolumn', type: 'zIndex', value: 12, layer: 'primitive', desc: 'Liczba kolumn siatki — konsumowana wyłącznie przez kod układu' })
for (const [n, v] of [['przelamanie-male', 640], ['przelamanie-srednie', 960], ['przelamanie-duze', 1280]]) {
  dodaj({ path: `rdzen.wewnetrzne.${n}`, type: 'dimension', value: px(v), layer: 'primitive', desc: 'Próg przełamania układu — konsumowany wyłącznie przez kod' })
}

// --- semantyka (49): aliasy do prymitywów ------------------------------------
const SEMANTYKA = [
  ['tekst-podstawowy', 'color', 'rdzen.color.grafit-900', 'Podstawowy kolor tekstu treści'],
  ['tekst-drugorzedny', 'color', 'rdzen.color.grafit-700'],
  ['tekst-odwrocony', 'color', 'rdzen.color.biel'],
  ['tekst-wylaczony', 'color', 'rdzen.color.grafit-400'],
  ['tekst-link', 'color', 'rdzen.color.blekit-700'],
  ['tekst-negatywny', 'color', 'rdzen.color.czerwien-700'],
  ['tlo-strona', 'color', 'rdzen.color.biel'],
  ['tlo-powierzchnia', 'color', 'rdzen.color.grafit-050'],
  ['tlo-wyniesione', 'color', 'rdzen.color.biel'],
  ['tlo-wyciszone', 'color', 'rdzen.color.grafit-100'],
  ['tlo-akcent-subtelne', 'color', 'rdzen.color.blekit-050'],
  ['tlo-odwrocone', 'color', 'rdzen.color.grafit-900'],
  ['akcja-podstawowa', 'color', 'rdzen.color.blekit-700', 'Kolor głównych przycisków i akcji'],
  ['akcja-podstawowa-najechanie', 'color', 'rdzen.color.blekit-800'],
  ['akcja-podstawowa-aktywna', 'color', 'rdzen.color.blekit-900'],
  ['akcja-drugorzedna', 'color', 'rdzen.color.grafit-200'],
  ['akcja-destrukcyjna', 'color', 'rdzen.color.czerwien-600'],
  ['akcja-wylaczona', 'color', 'rdzen.color.grafit-200'],
  ['obwodka-subtelna', 'color', 'rdzen.color.grafit-200'],
  ['obwodka-wyrazna', 'color', 'rdzen.color.grafit-400'],
  ['obwodka-skupienie', 'color', 'rdzen.color.blekit-500'],
  ['obwodka-blad', 'color', 'rdzen.color.czerwien-600'],
  ['stan-sukces-tlo', 'color', 'rdzen.color.zielen-100'],
  ['stan-sukces-tresc', 'color', 'rdzen.color.zielen-800'],
  ['stan-ostrzezenie-tlo', 'color', 'rdzen.color.bursztyn-100'],
  ['stan-ostrzezenie-tresc', 'color', 'rdzen.color.bursztyn-800'],
  ['stan-blad-tlo', 'color', 'rdzen.color.czerwien-050'],
  ['stan-blad-tresc', 'color', 'rdzen.color.czerwien-800'],
  ['stan-informacja-tlo', 'color', 'rdzen.color.morski-050'],
  ['stan-informacja-tresc', 'color', 'rdzen.color.morski-800'],
  ['odstep-przylegly', 'space', 'rdzen.rozmiar.odstep-025'],
  ['odstep-ciasny', 'space', 'rdzen.rozmiar.odstep-075'],
  ['odstep-zwykly', 'space', 'rdzen.rozmiar.odstep-150'],
  ['odstep-luzny', 'space', 'rdzen.rozmiar.odstep-300'],
  ['odstep-sekcja', 'space', 'rdzen.rozmiar.odstep-500'],
  ['odstep-strona', 'space', 'rdzen.rozmiar.odstep-600'],
  ['promien-interakcja', 'radius', 'rdzen.rozmiar.promien-maly'],
  ['promien-powierzchnia', 'radius', 'rdzen.rozmiar.promien-sredni'],
  ['promien-pelny', 'radius', 'rdzen.rozmiar.promien-pelny'],
  ['typografia-naglowek-1', 'fontSize', 'rdzen.typografia.rozmiar-naglowek-1'],
  ['typografia-naglowek-2', 'fontSize', 'rdzen.typografia.rozmiar-naglowek-2'],
  ['typografia-naglowek-3', 'fontSize', 'rdzen.typografia.rozmiar-naglowek-3'],
  ['typografia-naglowek-4', 'fontSize', 'rdzen.typografia.rozmiar-naglowek-4'],
  ['typografia-tresc', 'fontSize', 'rdzen.typografia.rozmiar-tresc'],
  ['typografia-tresc-duza', 'fontSize', 'rdzen.typografia.rozmiar-tresc-duza'],
  ['typografia-podpis', 'fontSize', 'rdzen.typografia.rozmiar-podpis'],
  ['typografia-przycisk', 'fontSize', 'rdzen.typografia.rozmiar-tresc'],
  ['ruch-wejscie', 'duration', 'rdzen.czas.szybki'],
  ['ruch-wyjscie', 'duration', 'rdzen.czas.blysk'],
]
for (const [n, typ, cel, opis] of SEMANTYKA) {
  dodaj({ path: `rdzen.semantic.${n}`, type: typ, value: alias(cel), layer: 'semantic', ...(opis ? { desc: opis } : {}) })
}

// --- warstwa funkcjonalna (20): aliasy do semantyki --------------------------
const FUNKCJONALNE = [
  ['formularz-etykieta', 'color', 'rdzen.semantic.tekst-podstawowy'],
  ['formularz-pomoc', 'color', 'rdzen.semantic.tekst-drugorzedny'],
  ['formularz-blad', 'color', 'rdzen.semantic.tekst-negatywny'],
  ['formularz-tlo-pola', 'color', 'rdzen.semantic.tlo-strona'],
  ['formularz-obwodka-pola', 'color', 'rdzen.semantic.obwodka-subtelna'],
  ['formularz-obwodka-skupienie', 'color', 'rdzen.semantic.obwodka-skupienie'],
  ['nawigacja-tlo', 'color', 'rdzen.semantic.tlo-powierzchnia'],
  ['nawigacja-pozycja-tekst', 'color', 'rdzen.semantic.tekst-drugorzedny'],
  ['nawigacja-pozycja-aktywna', 'color', 'rdzen.semantic.akcja-podstawowa'],
  ['nawigacja-separator', 'color', 'rdzen.semantic.obwodka-subtelna'],
  ['tabela-naglowek-tlo', 'color', 'rdzen.semantic.tlo-wyciszone'],
  ['tabela-wiersz-tlo', 'color', 'rdzen.semantic.tlo-strona'],
  ['tabela-wiersz-naprzemienny', 'color', 'rdzen.semantic.tlo-powierzchnia'],
  ['tabela-obwodka', 'color', 'rdzen.semantic.obwodka-subtelna'],
  ['komunikat-sukces-tlo', 'color', 'rdzen.semantic.stan-sukces-tlo'],
  ['komunikat-sukces-tresc', 'color', 'rdzen.semantic.stan-sukces-tresc'],
  ['komunikat-blad-tlo', 'color', 'rdzen.semantic.stan-blad-tlo'],
  ['komunikat-blad-tresc', 'color', 'rdzen.semantic.stan-blad-tresc'],
  ['komunikat-informacja-tlo', 'color', 'rdzen.semantic.stan-informacja-tlo'],
  ['komunikat-informacja-tresc', 'color', 'rdzen.semantic.stan-informacja-tresc'],
]
for (const [n, typ, cel] of FUNKCJONALNE) {
  dodaj({ path: `rdzen.funkcjonalne.${n}`, type: typ, value: alias(cel), layer: 'functional' })
}

// --- warstwa komponentowa (20): aliasy do warstwy funkcjonalnej; TRZY tokeny
// celowo wskazują wprost prymityw (zasiany rozjazd warstwy: component-skips-role)
const KOMPONENTOWE = [
  ['przycisk-tlo', 'color', 'rdzen.color.blekit-600', true, 'Celowy rozjazd warstwy: deklaracja komponentowa, alias wprost do prymitywu'],
  ['przycisk-tlo-najechanie', 'color', 'rdzen.funkcjonalne.nawigacja-pozycja-aktywna', false],
  ['przycisk-tresc', 'color', 'rdzen.funkcjonalne.formularz-etykieta', false],
  ['przycisk-obwodka', 'color', 'rdzen.funkcjonalne.formularz-obwodka-pola', false],
  ['przycisk-tresc-odwrocona', 'color', 'rdzen.funkcjonalne.tabela-wiersz-tlo', false],
  ['przycisk-tlo-wylaczone', 'color', 'rdzen.funkcjonalne.nawigacja-separator', false],
  ['pole-tlo', 'color', 'rdzen.funkcjonalne.formularz-tlo-pola', false],
  ['pole-tresc', 'color', 'rdzen.funkcjonalne.formularz-etykieta', false],
  ['pole-obwodka', 'color', 'rdzen.color.grafit-300', true, 'Celowy rozjazd warstwy: deklaracja komponentowa, alias wprost do prymitywu'],
  ['pole-obwodka-skupienie', 'color', 'rdzen.funkcjonalne.formularz-obwodka-skupienie', false],
  ['karta-tlo', 'color', 'rdzen.funkcjonalne.tabela-wiersz-tlo', false],
  ['karta-obwodka', 'color', 'rdzen.funkcjonalne.tabela-obwodka', false],
  ['karta-naglowek', 'color', 'rdzen.funkcjonalne.formularz-etykieta', false],
  ['karta-opis', 'color', 'rdzen.funkcjonalne.formularz-pomoc', false],
  ['znacznik-tlo', 'color', 'rdzen.color.bursztyn-100', true, 'Celowy rozjazd warstwy: deklaracja komponentowa, alias wprost do prymitywu'],
  ['znacznik-tresc', 'color', 'rdzen.funkcjonalne.komunikat-informacja-tresc', false],
  ['okno-tlo', 'color', 'rdzen.funkcjonalne.tabela-wiersz-tlo', false],
  ['okno-naglowek', 'color', 'rdzen.funkcjonalne.formularz-etykieta', false],
  ['powiadomienie-tlo', 'color', 'rdzen.funkcjonalne.komunikat-informacja-tlo', false],
  ['powiadomienie-tresc', 'color', 'rdzen.funkcjonalne.komunikat-informacja-tresc', false],
]
for (const [n, typ, cel, , opis] of KOMPONENTOWE) {
  dodaj({ path: `rdzen.komponent.${n}`, type: typ, value: alias(cel), layer: 'component', ...(opis ? { desc: opis } : {}) })
}

// --- propozycje z piaskownicy (4, pochodzenie proposed, status draft) --------
// Kandydaci wyniesieni z piaskownicy zespołu marki — czekają na decyzję właściciela
// rdzenia (bramka promocji). Status draft wyłącza je z rdzenia obowiązkowego.
for (const [n, skala, i, opis] of [
  ['akcent-promocyjny', 'roz', 4, 'Propozycja z piaskownicy Marki Beta — akcent kampanii sezonowych'],
  ['tlo-wyroznienia', 'bursztyn', 0, 'Propozycja z piaskownicy Marki Beta — tło wyróżnionych kart'],
  ['obwodka-nowosci', 'zielen', 4, 'Propozycja z piaskownicy Marki Gamma — obwódka znacznika nowości'],
  ['tekst-promocyjny', 'purpura', 7, 'Propozycja z piaskownicy Marki Gamma — tekst na tłach kampanii'],
]) {
  // bez deklaracji warstwy: kandydat z piaskownicy dostaje warstwę dopiero przy
  // przyjęciu do rdzenia (deklaracja semantic przy wartości wprost = rozjazd warstwy)
  dodaj({
    path: `rdzen.propozycje.${n}`, type: 'color', value: krokHex(skala, i),
    layer: null, provenance: 'proposed', status: 'draft', desc: opis,
  })
}

// --- token o nieustalonym pochodzeniu (1) — uczciwa informacja, nie brak danych
dodaj({
  path: 'rdzen.color.odziedziczony', type: 'color', value: hslHex(206, 28, 46),
  layer: 'primitive', provenance: 'unknown',
  desc: 'Token przeniesiony ze starszego systemu — pochodzenie nieustalone, do wyjaśnienia przy najbliższym przeglądzie',
})

// --- kuratela: sekcje utrzymywane ręcznie (ochrona protect_curated_node) -----
const KURATOROWANE = new Set([
  'rdzen.semantic.tekst-podstawowy', 'rdzen.semantic.akcja-podstawowa',
  'rdzen.semantic.tlo-strona', 'rdzen.semantic.obwodka-skupienie',
  'rdzen.semantic.stan-blad-tlo', 'rdzen.semantic.stan-blad-tresc',
])
for (const t of tokeny) {
  if (KURATOROWANE.has(t.path)) t.extra = { ...t.extra, curated: true }
}

// --- kontrola wewnętrzna: aliasy kanonu muszą się rozwiązywać ----------------
const wgSciezki = new Map(tokeny.map((t) => [t.path, t]))
function rozwiaz(p, widziane = new Set()) {
  const t = wgSciezki.get(p)
  if (!t) throw new Error(`Alias wskazuje nieistniejącą ścieżkę kanonu: ${p}`)
  if (typeof t.value === 'string' && t.value.startsWith('{')) {
    if (widziane.has(p)) throw new Error(`Cykl aliasów: ${p}`)
    widziane.add(p)
    return rozwiaz(t.value.slice(1, -1), widziane)
  }
  return t.value
}
for (const t of tokeny) {
  if (typeof t.value === 'string' && t.value.startsWith('{')) rozwiaz(t.path)
}

// Rdzeń obowiązkowy (mianownik pokrycia marek): active × (primitive+semantic),
// bez grupy wewnetrzne (konsumowana wyłącznie przez kod, marki jej nie lustrzą)
const rdzenObowiazkowy = tokeny
  .filter((t) => t.status === 'active'
    && (t.layer === 'primitive' || t.layer === 'semantic')
    && !t.path.startsWith('rdzen.wewnetrzne'))
  .map((t) => t.path)
  .sort()

// =============================================================================
// Zaburzenia: oś czasu rozjazdu (miesiąc wprowadzenia → stan źródła)
// =============================================================================
// Każde zaburzenie ma miesiąc wprowadzenia (1..6) i opis. Stan źródła miesiąca N
// zawiera wszystkie zaburzenia z miesięcy ≤ N. Stan miesiąca 6 == zrodlo/zrzut-alfa.json.

const VM = (i) => krokHex('purpura', i) // wartości podmienione — z innej skali, jawnie różne

/** @type {Array<{od:number, typ:string, kategoria:string, severity:string, sciezka:string, powod?:string, zastosuj:(v:Map<string,any>)=>void, opis:string}>} */
const ZABURZENIA = [
  // miesiąc 1 — dług istniejący od startu
  { od: 1, typ: 'layer-mismatch', kategoria: 'REAL', severity: 'P1', sciezka: 'rdzen.komponent.przycisk-tlo', powod: 'component-skips-role', zastosuj: () => {}, opis: 'Token komponentowy aliasuje wprost prymityw (deklaracja component, wyprowadzenie semantic)' },
  { od: 1, typ: 'layer-mismatch', kategoria: 'REAL', severity: 'P1', sciezka: 'rdzen.komponent.pole-obwodka', powod: 'component-skips-role', zastosuj: () => {}, opis: 'Jak wyżej — obwódka pola omija warstwę roli' },
  { od: 1, typ: 'layer-mismatch', kategoria: 'REAL', severity: 'P1', sciezka: 'rdzen.komponent.znacznik-tlo', powod: 'component-skips-role', zastosuj: () => {}, opis: 'Jak wyżej — tło znacznika omija warstwę roli' },
  { od: 1, typ: 'deprecated-still-used', kategoria: 'REAL', severity: 'P3', sciezka: 'rdzen.color.sygnalowy-stary', zastosuj: () => {}, opis: 'Źródło wciąż używa wycofanego koloru sygnałowego' },
  { od: 1, typ: 'deprecated-still-used', kategoria: 'REAL', severity: 'P3', sciezka: 'rdzen.color.akcent-stary', zastosuj: () => {}, opis: 'Źródło wciąż używa wycofanego akcentu' },
  { od: 1, typ: 'deprecated-still-used', kategoria: 'REAL', severity: 'P3', sciezka: 'rdzen.rozmiar.odstep-stary', zastosuj: () => {}, opis: 'Źródło wciąż używa wycofanego odstępu' },

  // miesiąc 2 — pierwsze przemalowania
  { od: 2, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.blekit-500', zastosuj: (v) => { v.get('rdzen/color/blekit-500').valuesByMode.Jasny = VM(4) }, opis: 'Projektant przemalował krok 500 błękitu bez zmiany kanonu' },
  { od: 2, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.zielen-600', zastosuj: (v) => { v.get('rdzen/color/zielen-600').valuesByMode.Jasny = VM(5) }, opis: 'Przemalowany krok 600 zieleni' },
  { od: 2, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.rozmiar.odstep-300', zastosuj: (v) => { v.get('rdzen/rozmiar/odstep-300').valuesByMode.Jasny = { value: 26, unit: 'px' } }, opis: 'Odstęp 300 zmieniony w źródle na 26 px (kanon: 24 px)' },
  { od: 2, typ: 'metadata-drift', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.blekit-900', powod: 'description-mismatch', zastosuj: (v) => { v.get('rdzen/color/blekit-900').description = 'Kolor nagłówków hero (opis rozjechany ze specyfikacją)' }, opis: 'Opis w źródle rozjechany z opisem kanonu' },

  // miesiąc 3 — tryb ciemny zaniedbany, pierwsza literówka, znikają tokeny źródłowe
  { od: 3, typ: 'mode-incomplete', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.blekit-100@Jasny↔Ciemny', powod: 'empty-mode', zastosuj: (v) => { v.get('rdzen/color/blekit-100').valuesByMode.Ciemny = null }, opis: 'Tryb Ciemny bez wartości' },
  { od: 3, typ: 'mode-incomplete', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.morski-500@Jasny↔Ciemny', powod: 'empty-mode', zastosuj: (v) => { v.get('rdzen/color/morski-500').valuesByMode.Ciemny = null }, opis: 'Tryb Ciemny bez wartości' },
  { od: 3, typ: 'mode-incomplete', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.czerwien-500@Jasny↔Ciemny', powod: 'placeholder-value', zastosuj: (v) => { v.get('rdzen/color/czerwien-500').valuesByMode.Ciemny = '#000000' }, opis: 'Zaślepka #000000 zamiast wartości trybu' },
  { od: 3, typ: 'mode-incomplete', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.purpura-300@Jasny↔Ciemny', powod: 'placeholder-value', zastosuj: (v) => { v.get('rdzen/color/purpura-300').valuesByMode.Ciemny = '#000000' }, opis: 'Zaślepka #000000 zamiast wartości trybu' },
  { od: 3, typ: 'missing-in-figma', kategoria: 'REAL', severity: 'P1', sciezka: 'rdzen.zrodlowe.poswiata', zastosuj: (v) => { v.delete('rdzen/zrodlowe/poswiata') }, opis: 'Token przyjęty ze źródła zniknął ze źródła' },
  { od: 3, typ: 'missing-in-figma', kategoria: 'REAL', severity: 'P1', sciezka: 'rdzen.zrodlowe.mgla', zastosuj: (v) => { v.delete('rdzen/zrodlowe/mgla') }, opis: 'Jak wyżej' },
  { od: 3, typ: 'naming-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.typografia.rodzina-podstawowa', zastosuj: (v) => {
    const stary = v.get('rdzen/typografia/rodzina-podstawowa'); v.delete('rdzen/typografia/rodzina-podstawowa')
    v.set('rdzen.typografia.rodzina-podstawowej', { ...stary, name: 'rdzen.typografia.rodzina-podstawowej' })
  }, opis: 'Literówka w nazwie zmiennej (kropki zamiast ukośników uniemożliwiają mapowanie)' },

  // miesiąc 4 — dostawa z zewnątrz: przemalowania i samowolne dodatki
  { od: 4, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.bursztyn-500', zastosuj: (v) => { v.get('rdzen/color/bursztyn-500').valuesByMode.Jasny = VM(3) }, opis: 'Dostawa z zewnątrz przemalowała bursztyn 500' },
  { od: 4, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.roz-400', zastosuj: (v) => { v.get('rdzen/color/roz-400').valuesByMode.Jasny = VM(2) }, opis: 'Dostawa z zewnątrz przemalowała róż 400' },
  { od: 4, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.krycie.mocne', zastosuj: (v) => { v.get('rdzen/krycie/mocne').valuesByMode.Jasny = 0.9 }, opis: 'Krycie mocne podniesione w źródle do 0,9 (kanon: 0,84)' },
  { od: 4, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P0', sciezka: 'rdzen.semantic.akcja-podstawowa', zastosuj: (v) => { v.get('rdzen/semantic/akcja-podstawowa').valuesByMode.Jasny = VM(6) }, opis: 'Semantyczny kolor głównej akcji zaszyty na sztywno INNĄ wartością niż kanon — najpoważniejszy rozjazd zestawu' },
  { od: 4, typ: 'hardcoded-anti-pattern', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.akcja-podstawowa', zastosuj: () => {}, opis: 'Ta sama zmienna: wartość surowa zamiast aliasu (antywzorzec)' },
  { od: 4, typ: 'hardcoded-anti-pattern', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.stan-sukces-tlo', zastosuj: (v) => { v.get('rdzen/semantic/stan-sukces-tlo').valuesByMode.Jasny = krokHex('zielen', 1) }, opis: 'Zmienna semantyczna z wartością surową równą rozwiązanej — antywzorzec bez rozjazdu wartości' },
  { od: 4, typ: 'hardcoded-anti-pattern', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.obwodka-subtelna', zastosuj: (v) => { v.get('rdzen/semantic/obwodka-subtelna').valuesByMode.Jasny = krokHex('grafit', 2) }, opis: 'Jak wyżej' },
  { od: 4, typ: 'missing-in-canonical', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.neon', zastosuj: (v) => { v.set('rdzen/color/neon', wariant('rdzen/color/neon', 'Prymitywy', 'COLOR', { Jasny: hslHex(140, 96, 55) })) }, opis: 'Dostawa dodała kolor bez odpowiednika w kanonie' },
  { od: 4, typ: 'missing-in-canonical', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.color.akcent-sezonowy', zastosuj: (v) => { v.set('rdzen/color/akcent-sezonowy', wariant('rdzen/color/akcent-sezonowy', 'Prymitywy', 'COLOR', { Jasny: hslHex(18, 92, 58) })) }, opis: 'Jak wyżej — akcent sezonowy' },
  { od: 4, typ: 'missing-in-canonical', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.tlo-reklamowe', zastosuj: (v) => { v.set('rdzen/semantic/tlo-reklamowe', wariant('rdzen/semantic/tlo-reklamowe', 'Semantyka', 'COLOR', { Jasny: { aliasOf: 'rdzen/color/bursztyn-100' } })) }, opis: 'Nowa zmienna semantyczna (alias) bez odpowiednika w kanonie' },

  // miesiąc 5 — typy się sypią, wewnętrzne wypływają do źródła, placeholder trybu
  { od: 5, typ: 'type-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.rozmiar.promien-sredni', zastosuj: (v) => { const z = v.get('rdzen/rozmiar/promien-sredni'); z.type = 'COLOR'; z.valuesByMode = { Jasny: '#00ff88' } }, opis: 'Promień odtworzony w źródle jako kolor (typ niezgodny)' },
  { od: 5, typ: 'type-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.typografia.grubosc-pogrubiona', zastosuj: (v) => { const z = v.get('rdzen/typografia/grubosc-pogrubiona'); z.type = 'STRING'; z.valuesByMode = { Jasny: 'pogrubiona' } }, opis: 'Grubość pisma jako tekst zamiast liczby' },
  { od: 5, typ: 'alias-broken', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.tekst-link', zastosuj: (v) => { v.get('rdzen/semantic/tekst-link').valuesByMode.Jasny = { aliasOf: 'rdzen/color/blekit-650' } }, opis: 'Alias wskazuje nieistniejącą zmienną (krok 650 nie istnieje)' },
  { od: 5, typ: 'alias-broken', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.tlo-akcent-subtelne', zastosuj: (v) => { v.get('rdzen/semantic/tlo-akcent-subtelne').valuesByMode.Jasny = { aliasOf: 'rdzen/color/lazur-100' } }, opis: 'Alias wskazuje skalę, której nie ma (lazur)' },
  { od: 5, typ: 'value-mismatch', kategoria: 'ARCHITECTURAL', severity: 'P2', sciezka: 'rdzen.wewnetrzne.przelamanie-male', zastosuj: (v) => { v.set('rdzen/wewnetrzne/przelamanie-male', wariant('rdzen/wewnetrzne/przelamanie-male', 'Prymitywy', 'FLOAT', { Jasny: { value: 600, unit: 'px' } })) }, opis: 'Projektant odtworzył próg przełamania z inną wartością — obszar modelowany wyłącznie w kodzie' },
  { od: 5, typ: 'value-mismatch', kategoria: 'ARCHITECTURAL', severity: 'P2', sciezka: 'rdzen.wewnetrzne.przelamanie-srednie', zastosuj: (v) => { v.set('rdzen/wewnetrzne/przelamanie-srednie', wariant('rdzen/wewnetrzne/przelamanie-srednie', 'Prymitywy', 'FLOAT', { Jasny: { value: 900, unit: 'px' } })) }, opis: 'Jak wyżej' },
  { od: 5, typ: 'missing-in-canonical', kategoria: 'ARCHITECTURAL', severity: 'P2', sciezka: 'rdzen.wewnetrzne.siatka-marginesy', zastosuj: (v) => { v.set('rdzen/wewnetrzne/siatka-marginesy', wariant('rdzen/wewnetrzne/siatka-marginesy', 'Prymitywy', 'FLOAT', { Jasny: { value: 24, unit: 'px' } })) }, opis: 'Zmienna wymyślona w źródle w obszarze modelowanym wyłącznie w kodzie' },
  { od: 5, typ: 'missing-in-canonical', kategoria: 'ARCHITECTURAL', severity: 'P2', sciezka: 'rdzen.wewnetrzne.przelamanie-olbrzymie', zastosuj: (v) => { v.set('rdzen/wewnetrzne/przelamanie-olbrzymie', wariant('rdzen/wewnetrzne/przelamanie-olbrzymie', 'Prymitywy', 'FLOAT', { Jasny: { value: 1600, unit: 'px' } })) }, opis: 'Jak wyżej' },
  { od: 5, typ: 'mode-incomplete', kategoria: 'ASSUMPTION', severity: 'P2', sciezka: 'rdzen.color.blekit-500@Jasny↔Okolicznosciowy', powod: 'empty-mode', zastosuj: (v) => { v.get('rdzen/color/blekit-500').valuesByMode.Okolicznosciowy = null }, opis: 'Tryb okolicznościowy założony, niedomknięty (założenie, nie błąd)' },
  { od: 5, typ: 'mode-incomplete', kategoria: 'ASSUMPTION', severity: 'P2', sciezka: 'rdzen.color.zielen-500@Jasny↔Okolicznosciowy', powod: 'empty-mode', zastosuj: (v) => { v.get('rdzen/color/zielen-500').valuesByMode.Okolicznosciowy = null }, opis: 'Jak wyżej' },
  { od: 5, typ: 'mode-incomplete', kategoria: 'ASSUMPTION', severity: 'P2', sciezka: 'rdzen.color.bursztyn-300@Jasny↔Okolicznosciowy', powod: 'placeholder-value', zastosuj: (v) => { v.get('rdzen/color/bursztyn-300').valuesByMode.Okolicznosciowy = '#000000' }, opis: 'Jak wyżej — zaślepka' },
  { od: 5, typ: 'mode-incomplete', kategoria: 'ASSUMPTION', severity: 'P2', sciezka: 'rdzen.color.grafit-700@Jasny↔Okolicznosciowy', powod: 'placeholder-value', zastosuj: (v) => { v.get('rdzen/color/grafit-700').valuesByMode.Okolicznosciowy = '#000000' }, opis: 'Jak wyżej — zaślepka' },

  // miesiąc 6 — stan bieżący
  { od: 6, typ: 'missing-in-figma', kategoria: 'REAL', severity: 'P1', sciezka: 'rdzen.zrodlowe.zorza', zastosuj: (v) => { v.delete('rdzen/zrodlowe/zorza') }, opis: 'Trzeci token przyjęty ze źródła zniknął ze źródła' },
  { od: 6, typ: 'missing-in-canonical', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.rozmiar.odstep-850', zastosuj: (v) => { v.set('rdzen/rozmiar/odstep-850', wariant('rdzen/rozmiar/odstep-850', 'Prymitywy', 'FLOAT', { Jasny: { value: 56, unit: 'px' } })) }, opis: 'Odstęp wymyślony w źródle poza skalą kanonu' },
  { od: 6, typ: 'naming-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.krycie.polowa', zastosuj: (v) => {
    const stary = v.get('rdzen/krycie/polowa'); v.delete('rdzen/krycie/polowa')
    v.set('rdzen.krycie.pollowa', { ...stary, name: 'rdzen.krycie.pollowa' })
  }, opis: 'Druga literówka (podwojone l), nazwa niemapowalna' },
  { od: 6, typ: 'metadata-drift', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.semantic.tekst-podstawowy', powod: 'description-mismatch', zastosuj: (v) => { v.get('rdzen/semantic/tekst-podstawowy').description = 'Kolor tekstu — wersja robocza opisu (rozjechana)' }, opis: 'Opis semantyki rozjechany z kanonem' },
  { od: 6, typ: 'value-mismatch', kategoria: 'REAL', severity: 'P2', sciezka: 'rdzen.warstwa.nakladka', zastosuj: (v) => { v.get('rdzen/warstwa/nakladka').valuesByMode.Jasny = 120 }, opis: 'Warstwa nakładki podniesiona w źródle do 120 (kanon: 100)' },
]

function wariant(name, collection, type, valuesByMode, description) {
  return { name, collection, type, valuesByMode, ...(description ? { description } : {}) }
}

// ---------------------------------------------------------------------------
// Budowa stanów źródła: baza (kanon bez wewnetrzne) + zaburzenia miesięcy ≤ N
// ---------------------------------------------------------------------------

function kolekcjaDla(t) {
  if (t.path.startsWith('rdzen.semantic')) return 'Semantyka'
  if (t.path.startsWith('rdzen.funkcjonalne') || t.path.startsWith('rdzen.komponent')) return 'Kompozycja'
  return 'Prymitywy'
}
function typZrodla(t) {
  if (t.type === 'color') return 'COLOR'
  if (t.type === 'fontFamily') return 'STRING'
  return 'FLOAT'
}

function zbudujZrodlo(miesiac) {
  /** @type {Map<string, any>} */
  const vars = new Map()
  for (const t of tokeny) {
    if (t.path.startsWith('rdzen.wewnetrzne')) continue // modelowane wyłącznie w kodzie
    if (t.path.startsWith('rdzen.propozycje')) continue // kandydaci z piaskownicy — nie ze źródła
    const name = t.path.replaceAll('.', '/')
    const valuesByMode = {}
    if (typeof t.value === 'string' && t.value.startsWith('{')) {
      valuesByMode.Jasny = { aliasOf: t.value.slice(1, -1).replaceAll('.', '/') }
    } else {
      valuesByMode.Jasny = t.value
    }
    if (t.dark !== undefined) valuesByMode.Ciemny = t.dark
    // tokeny spoza ochrony code niosą opis zgodny z kanonem — import przez bramkę
    // scalania ma dać pełne `unchanged` (opis wchodzi do porównania poza ochroną code)
    const opis = t.provenance !== 'code' ? t.desc : undefined
    vars.set(name, wariant(name, kolekcjaDla(t), typZrodla(t), valuesByMode, opis))
  }
  for (const z of ZABURZENIA.filter((z) => z.od <= miesiac)) z.zastosuj(vars)
  return [...vars.values()]
}

// Surowy kształt zrzutu (trasa przyjęcia POST /data-sources/:id/snapshots):
// meta.variableCollections + meta.variables — miesiąc 1, do importu przez bramkę scalania
function zbudujZrzutSurowy(varsy) {
  const kolekcje = {}
  const zmienne = {}
  const kolekcjaId = (nazwa) => `kol-${nazwa.toLowerCase()}`
  const trybId = (nazwa) => `tryb-${nazwa.toLowerCase()}`
  for (const v of varsy) {
    const kid = kolekcjaId(v.collection)
    if (!kolekcje[kid]) {
      kolekcje[kid] = {
        id: kid, name: v.collection, defaultModeId: trybId('Jasny'),
        modes: [{ modeId: trybId('Jasny'), name: 'Jasny' }, { modeId: trybId('Ciemny'), name: 'Ciemny' }],
      }
    }
    const vid = `zm-${v.name.replaceAll('/', '-')}`
    const valuesByMode = {}
    for (const [tryb, wartosc] of Object.entries(v.valuesByMode)) {
      const w = (wartosc && typeof wartosc === 'object' && 'aliasOf' in wartosc)
        ? { type: 'VARIABLE_ALIAS', id: `zm-${wartosc.aliasOf.replaceAll('/', '-')}` }
        : wartosc
      valuesByMode[trybId(tryb)] = w
    }
    zmienne[vid] = {
      id: vid, name: v.name, variableCollectionId: kid,
      resolvedType: v.type, valuesByMode,
      ...(v.description ? { description: v.description } : {}),
    }
  }
  return { meta: { variableCollections: kolekcje, variables: zmienne } }
}

// ---------------------------------------------------------------------------
// Marki: kolekcje lustrzane (model adopcji ze słownikiem nazw per marka)
// ---------------------------------------------------------------------------
// Beta rośnie równo · Gamma stoi wysoko do dostawy z zewnątrz w miesiącu 4,
// po której wierność wyraźnie spada · Alfa jest rdzeniem (wzorzec, zawsze 100).

const luster = (przedrostek, sciezkaRdzenia) => przedrostek + sciezkaRdzenia.slice('rdzen'.length)

// Deterministyczna kolejność przejmowania rdzenia przez Betę: najpierw semantyka
// (najwyższa dźwignia), potem barwy, potem reszta — po prostu stabilny sort z wagą.
const wagaGrupy = (p) =>
  p.startsWith('rdzen.semantic') ? 0
    : p.startsWith('rdzen.color') ? 1
      : p.startsWith('rdzen.rozmiar') ? 2
        : p.startsWith('rdzen.typografia') ? 3 : 4
const kolejnoscAdopcji = [...rdzenObowiazkowy].sort((a, b) => wagaGrupy(a) - wagaGrupy(b) || a.localeCompare(b))

const BETA_POKRYCIE = [112, 130, 148, 166, 184, 194] // z 202 → 55,4 … 96,0
const BETA_ODCHYLENIA = [
  ['rdzen.color.blekit-500', hslHex(230, 70, 52)],
  ['rdzen.color.blekit-600', hslHex(230, 72, 44)],
  ['rdzen.semantic.tekst-link', alias('marka-beta.color.blekit-700')], // alias przepięty na własną skalę — wyrównany w mies. 3
]
// odchylenia Bety: mies. 1–2 → 3 pozycje, od mies. 3 → 2 (jedno wyrównane)
const BETA_ODCH_ILE = [3, 3, 2, 2, 2, 2]
const BETA_DODATKI = [
  ['wlasne.cta-promocyjne', 'color', hslHex(24, 90, 50), 1],
  ['wlasne.akcent-lokalny', 'color', hslHex(210, 40, 40), 3],
  ['wlasne.wyroznik-rynkowy', 'color', hslHex(160, 60, 38), 5],
]

const GAMMA_POKRYCIE = 162 // stałe: marka przejęła 162 z 202 i stoi
const GAMMA_ODCH_BAZOWE = [
  ['rdzen.color.czerwien-500', hslHex(355, 80, 52)],
  ['rdzen.color.czerwien-600', hslHex(355, 82, 44)],
  ['rdzen.semantic.akcja-destrukcyjna', hslHex(355, 82, 44)],
  ['rdzen.color.bursztyn-400', hslHex(36, 92, 56)],
]
// dostawa z zewnątrz (miesiąc 4): przemalowane 39 wspólnych wartości
const GAMMA_DOSTAWA_ILE = 39
const GAMMA_ODCH_ILE = [4, 4, 4, 43, 44, 46]
const GAMMA_DODATKI_ILE = [4, 4, 4, 13, 13, 14]

function zbudujMarke(przedrostek, pokrycie, odchylenia, dodatki, miesiac) {
  const przejete = kolejnoscAdopcji.slice(0, pokrycie)
  const wynik = []
  const odchMapa = new Map(odchylenia)
  for (const sciezkaRdzenia of przejete) {
    const rdzenny = wgSciezki.get(sciezkaRdzenia)
    const wartosc = odchMapa.has(sciezkaRdzenia) ? odchMapa.get(sciezkaRdzenia) : rdzenny.value
    wynik.push({
      path: luster(przedrostek, sciezkaRdzenia), type: rdzenny.type, value: wartosc,
      // lustro utrzymuje zespół marki we własnym repozytorium — pochodzenie z kodu
      provenance: 'code', detail: 'repozytorium zespołu marki',
    })
  }
  for (const [koncowka, typ, wartosc] of dodatki) {
    // dodatki z dostawy zewnętrznej przyszły bez metadanych — pochodzenie nieustalone
    // jest tu INFORMACJĄ (dostawca nie dostarczył rodowodu), nie brakiem danych
    const zDostawy = koncowka.startsWith('wlasne.dostawa-')
    wynik.push({
      path: `${przedrostek}.${koncowka}`, type: typ, value: wartosc,
      provenance: zDostawy ? 'unknown' : 'code',
      detail: zDostawy ? 'dostawa zewnętrzna 2026-06 — metadane nieustalone' : 'repozytorium zespołu marki',
    })
  }
  return wynik
}

function stanBety(miesiac) { // miesiac 1..6
  const odch = BETA_ODCHYLENIA.slice(0, BETA_ODCH_ILE[miesiac - 1])
  const dodatki = BETA_DODATKI.filter(([, , , od]) => od <= miesiac).map(([p, t, w]) => [p, t, w])
  return zbudujMarke('marka-beta', BETA_POKRYCIE[miesiac - 1], odch, dodatki, miesiac)
}

// przemalowania dostawy: deterministycznie pierwsze N wspólnych ścieżek koloru
// spoza odchyleń bazowych (dostawa „ujednoliciła" paletę pod własny gust)
function odchyleniaGammy(miesiac) {
  const bazowe = GAMMA_ODCH_BAZOWE.map(([p, w]) => [p, w])
  const ile = GAMMA_ODCH_ILE[miesiac - 1] - GAMMA_ODCH_BAZOWE.length
  if (ile <= 0) return bazowe
  const przejete = kolejnoscAdopcji.slice(0, GAMMA_POKRYCIE)
  const kandydaci = przejete.filter((p) => p.startsWith('rdzen.color.') && !GAMMA_ODCH_BAZOWE.some(([b]) => b === p))
  const dostawa = kandydaci.slice(0, ile).map((p, i) => [p, hslHex((200 + i * 7) % 360, 45, 47)])
  return [...bazowe, ...dostawa]
}
function dodatkiGammy(miesiac) {
  const ile = GAMMA_DODATKI_ILE[miesiac - 1]
  const wszystkie = [
    ['wlasne.pustynny-piasek', 'color', hslHex(40, 30, 74)],
    ['wlasne.pustynny-zmierzch', 'color', hslHex(20, 55, 40)],
    ['wlasne.oaza', 'color', hslHex(165, 45, 40)],
    ['wlasne.szafran', 'color', hslHex(38, 95, 52)],
    // dostawa z zewnątrz (miesiąc 4): dziewięć samowolnych dodatków
    ['wlasne.dostawa-akcent-1', 'color', hslHex(200, 60, 50)],
    ['wlasne.dostawa-akcent-2', 'color', hslHex(210, 60, 45)],
    ['wlasne.dostawa-akcent-3', 'color', hslHex(220, 60, 40)],
    ['wlasne.dostawa-tlo-1', 'color', hslHex(204, 30, 94)],
    ['wlasne.dostawa-tlo-2', 'color', hslHex(204, 30, 88)],
    ['wlasne.dostawa-obwodka', 'color', hslHex(204, 25, 78)],
    ['wlasne.dostawa-tekst', 'color', hslHex(208, 35, 22)],
    ['wlasne.dostawa-cien', 'color', hslHex(208, 40, 12)],
    ['wlasne.dostawa-wyroznik', 'color', hslHex(6, 70, 50)],
    // miesiąc 6: jeszcze jeden dodatek zespołu marki
    ['wlasne.znacznik-kampanii', 'color', hslHex(290, 50, 45)],
  ]
  return wszystkie.slice(0, ile)
}
function stanGammy(miesiac) {
  return zbudujMarke('marka-gamma', GAMMA_POKRYCIE, odchyleniaGammy(miesiac), dodatkiGammy(miesiac), miesiac)
}

// ---------------------------------------------------------------------------
// Pomiar pokrycia komponentów: 38 definicji, 6 stanów (rosnąca adopcja)
// ---------------------------------------------------------------------------
// Model: definicja → properta → miesiąc związania (0 = nigdy). Klasyfikacja
// wynika z silnika platformy; tu tylko dane wejściowe present/bound.

const DEFINICJE = [
  // [slug, nazwa, [properta, obecna-od, związana-od(0=nigdy)][]]
  ['przycisk', 'Przycisk', [['fill', 1, 1], ['cornerRadius', 1, 1], ['paddingLeft', 1, 2], ['paddingRight', 1, 2]]],
  ['przycisk-drugorzedny', 'Przycisk drugorzędny', [['fill', 1, 1], ['stroke', 1, 2], ['cornerRadius', 1, 2]]],
  ['przycisk-ikonowy', 'Przycisk ikonowy', [['fill', 1, 3], ['cornerRadius', 1, 3]]],
  ['pole-tekstowe', 'Pole tekstowe', [['fill', 1, 2], ['stroke', 1, 2], ['cornerRadius', 1, 3], ['paddingLeft', 1, 3], ['paddingRight', 1, 3]]],
  ['pole-liczbowe', 'Pole liczbowe', [['fill', 1, 3], ['stroke', 1, 3], ['cornerRadius', 1, 4]]],
  ['pole-wyboru', 'Pole wyboru', [['fill', 1, 2], ['stroke', 1, 3], ['cornerRadius', 1, 3]]],
  ['pole-daty', 'Pole daty', [['fill', 1, 4], ['stroke', 1, 4], ['cornerRadius', 1, 5]]],
  ['lista-rozwijana', 'Lista rozwijana', [['fill', 1, 3], ['stroke', 1, 4], ['cornerRadius', 1, 4]]],
  ['przelacznik', 'Przełącznik', [['fill', 1, 2], ['cornerRadius', 1, 2]]],
  ['suwak', 'Suwak', [['fill', 1, 4], ['cornerRadius', 1, 5]]],
  ['karta', 'Karta', [['fill', 1, 1], ['stroke', 1, 3], ['cornerRadius', 1, 3], ['paddingTop', 1, 4], ['paddingBottom', 1, 4]]],
  ['karta-produktu', 'Karta produktu', [['fill', 1, 2], ['stroke', 1, 4], ['cornerRadius', 1, 4], ['paddingTop', 1, 5]]],
  ['tabela', 'Tabela', [['fill', 1, 3], ['stroke', 1, 4]]],
  ['wiersz-tabeli', 'Wiersz tabeli', [['fill', 1, 3], ['stroke', 1, 5]]],
  ['znacznik', 'Znacznik', [['fill', 1, 2], ['cornerRadius', 1, 2], ['paddingLeft', 1, 3], ['paddingRight', 1, 3]]],
  ['plakietka', 'Plakietka', [['fill', 1, 3], ['cornerRadius', 1, 3]]],
  ['awatar', 'Awatar', [['fill', 1, 4], ['cornerRadius', 1, 4]]],
  ['okno-dialogowe', 'Okno dialogowe', [['fill', 1, 3], ['cornerRadius', 1, 4], ['paddingTop', 1, 5], ['paddingBottom', 1, 5]]],
  ['panel-boczny', 'Panel boczny', [['fill', 1, 4], ['stroke', 1, 5]]],
  ['naglowek-strony', 'Nagłówek strony', [['fill', 1, 2], ['stroke', 1, 4]]],
  ['stopka', 'Stopka', [['fill', 1, 4], ['stroke', 1, 6]]],
  ['powiadomienie', 'Powiadomienie', [['fill', 1, 3], ['stroke', 1, 4], ['cornerRadius', 1, 4]]],
  ['pasek-postepu', 'Pasek postępu', [['fill', 1, 5], ['cornerRadius', 1, 5]]],
  ['wskaznik-ladowania', 'Wskaźnik ładowania', [['fill', 1, 5]]],
  ['zakladki', 'Zakładki', [['fill', 1, 4], ['stroke', 1, 5]]],
  ['okruszki', 'Okruszki', [['fill', 1, 5]]],
  ['stronicowanie', 'Stronicowanie', [['fill', 1, 5], ['cornerRadius', 1, 6]]],
  ['podpowiedz', 'Podpowiedź', [['fill', 1, 5], ['cornerRadius', 1, 6]]],
  ['dymek', 'Dymek', [['fill', 1, 6], ['cornerRadius', 1, 6]]],
  ['menu-kontekstowe', 'Menu kontekstowe', [['fill', 1, 6], ['cornerRadius', 1, 0]]],
  ['pusty-stan', 'Pusty stan', [['fill', 1, 6], ['opacity', 1, 0]]],
  ['baner', 'Baner', [['fill', 1, 0], ['opacity', 1, 0]]],
  ['baner-promocyjny', 'Baner promocyjny', [['fill', 1, 0], ['cornerRadius', 1, 0]]],
  ['sekcja-powitalna', 'Sekcja powitalna', [['fill', 1, 0], ['paddingTop', 1, 0]]],
  ['separator', 'Separator', [['stroke', 1, 0]]],
  ['ikona', 'Ikona', [['fill', 1, 1]]],
  ['przycisk-stary', 'Przycisk_LEGACY', [['fill', 1, 1]]],
  ['baner-stary', 'Baner_LEGACY', [['fill', 1, 0]]],
]

function zbudujPokrycie(miesiac) {
  return {
    comment: `Wejście pomiaru pokrycia — stan ${OKRESY[miesiac - 1]}. Klasyfikację liczy silnik platformy (G0/G1/G2, agregacja STRICT per definicja).`,
    fileHasVariables: true,
    definitions: DEFINICJE.map(([slug, nazwa, props]) => ({
      ref: slug,
      name: nazwa,
      nodes: [{
        props: Object.fromEntries(
          props
            .filter(([, obecnaOd]) => obecnaOd <= miesiac)
            .map(([p, , zwiazanaOd]) => [p, { present: true, bound: zwiazanaOd !== 0 && zwiazanaOd <= miesiac }]),
        ),
      },
      // poddrzewo zagnieżdżonej instancji — wyłączone z liczenia (własny master)
      ...(slug === 'karta' ? [{ nestedInstance: true, props: { fill: { present: true, bound: false } } }] : []),
      ],
    })),
  }
}

// ---------------------------------------------------------------------------
// Skaner komponentów rejestr-vs-stan: oczekiwania + inwentarz (stan bieżący)
// ---------------------------------------------------------------------------

// Jeden wspólny model komponentów — z niego wynikają: rejestr oczekiwań skanera,
// inwentarz stanu (z zasianymi rozbieżnościami), surowy zrzut komponentów (referencje
// podglądu projektowego), rejestr produktowy i strony katalogu w treści.
const STATUSY_KOMPONENTOW = { stabilny: 'Stabilny', przygotowanie: 'W przygotowaniu', wycofywany: 'Wycofywany' }
/** @type {Array<{slug:string,nazwa:string,opis:string,status:string,osie?:Record<string,string[]>,platformy?:string[],jednaPlatformaCelowo?:boolean,wymagany?:boolean}>} */
const KOMPONENTY = [
  { slug: 'przycisk', nazwa: 'Przycisk', opis: 'Podstawowy element akcji; trzy odmiany i trzy rozmiary.', status: 'stabilny', osie: { odmiana: ['podstawowa', 'drugorzedna', 'destrukcyjna'], rozmiar: ['maly', 'sredni', 'duzy'] }, platformy: ['www', 'aplikacja'], wymagany: true },
  { slug: 'przycisk-drugorzedny', nazwa: 'Przycisk drugorzędny', opis: 'Akcja towarzysząca; obwódka zamiast wypełnienia.', status: 'stabilny', osie: { rozmiar: ['maly', 'sredni', 'duzy'] } },
  { slug: 'przycisk-ikonowy', nazwa: 'Przycisk ikonowy', opis: 'Akcja wyrażona samą ikoną, z etykietą dla czytników.', status: 'stabilny', osie: { rozmiar: ['maly', 'sredni'] } },
  { slug: 'pole-tekstowe', nazwa: 'Pole tekstowe', opis: 'Wprowadzanie tekstu z etykietą, pomocą i stanem błędu.', status: 'stabilny', osie: { stan: ['zwykly', 'skupienie', 'blad', 'wylaczony'] }, platformy: ['www', 'aplikacja'], wymagany: true },
  { slug: 'pole-liczbowe', nazwa: 'Pole liczbowe', opis: 'Wariant pola dla wartości liczbowych z krokiem.', status: 'stabilny', osie: { stan: ['zwykly', 'blad'] } },
  { slug: 'pole-wyboru', nazwa: 'Pole wyboru', opis: 'Pojedynczy wybór tak/nie w formularzach.', status: 'stabilny', osie: { stan: ['zaznaczone', 'odznaczone', 'nieokreslone'] }, wymagany: true },
  { slug: 'pole-daty', nazwa: 'Pole daty', opis: 'Wybór daty z kalendarzem i walidacją zakresu.', status: 'przygotowanie', osie: { stan: ['zwykly', 'blad'] } },
  { slug: 'lista-rozwijana', nazwa: 'Lista rozwijana', opis: 'Wybór jednej pozycji z listy; wyszukiwanie od ośmiu pozycji.', status: 'stabilny', osie: { stan: ['zwykly', 'otwarta', 'blad'] }, wymagany: true },
  { slug: 'przelacznik', nazwa: 'Przełącznik', opis: 'Natychmiastowa zmiana ustawienia; nie wymaga zapisu.', status: 'stabilny', osie: { stan: ['wlaczony', 'wylaczony'] }, platformy: ['www', 'aplikacja'], wymagany: true },
  { slug: 'suwak', nazwa: 'Suwak', opis: 'Wybór wartości z zakresu; obsługa klawiaturą strzałkami.', status: 'przygotowanie', osie: { stan: ['zwykly', 'wylaczony'] } },
  { slug: 'karta', nazwa: 'Karta', opis: 'Powierzchnia grupująca treść jednego tematu.', status: 'stabilny', osie: { uklad: ['pionowy', 'poziomy'] }, jednaPlatformaCelowo: true, wymagany: true },
  { slug: 'karta-produktu', nazwa: 'Karta produktu', opis: 'Karta z obrazem, ceną i akcją; wariant siatki i listy.', status: 'stabilny', osie: { uklad: ['siatka', 'lista'] } },
  { slug: 'tabela', nazwa: 'Tabela', opis: 'Dane tabelaryczne z sortowaniem i wierszem naprzemiennym.', status: 'stabilny' },
  { slug: 'wiersz-tabeli', nazwa: 'Wiersz tabeli', opis: 'Element pomocniczy tabeli; nie używać samodzielnie.', status: 'stabilny' },
  { slug: 'znacznik', nazwa: 'Znacznik', opis: 'Krótka etykieta stanu lub kategorii.', status: 'stabilny', osie: { ton: ['neutralny', 'sukces', 'ostrzezenie', 'blad'] }, wymagany: true },
  { slug: 'plakietka', nazwa: 'Plakietka', opis: 'Licznik lub wskaźnik nowości przy elemencie nawigacji.', status: 'stabilny', osie: { ton: ['neutralny', 'akcent'] } },
  { slug: 'awatar', nazwa: 'Awatar', opis: 'Reprezentacja osoby lub zespołu; inicjały przy braku obrazu.', status: 'stabilny', osie: { rozmiar: ['maly', 'sredni', 'duzy'] } },
  { slug: 'okno-dialogowe', nazwa: 'Okno dialogowe', opis: 'Przerwanie przepływu wymagające decyzji; pułapka skupienia.', status: 'stabilny', osie: { rozmiar: ['male', 'srednie', 'duze'] }, platformy: ['www', 'aplikacja'], wymagany: true },
  { slug: 'panel-boczny', nazwa: 'Panel boczny', opis: 'Treść pomocnicza wsuwana z krawędzi ekranu.', status: 'stabilny', osie: { strona: ['lewa', 'prawa'] } },
  { slug: 'naglowek-strony', nazwa: 'Nagłówek strony', opis: 'Tytuł, okruszki i akcje kontekstowe strony.', status: 'stabilny' },
  { slug: 'stopka', nazwa: 'Stopka', opis: 'Zamknięcie strony: nawigacja pomocnicza i informacje prawne.', status: 'stabilny' },
  { slug: 'powiadomienie', nazwa: 'Powiadomienie', opis: 'Komunikat o wyniku operacji; cztery tony.', status: 'stabilny', osie: { ton: ['informacja', 'sukces', 'ostrzezenie', 'blad'] }, wymagany: true },
  { slug: 'pasek-postepu', nazwa: 'Pasek postępu', opis: 'Postęp operacji o znanym czasie trwania.', status: 'stabilny', osie: { stan: ['w-toku', 'ukonczony'] } },
  { slug: 'wskaznik-ladowania', nazwa: 'Wskaźnik ładowania', opis: 'Operacja o nieznanym czasie; szanuje ograniczenie ruchu.', status: 'stabilny' },
  { slug: 'zakladki', nazwa: 'Zakładki', opis: 'Przełączanie widoków tej samej treści.', status: 'stabilny', osie: { uklad: ['poziomy', 'pionowy'] } },
  { slug: 'okruszki', nazwa: 'Okruszki', opis: 'Ścieżka położenia w hierarchii serwisu.', status: 'stabilny' },
  { slug: 'stronicowanie', nazwa: 'Stronicowanie', opis: 'Nawigacja po stronach długich list.', status: 'stabilny' },
  { slug: 'podpowiedz', nazwa: 'Podpowiedź', opis: 'Krótkie wyjaśnienie elementu po najechaniu lub skupieniu.', status: 'stabilny' },
  { slug: 'dymek', nazwa: 'Dymek', opis: 'Rozbudowana treść kontekstowa zakotwiczona przy elemencie.', status: 'przygotowanie' },
  { slug: 'menu-kontekstowe', nazwa: 'Menu kontekstowe', opis: 'Lista akcji dla wskazanego elementu.', status: 'przygotowanie' },
  { slug: 'pusty-stan', nazwa: 'Pusty stan', opis: 'Widok bez danych: wyjaśnienie i pierwsza akcja.', status: 'stabilny' },
  { slug: 'baner', nazwa: 'Baner', opis: 'Komunikat na poziomie całego serwisu.', status: 'wycofywany' },
  { slug: 'sekcja-powitalna', nazwa: 'Sekcja powitalna', opis: 'Otwarcie strony startowej produktu.', status: 'przygotowanie' },
  { slug: 'separator', nazwa: 'Separator', opis: 'Wizualne rozdzielenie grup treści.', status: 'stabilny' },
  { slug: 'ikona', nazwa: 'Ikona', opis: 'Osadzenie ikony z obowiązkową etykietą znaczeniową.', status: 'stabilny' },
]

// Rejestr oczekiwań: wszystkie komponenty modelu + dwa oczekiwania bez pokrycia w stanie
// (jedno WYMAGANE → P0, jedno opcjonalne → P1) — luka rejestr-vs-stan w obu wagach.
const OCZEKIWANIA = [
  ...KOMPONENTY.map((k) => ({
    slug: k.slug,
    required: k.wymagany ?? false,
    requiredVariants: k.osie
      ? Object.entries(k.osie).flatMap(([os, wartosci]) => wartosci.map((w) => ({ [os]: w })))
      : [],
    platforms: k.platformy ?? ['www'],
    intentionalSinglePlatform: k.jednaPlatformaCelowo ?? !(k.platformy && k.platformy.length > 1),
    libraryRef: 'bib-rdzen',
    helper: k.slug === 'wiersz-tabeli' || k.slug === 'separator',
  })),
  { slug: 'pole-wyszukiwania', required: true, requiredVariants: [{ stan: 'zwykly' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'krokownica', required: false, requiredVariants: [{ krok: 'pierwszy' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
]

// Inwentarz stanu: rodziny wg modelu z celowo zasianymi rozbieżnościami.
const BRAKUJACE_WARIANTY = {
  przycisk: new Set(['odmiana=destrukcyjna']),        // MISSING_VARIANT
  powiadomienie: new Set(['ton=blad']),               // MISSING_VARIANT
  'okno-dialogowe': new Set(['rozmiar=duze']),        // MISSING_VARIANT
}
const BRAK_PLATFORMY = new Set(['przycisk', 'okno-dialogowe']) // PLATFORM_MISSING (kontrakt www+aplikacja, stan tylko www)
const INWENTARZ = {
  families: [
    ...KOMPONENTY.map((k) => {
      const osie = k.osie ?? {}
      const brakujace = BRAKUJACE_WARIANTY[k.slug] ?? new Set()
      const warianty = Object.entries(osie).flatMap(([os, wartosci]) =>
        wartosci
          .filter((w) => !brakujace.has(`${os}=${w}`))
          .map((w) => ({ name: `${os}=${w}`, axes: { [os]: w } })),
      )
      // nadmiarowy wariant pola tekstowego → EXTRA_VARIANT
      if (k.slug === 'pole-tekstowe') warianty.push({ name: 'stan=eksperymentalny', axes: { stan: 'eksperymentalny' } })
      return {
        slug: k.slug,
        platforms: BRAK_PLATFORMY.has(k.slug) ? ['www'] : (k.platformy ?? ['www']),
        variants: warianty.length ? warianty : [{ name: 'domyslny', axes: {} }],
      }
    }),
    // rodziny bez wpisu w rejestrze → EXTRA_COMPONENT ×2
    { slug: 'eksperyment-zespolu', platforms: ['www'], variants: [{ name: 'a', axes: {} }] },
    { slug: 'kafelek-promocyjny', platforms: ['www'], variants: [{ name: 'domyslny', axes: {} }] },
  ],
  instances: [
    { id: 'inst-001', familySlug: 'przycisk', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-002', familySlug: 'karta', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-003', familySlug: 'pole-tekstowe', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-004', familySlug: 'znacznik', masterExists: false, libraryRef: null, topLevel: true },   // odpięta instancja → DETACHED_INSTANCE (P0)
    { id: 'inst-005', familySlug: 'okruszki', masterExists: false, libraryRef: null, topLevel: true },   // odpięta instancja → DETACHED_INSTANCE (P0)
    { id: 'inst-006', familySlug: 'przycisk', masterExists: true, libraryRef: 'bib-obca', topLevel: true }, // biblioteka spoza kontraktu → WRONG_LIBRARY
    { id: 'inst-007', familySlug: 'eksperyment-zespolu', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true }, // master jest, rejestru brak → INTERNAL_UNREGISTERED
    { id: 'inst-008', familySlug: 'kafelek-promocyjny', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },  // master jest, rejestru brak → INTERNAL_UNREGISTERED
    { id: 'inst-009', familySlug: 'tabela', masterExists: true, libraryRef: 'bib-rdzen', topLevel: false }, // nie top-level — nieliczona
  ],
}

// Surowy zrzut komponentów (kształt odpowiedzi API narzędzia projektowego) — wejście
// importu referencji podglądu projektowego (design_component_ref) realną trasą.
function zbudujKomponentySurowe() {
  const components = []
  const componentSets = []
  for (const k of KOMPONENTY) {
    if (k.osie && Object.keys(k.osie).length) {
      const setNode = `wezel-${k.slug}`
      componentSets.push({
        key: `kmp-${k.slug}`, node_id: setNode, name: k.nazwa,
        description: k.opis, thumbnail_url: null,
      })
      for (const [os, wartosci] of Object.entries(k.osie)) {
        for (const wartosc of wartosci) {
          components.push({
            key: `kmp-${k.slug}-${os}-${wartosc}`, node_id: `wezel-${k.slug}-${os}-${wartosc}`,
            name: `${os}=${wartosc}`, description: '', thumbnail_url: null,
            containing_frame: { containingStateGroup: { nodeId: setNode } },
          })
        }
      }
    } else {
      components.push({
        key: `kmp-${k.slug}`, node_id: `wezel-${k.slug}`, name: k.nazwa,
        description: k.opis, thumbnail_url: null,
      })
    }
  }
  return {
    comment: 'Surowy zrzut komponentów źródła projektowego (zestawy wariantów + komponenty samodzielne) — wejście importu referencji podglądu (kind=component_tree).',
    kind: 'component_tree',
    payload: {
      components: { meta: { components } },
      componentSets: { meta: { component_sets: componentSets } },
    },
  }
}

// ---------------------------------------------------------------------------
// Pary kontrastu (bramka jakości): 12 par, jedna celowo poniżej progu AA
// ---------------------------------------------------------------------------

const PARY_KONTRASTU = [
  { pairKey: 'tekst-podstawowy-na-stronie', textColorPath: 'rdzen.semantic.tekst-podstawowy', bgColorPath: 'rdzen.semantic.tlo-strona', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'tekst-podstawowy-na-powierzchni', textColorPath: 'rdzen.semantic.tekst-podstawowy', bgColorPath: 'rdzen.semantic.tlo-powierzchnia', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'tekst-drugorzedny-na-stronie', textColorPath: 'rdzen.semantic.tekst-drugorzedny', bgColorPath: 'rdzen.semantic.tlo-strona', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'tekst-odwrocony-na-akcji', textColorPath: 'rdzen.semantic.tekst-odwrocony', bgColorPath: 'rdzen.semantic.akcja-podstawowa', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'link-na-stronie', textColorPath: 'rdzen.semantic.tekst-link', bgColorPath: 'rdzen.semantic.tlo-strona', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'blad-tresc-na-tle', textColorPath: 'rdzen.semantic.stan-blad-tresc', bgColorPath: 'rdzen.semantic.stan-blad-tlo', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'sukces-tresc-na-tle', textColorPath: 'rdzen.semantic.stan-sukces-tresc', bgColorPath: 'rdzen.semantic.stan-sukces-tlo', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'ostrzezenie-tresc-na-tle', textColorPath: 'rdzen.semantic.stan-ostrzezenie-tresc', bgColorPath: 'rdzen.semantic.stan-ostrzezenie-tlo', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'informacja-tresc-na-tle', textColorPath: 'rdzen.semantic.stan-informacja-tresc', bgColorPath: 'rdzen.semantic.stan-informacja-tlo', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'tekst-negatywny-na-stronie', textColorPath: 'rdzen.semantic.tekst-negatywny', bgColorPath: 'rdzen.semantic.tlo-strona', textSize: 'normal', oczekiwane: 'PASS' },
  { pairKey: 'obwodka-skupienia-na-stronie', textColorPath: 'rdzen.semantic.obwodka-skupienie', bgColorPath: 'rdzen.semantic.tlo-strona', textSize: 'non_text', oczekiwane: 'PASS' },
  // celowo zasiana para poniżej progu — bramka MA się zatrzymać
  { pairKey: 'tekst-wylaczony-na-wyciszonym', textColorPath: 'rdzen.semantic.tekst-wylaczony', bgColorPath: 'rdzen.semantic.tlo-wyciszone', textSize: 'normal', oczekiwane: 'FAIL' },
]

// kontrola projektowa: wyliczone współczynniki muszą dawać zaprojektowany wynik
for (const para of PARY_KONTRASTU) {
  const [tekst, tlo] = [rozwiaz(para.textColorPath), rozwiaz(para.bgColorPath)]
  const wspolczynnik = kontrast(tekst, tlo)
  const prog = para.textSize === 'non_text' ? 3 : 4.5
  const wynik = wspolczynnik >= prog ? 'PASS' : 'FAIL'
  if (wynik !== para.oczekiwane) {
    throw new Error(`Para ${para.key}: wyliczony kontrast ${wspolczynnik.toFixed(2)}:1 daje ${wynik}, projekt zakłada ${para.oczekiwane}`)
  }
  if (para.oczekiwane === 'PASS' && wspolczynnik < prog + 0.3) {
    throw new Error(`Para ${para.key}: margines zbyt mały (${wspolczynnik.toFixed(2)}:1 przy progu ${prog})`)
  }
}

// ---------------------------------------------------------------------------
// Emisja plików
// ---------------------------------------------------------------------------

function zapisz(wzgledna, dane) {
  const pelna = path.join(KATALOG, wzgledna)
  mkdirSync(path.dirname(pelna), { recursive: true })
  writeFileSync(pelna, JSON.stringify(dane, null, 2) + '\n')
  console.log(`  ${wzgledna}`)
}

// kanon DTCG
function emitujKanon() {
  const korzen = {
    $description: 'Kanon zestawu demonstracyjnego — jeden rdzeń, trzy marki. Pełna piramida: prymitywy → semantyka → warstwa funkcjonalna → warstwa komponentowa. Wartości trybu Jasny (referencyjnego); tryb Ciemny w kanon/tryby.json. Metadane w $extensions pod przestrzenią com.example (parametr instalacji, nie wartość zaszyta). Plik wygenerowany: scripts/generuj.mjs.',
  }
  for (const t of tokeny) {
    const segmenty = t.path.split('.')
    let wezel = korzen
    for (const s of segmenty.slice(0, -1)) {
      wezel[s] = wezel[s] ?? {}
      wezel = wezel[s]
    }
    const ext = {
      [`${NS}.provenance`]: t.provenance,
      [`${NS}.status`]: t.status,
      ...(t.layer ? { [`${NS}.layer`]: t.layer } : {}),
    }
    for (const [k, v] of Object.entries(t.extra ?? {})) ext[`${NS}.${k}`] = v
    wezel[segmenty.at(-1)] = {
      $type: t.type,
      $value: t.value,
      ...(t.desc ? { $description: t.desc } : {}),
      $extensions: ext,
    }
  }
  zapisz('kanon/tokeny.dtcg.json', korzen)
}

function emitujTryby() {
  const ciemny = {}
  for (const t of tokeny) if (t.dark !== undefined) ciemny[t.path] = t.dark
  zapisz('kanon/tryby.json', {
    comment: 'Wartości trybów innych niż referencyjny (Jasny żyje w kanon/tokeny.dtcg.json jako wartość bazowa tokenu). Struktura: nazwa trybu → ścieżka → wartość. Plik wygenerowany.',
    Ciemny: ciemny,
  })
}

function emitujMarki() {
  zapisz('kanon/marki.json', {
    comment: 'Trzy marki na JEDNYM rdzeniu — nazwy neutralne (biała etykieta). Alfa = marka bazowa (wzorzec, jej wiersze to kanon). Nakładki motywów różnicują marki WIZUALNIE (witryna, przełączanie); ADOPCJĘ mierzą kolekcje lustrzane marek (marki/beta, marki/gamma) importowane trasą produktu i dopasowywane słownikiem nazw.',
    marki: [
      { name: 'Marka Alfa', marketCode: 'pl', rola: 'rdzen' },
      { name: 'Marka Beta', marketCode: 'de', rola: 'rosnie-rowno' },
      {
        name: 'Marka Gamma', marketCode: 'ae', rola: 'spada-po-dostawie',
        themeOverrides: {
          'rdzen.color.blekit-600': hslHex(348, 62, 40),
          'rdzen.color.blekit-700': hslHex(348, 64, 33),
          'rdzen.color.bursztyn-500': hslHex(28, 90, 52),
        },
      },
    ],
  })
}

// ---------------------------------------------------------------------------
// Treść demonstracyjna: pełna witryna design systemu (42 strony w 6 sekcjach),
// używająca KAŻDEGO typu bloku obsługiwanego przez renderer witryny.
// ---------------------------------------------------------------------------

// Identyfikator URL strony: kontrakt witryny czyta uid jako część PRZED pierwszym
// myślnikiem ([02 §5.1.1]), więc uid musi być bez myślników — deterministyczny hasz sluga.
function uidDla(slug) {
  let h = 5381
  for (const ch of slug) h = ((h * 33) ^ ch.codePointAt(0)) >>> 0
  return 'p' + h.toString(36).padStart(7, '0')
}
const slugifyNazwa = (nazwa) => nazwa.toLowerCase().replaceAll(/[^a-z0-9ąćęłńóśźż]+/g, '-').replaceAll(/^-+|-+$/g, '')
  .replaceAll('ą','a').replaceAll('ć','c').replaceAll('ę','e').replaceAll('ł','l').replaceAll('ń','n')
  .replaceAll('ó','o').replaceAll('ś','s').replaceAll('ź','z').replaceAll('ż','z')
const adresStrony = (slug, nazwa) => `/system-demonstracyjny/v/latest/p/${uidDla(slug)}-${slugifyNazwa(nazwa)}`

// Pomocnicy ProseMirror (kształt, który rozumieją edytor i renderer witryny)
const t = (tekst) => ({ type: 'text', text: tekst })
const p = (...tresc) => ({ type: 'paragraph', content: tresc.map((x) => (typeof x === 'string' ? t(x) : x)) })
const naglowekPM = (poziom, tekst) => ({ type: 'heading', attrs: { level: poziom }, content: [t(tekst)] })
const lp = (...pozycje) => ({ type: 'bulletList', content: pozycje.map((x) => ({ type: 'listItem', content: [p(x)] })) })
const cytatPM = (tekst) => ({ type: 'blockquote', content: [p(tekst)] })
const komorka = (typ, tekst) => ({ type: typ, content: [p(tekst)] })
const tabelaPM = (naglowki, wiersze) => ({
  type: 'table',
  content: [
    { type: 'tableRow', content: naglowki.map((n) => komorka('tableHeader', n)) },
    ...wiersze.map((w) => ({ type: 'tableRow', content: w.map((kom) => komorka('tableCell', kom)) })),
  ],
})
const doc = (...wezly) => ({ type: 'doc', content: wezly })

// Pomocnicy bloków (kształt: {kind, config?, contentRich?, header?})
const tekstB = (...wezly) => ({ kind: 'text', contentRich: doc(...wezly.map((x) => (typeof x === 'string' ? p(x) : x))) })
const naglowekB = (tekst, poziom = 2) => ({ kind: 'heading', contentRich: doc(naglowekPM(poziom, tekst)) })
const listaB = (...pozycje) => ({ kind: 'list', contentRich: doc(lp(...pozycje)) })
const cytatB = (tekst) => ({ kind: 'blockquote', contentRich: doc(cytatPM(tekst)) })
const tabelaB = (naglowki, wiersze) => ({ kind: 'table', contentRich: doc(tabelaPM(naglowki, wiersze)) })
const calloutB = (styl, tekst) => ({ kind: 'callout', config: { calloutStyle: styl }, contentRich: doc(p(tekst)) })
const separatorB = () => ({ kind: 'divider' })
const kodB = (jezyk, kod, podpis) => ({ kind: 'code_snippet', config: { language: jezyk, ...(podpis ? { caption: podpis } : {}) }, contentRich: doc(p(kod)) })
const markdownB = (source) => ({ kind: 'markdown', config: { source } })
const kafelkiB = (...tiles) => ({ kind: 'shortcut_tiles', config: { tiles } })
const dodontB = (...pairs) => ({
  kind: 'guidelines_dodont',
  config: { pairs: pairs.map(([tak, nie, podpisTak, podpisNie]) => ({ do: doc(p(tak)), dont: doc(p(nie)), ...(podpisTak ? { doCaption: podpisTak } : {}), ...(podpisNie ? { dontCaption: podpisNie } : {}) })) },
})
const tokenyB = (groupPath, columns = ['name', 'value', 'description'], naglowek) => ({
  kind: 'tokens',
  config: { kolekcjaNazwa: 'rdzen', groupPath, columns },
  ...(naglowek ? { header: { title: naglowek }, showHeader: true } : {}),
})
const statusyB = () => ({ kind: 'status_table', config: { scope: 'all' } })
const notyB = () => ({ kind: 'release_notes', config: { versionScope: 'all' } })
const storybookB = (storyId) => ({ kind: 'storybook_embed', config: { url: 'https://storybook.demo.example', storyId, height: 360 }, header: { title: 'Osadzenie Storybooka', description: 'Adres przykładowy — w instalacji klienta wskazuje jego opublikowanego Storybooka.' }, showHeader: true })
const embedB = (url, provider, naglowek) => ({ kind: 'embed', config: { url, provider, aspectRatio: '16:9' }, ...(naglowek ? { header: { title: naglowek }, showHeader: true } : {}) })
// bloki odroczone — konfigurację uzupełnia zasiew po utworzeniu źródła danych i zasobów
const designB = (slug, pokazWarianty = true) => ({ kind: 'design', odroczony: { figmaNodeRef: `kmp-${slug}`, display: 'image', showVariants: pokazWarianty } })
const galeriaB = (...items) => ({ kind: 'image_gallery', odroczony: { galeria: items.map(([zasob, alt, caption]) => ({ zasob, alt, ...(caption ? { caption } : {}) })) } })
const zalacznikiB = (...items) => ({ kind: 'attachments', odroczony: { zalaczniki: items.map(([zasob, name]) => ({ zasob, name })) } })

// Strona komponentu generowana z modelu (strony wzorcowe kind=pattern)
function stronaKomponentu(k) {
  const bloki = [
    tekstB(k.opis),
    designB(k.slug, Boolean(k.osie)),
  ]
  if (k.osie) {
    bloki.push(tabelaB(
      ['Właściwość', 'Wartości'],
      Object.entries(k.osie).map(([os, wartosci]) => [os, wartosci.join(', ')]),
    ))
  }
  bloki.push(
    naglowekB('Zasady użycia', 2),
    listaB(
      `Używaj komponentu ${k.nazwa.toLowerCase()} wyłącznie przez bibliotekę — kopiowanie warstw odpina instancję od rejestru.`,
      'Wszystkie barwy i odstępy pochodzą z tokenów warstwy komponentowej; wartości surowe wykryje skan rozjazdu.',
      'Stany interakcji (najechanie, skupienie, wyłączenie) należą do komponentu; produkt ich nie dokleja.',
    ),
  )
  if (k.status === 'wycofywany') {
    bloki.push(calloutB('warning', 'Komponent wycofywany: nie używaj go w nowych widokach. Następca wskazany w dzienniku zmian.'))
  }
  return {
    uid: uidDla(`k-${k.slug}`),
    name: k.nazwa,
    kind: 'pattern',
    komponent: k.slug,
    statusKomponentu: STATUSY_KOMPONENTOW[k.status],
    introduction: k.opis,
    bloki,
  }
}

// Komponenty ze stronami wzorcowymi (bez elementów pomocniczych i strony wzorcowej przycisku)
const KOMPONENTY_ZE_STRONAMI = KOMPONENTY.filter((k) => !['wiersz-tabeli', 'separator', 'przycisk'].includes(k.slug))

const TRESC = {
  sekcje: [
    {
      nazwa: 'Start',
      strony: [
        {
          uid: 'wprowadzenie', name: 'Wprowadzenie',
          introduction: 'Czym jest ten system i jak z niego korzystać.',
          bloki: [
            tekstB('Jeden rdzeń semantyczny, trzy marki różniące się wyłącznie wartościami prymitywów. Dokumentacja, którą czytasz, pochodzi w całości z danych zasiewowych i jest renderowana przez witrynę produktu.'),
            kafelkiB(
              { title: 'Podstawy', description: 'Barwa, typografia, odstępy, ruch', url: adresStrony('barwa', 'Barwa') },
              { title: 'Komponenty', description: 'Katalog ze statusami i wariantami', url: adresStrony('katalog-komponentow', 'Katalog komponentów') },
              { title: 'Wytyczne', description: 'Głos, treść, formularze, dostępność', url: adresStrony('glos-i-ton', 'Głos i ton') },
              { title: 'Pomiar', description: 'Skąd biorą się liczby na przeglądzie', url: adresStrony('pomiar-zamiast-opinii', 'Pomiar zamiast opinii') },
            ),
            calloutB('info', 'System jest wielomarkowy: Marka Alfa jest wzorcem, Beta i Gamma utrzymują kolekcje lustrzane dopasowywane słownikiem nazw. Adopcję każdej marki mierzy platforma na jej kolekcji lustrzanej.'),
          ],
        },
        {
          uid: 'jak-korzystac', name: 'Jak korzystać z dokumentacji',
          introduction: 'Mapa dokumentacji i zasady zgłaszania zmian.',
          bloki: [
            tekstB('Dokumentacja ma cztery warstwy: podstawy (tokeny), komponenty (rejestr z kontraktami), wytyczne (decyzje projektowe) i pomiar (stan faktyczny systemu). Każda strona komponentu pokazuje status z rejestru — ten sam, który sprawdza skan.'),
            listaB(
              'Szukasz wartości? Zacznij od strony podstaw z tabelą tokenów danej grupy.',
              'Budujesz widok? Sprawdź stronę komponentu i jego status w katalogu.',
              'Widzisz rozjazd między projektem a dokumentacją? Zgłoś go — skan i tak go wykryje, ale decyzja należy do człowieka.',
              'Chcesz eksperymentować? Załóż piaskownicę: platforma potraktuje twoje zmiany jako kandydatów do rdzenia.',
            ),
            separatorB(),
            tekstB('Strony oznaczone kłódką są widoczne wyłącznie po zalogowaniu. Cała reszta jest publiczna i indeksowalna zgodnie z konfiguracją publikacji.'),
          ],
        },
      ],
    },
    {
      nazwa: 'Podstawy',
      strony: [
        {
          uid: 'barwa', name: 'Barwa',
          introduction: 'Skale prymitywów i role semantyczne barw.',
          bloki: [
            tekstB('Paleta składa się z dziewięciu skal po dziesięć kroków. Produkt nigdy nie używa skal wprost: widoki konsumują wyłącznie role semantyczne, które wskazują prymitywy aliasami. Dzięki temu marka może przemalować system bez dotykania komponentów.'),
            tokenyB('rdzen.semantic', ['name', 'value', 'description'], 'Role semantyczne barw'),
            dodontB(
              ['Używaj ról semantycznych: tekst-podstawowy, tlo-strona, akcja-podstawowa.', 'Nie wskazuj skal wprost: blekit-600 w widoku to rozjazd warstwy.', 'Rola przeżyje zmianę palety.', 'Skan wykryje takie użycie jako layer-mismatch.'],
            ),
            calloutB('warning', 'Trzy tokeny warstwy komponentowej celowo aliasują prymityw z pominięciem roli — zobacz je w widoku tokenów jako rozbieżność warstwy deklarowanej i wyprowadzonej.'),
          ],
        },
        {
          uid: 'typografia', name: 'Typografia',
          introduction: 'Rozmiary, wysokości wiersza i grubości pisma.',
          bloki: [
            tekstB('Skala typograficzna rośnie od 12 do 48 pikseli. Wysokości wiersza są bezjednostkowe, a grubości ograniczone do czterech, żeby uniknąć pseudopogrubień.'),
            tokenyB('rdzen.typografia', ['name', 'value'], 'Prymitywy typografii'),
            tabelaB(
              ['Zastosowanie', 'Rozmiar', 'Wysokość wiersza', 'Grubość'],
              [
                ['Treść podstawowa', 'rozmiar-tresc', 'wysokosc-zwykla', 'grubosc-zwykla'],
                ['Nagłówek sekcji', 'rozmiar-naglowek-2', 'wysokosc-zwarta', 'grubosc-pogrubiona'],
                ['Podpis pod ilustracją', 'rozmiar-podpis', 'wysokosc-zwykla', 'grubosc-zwykla'],
                ['Etykieta przycisku', 'rozmiar-tresc', 'wysokosc-ciasna', 'grubosc-srednia'],
              ],
            ),
          ],
        },
        {
          uid: 'odstepy-i-siatka', name: 'Odstępy i siatka',
          introduction: 'Skala odstępów i progi przełamań układu.',
          bloki: [
            tekstB('Skala odstępów oparta jest na kroku 4 px z zagęszczeniem w dolnym zakresie. Odstępy semantyczne (przylegly, ciasny, zwykly, luzny, sekcja, strona) wskazują skalę aliasami i to ich używają komponenty.'),
            tokenyB('rdzen.rozmiar', ['name', 'value'], 'Prymitywy wymiarów'),
            kodB('css', '.karta {\n  padding: var(--rdzen-semantic-odstep-zwykly);\n  gap: var(--rdzen-semantic-odstep-ciasny);\n}', 'Konsumpcja odstępów semantycznych w kodzie produktu'),
            calloutB('info', 'Progi przełamań układu żyją w grupie wewnetrzne i są konsumowane wyłącznie przez kod. Ich pojawienie się w pliku projektowym skan klasyfikuje jako rozjazd architektoniczny (obszar modelowania wypłynął poza kod).'),
          ],
        },
        {
          uid: 'promienie-i-obwodki', name: 'Promienie i obwódki',
          introduction: 'Zaokrąglenia narożników i grubości obwódek.',
          bloki: [
            tekstB('Trzy promienie semantyczne pokrywają wszystkie przypadki: interakcja (przyciski, pola), powierzchnia (karty, okna) i pełny (znaczniki, awatary). Obwódki mają trzy grubości; skupienie klawiatury używa zawsze obwódki wyraźnej w kolorze obwodka-skupienie.'),
            markdownB('## Zasady\n\n- Promień **interakcji** jest mniejszy niż promień **powierzchni** — element klikalny nie może wyglądać jak karta.\n- Obwódka `cienka` służy separacji, `srednia` — polom formularzy, `gruba` — wyłącznie stanom skupienia.\n- Zaokrąglenie `pelny` tworzy pigułkę; używaj go tylko dla elementów o stałej, niskiej wysokości.'),
          ],
        },
        {
          uid: 'ruch', name: 'Ruch',
          introduction: 'Czasy przejść i zasady ograniczania animacji.',
          bloki: [
            tekstB('Cztery czasy pokrywają wszystkie przejścia: blysk dla mikrointerakcji, szybki dla wejść elementów, zwykly dla paneli, wolny dla przejść całych widoków. Krzywa przejścia jest jedna dla całego systemu.'),
            tokenyB('rdzen.czas', ['name', 'value'], 'Czasy przejść'),
            calloutB('danger', 'Preferencja ograniczonego ruchu jest wiążąca: przy prefers-reduced-motion wszystkie przejścia dekoracyjne są wyłączone, a wskaźnik ładowania zmienia animację na pulsowanie kryciem.'),
          ],
        },
        {
          uid: 'tryby', name: 'Tryby jasny i ciemny',
          introduction: 'Jak działa przełączanie trybów barwnych.',
          bloki: [
            tekstB('Tryb Jasny jest referencyjny. Tryb Ciemny podmienia wartości prymitywów barw na kroki lustrzane tej samej skali; role semantyczne i komponenty nie wiedzą o istnieniu trybów.'),
            tabelaB(
              ['Prymityw', 'Jasny', 'Ciemny'],
              [
                ['grafit-900', 'krok 900 (ciemny)', 'krok 050 (jasny)'],
                ['blekit-600', 'krok 600', 'krok 300'],
                ['biel', 'powierzchnia strony', 'ciemna powierzchnia zastępcza'],
              ],
            ),
            cytatB('Tryb to nie druga paleta do utrzymania, tylko drugi zestaw wartości tych samych tokenów. Jeśli musisz dodać token „na ciemny", role są źle pocięte.'),
          ],
        },
        {
          uid: 'ikony', name: 'Ikony',
          introduction: 'Rozmiary ikon i zasady osadzania.',
          bloki: [
            tekstB('Ikony występują w czterech rozmiarach zgodnych z siatką 4 px. Każda ikona funkcjonalna ma etykietę znaczeniową; ikony dekoracyjne są ukrywane przed czytnikami.'),
            galeriaB(
              ['siatka-ikon', 'Cztery rozmiary ikon na siatce czterech pikseli', 'Rozmiary: mały 16, średni 20, duży 24, wielki 32'],
              ['piramida-tokenow', 'Piramida tokenów: prymitywy, role semantyczne, warstwa funkcjonalna i komponentowa', 'Warstwy piramidy tokenów'],
            ),
            listaB(
              'Ikona w przycisku dziedziczy kolor treści przycisku — nigdy nie ma własnego.',
              'Ikona samodzielna klikalna to przycisk ikonowy, z etykietą dla czytników.',
              'Nie skaluj ikon poza cztery rozmiary; pośrednie wartości łamią siatkę.',
            ),
          ],
        },
        {
          uid: 'dostepnosc', name: 'Dostępność',
          introduction: 'Wymagania WCAG 2.2 AA egzekwowane przez system.',
          bloki: [
            tekstB('Dostępność nie jest wytyczną, tylko bramką: pary kontrastu są zapisane w systemie i sprawdzane silnikiem przy każdym przebiegu. Para poniżej progu zatrzymuje potok publikacji.'),
            listaB(
              'Kontrast tekstu zwykłego co najmniej 4,5:1, dużego i elementów graficznych co najmniej 3:1.',
              'Każdy element interaktywny ma widoczny stan skupienia na obwódce obwodka-skupienie.',
              'Kolor nigdy nie jest jedynym nośnikiem informacji — stanom towarzyszy forma i tekst.',
              'Cele dotyku w aplikacji mają co najmniej 44 na 44 punkty.',
            ),
            cytatB('Jedna para kontrastu w tym zestawie jest celowo poniżej progu — zobacz czerwoną bramkę na ekranie przeglądu. Tak wygląda werdykt, którego dokumentacja sama z siebie nie wyda.'),
          ],
        },
      ],
    },
    {
      nazwa: 'Komponenty',
      strony: [
        {
          uid: 'katalog-komponentow', name: 'Katalog komponentów',
          introduction: 'Wszystkie wzorce ze statusami z rejestru.',
          bloki: [
            tekstB('Statusy w tej tabeli pochodzą z rejestru komponentów — tego samego, wobec którego skan porównuje stan pliku projektowego. Rozbieżności między rejestrem a stanem trafiają do kolejki decyzji.'),
            statusyB(),
          ],
        },
        {
          uid: 'k-przycisk', name: 'Przycisk', kind: 'pattern', komponent: 'przycisk',
          statusKomponentu: 'Stabilny',
          introduction: 'Podstawowy element akcji; strona wzorcowa katalogu.',
          bloki: [
            tekstB('Przycisk wywołuje akcję nazwaną czasownikiem. Trzy odmiany porządkują hierarchię: podstawowa dla akcji głównej (najwyżej jedna na widok), drugorzędna dla towarzyszących, destrukcyjna dla operacji nieodwracalnych.'),
            designB('przycisk'),
            naglowekB('Tokeny komponentu', 2),
            tokenyB('rdzen.komponent', ['name', 'value', 'description'], 'Warstwa komponentowa'),
            naglowekB('Właściwości', 2),
            tabelaB(
              ['Właściwość', 'Typ', 'Domyślna', 'Uwagi'],
              [
                ['odmiana', 'podstawowa · drugorzedna · destrukcyjna', 'podstawowa', 'kontrakt komponentu 1.0.0'],
                ['rozmiar', 'maly · sredni · duzy', 'sredni', 'wysokości 32, 40, 48 px'],
                ['wylaczony', 'logiczna', 'fałsz', 'blokuje akcję, zachowuje etykietę dla czytników'],
              ],
            ),
            kodB('tsx', '<Przycisk odmiana="podstawowa" rozmiar="sredni">\n  Zapisz zmiany\n</Przycisk>', 'Użycie w kodzie produktu'),
            storybookB('komponenty-przycisk--podstawowa'),
            naglowekB('Tak i nie', 2),
            dodontB(
              ['Jedna akcja podstawowa na widok; pozostałe drugorzędne.', 'Dwa przyciski podstawowe obok siebie — hierarchia znika.'],
              ['Etykieta czasownikiem: „Zapisz zmiany", „Usuń konto".', 'Etykieta „OK" albo „Tak" — nie mówi, co się stanie.'],
            ),
            calloutB('info', 'Skan rejestr-vs-stan pilnuje tego komponentu w obu platformach; w danych demonstracyjnych brakuje odmiany destrukcyjnej i platformy aplikacji — oba braki widać w widoku komponentów.'),
          ],
        },
        ...KOMPONENTY_ZE_STRONAMI.map(stronaKomponentu),
      ],
    },
    {
      nazwa: 'Wytyczne',
      strony: [
        {
          uid: 'glos-i-ton', name: 'Głos i ton',
          introduction: 'Jak system mówi do ludzi.',
          bloki: [
            tekstB('Piszemy wprost, po polsku, do jednej osoby. System informuje o stanie faktycznym i nigdy nie obwinia: komunikat błędu mówi, co się stało i co można zrobić dalej.'),
            cytatB('Głos mamy jeden; ton dobieramy do sytuacji. Potwierdzenie może być swobodne, komunikat o utracie danych — nigdy.'),
            dodontB(
              ['„Nie udało się zapisać zmian. Spróbuj ponownie albo wróć później."', '„Wystąpił nieoczekiwany błąd aplikacji nr 500."'],
              ['„Zapisano. Możesz zamknąć to okno."', '„Operacja zakończona sukcesem!!!"'],
            ),
          ],
        },
        {
          uid: 'pisanie-tresci', name: 'Pisanie treści',
          introduction: 'Reguły językowe treści interfejsu.',
          bloki: [
            listaB(
              'Zdania krótkie, strona czynna, czasownik na początku etykiet akcji.',
              'Liczby zapisujemy cyframi; jednostki po odstępie niełamliwym.',
              'Wielka litera tylko na początku etykiety — bez kapitalizacji każdego słowa.',
              'Skróty rozwijamy przy pierwszym użyciu na stronie.',
            ),
            tabelaB(
              ['Kontekst', 'Piszemy', 'Nie piszemy'],
              [
                ['Przycisk zapisu', 'Zapisz zmiany', 'ZAPISZ / Wykonaj'],
                ['Pusty stan listy', 'Nie masz jeszcze projektów', 'Brak danych'],
                ['Potwierdzenie usunięcia', 'Usuń projekt? Tej operacji nie można cofnąć.', 'Czy na pewno? Tak/Nie'],
              ],
            ),
          ],
        },
        {
          uid: 'wzorce-formularzy', name: 'Wzorce formularzy',
          introduction: 'Budowa formularzy z komponentów systemu.',
          bloki: [
            tekstB('Formularz składa się wyłącznie z komponentów warstwy formularza: etykieta nad polem, pomoc pod polem, błąd zamiast pomocy. Walidacja uruchamia się przy opuszczeniu pola, nigdy przy każdym znaku.'),
            kodB('tsx', '<PoleTekstowe\n  etykieta="Adres dostawy"\n  pomoc="Ulica, numer, kod pocztowy"\n  blad={bledy.adres}\n/>', 'Pole z pomocą i miejscem na błąd'),
            calloutB('warning', 'Przycisk wysyłki formularza pozostaje aktywny także przy błędach — blokada przycisku ukrywa problem przed czytnikami ekranu. Błędy pokazujemy przy polach i w podsumowaniu.'),
          ],
        },
        {
          uid: 'dostepnosc-tresci', name: 'Dostępność treści',
          introduction: 'Teksty alternatywne, nagłówki, struktura.',
          bloki: [
            listaB(
              'Tekst alternatywny opisuje funkcję obrazu; wyglądu nie streszcza.',
              'Hierarchia nagłówków bez przeskoków: po h2 przychodzi h3.',
              'Link mówi, dokąd prowadzi; „kliknij tutaj" niczego nie mówi.',
              'Materiał wideo ma napisy i transkrypcję.',
            ),
            embedB('https://nagrania.demo.example/wprowadzenie-do-dostepnosci', 'generic_iframe', 'Nagranie szkoleniowe (adres przykładowy)'),
          ],
        },
      ],
    },
    {
      nazwa: 'Pomiar i źródło prawdy',
      strony: [
        {
          uid: 'pomiar-zamiast-opinii', name: 'Pomiar zamiast opinii',
          introduction: 'Skąd biorą się liczby na ekranie przeglądu.',
          bloki: [
            tekstB('Pokrycie, wierność i dodatki własne liczy kalkulator miar na kolekcjach lustrzanych marek. Rozjazd wykrywa skan zrzutu źródła wobec kanonu. Sześć kolejnych pomiarów układa się w historię: jedna marka rośnie, jedna stoi, jedna spada po dostawie z zewnątrz.'),
            markdownB('## Trzy miary, zawsze razem\n\n| Miara | Pytanie | Niska wartość znaczy |\n|---|---|---|\n| Pokrycie | ile obowiązkowego rdzenia marka ma | lukę do zasypania |\n| Wierność | czy wspólne wartości się zgadzają | odstępstwo do rozstrzygnięcia |\n| Dodatki własne | ile marka wnosi ponad rdzeń | mało: młody rynek; dużo: dojrzały |\n\nWskaźnik zbiorczy jest zabroniony: trzy liczby odpowiadają na trzy różne pytania.'),
            calloutB('info', 'Każdą liczbę z przeglądu można odtworzyć ręcznym przebiegiem silnika na tych samych danych. Liczba, której nie da się odtworzyć, nie ma prawa być na ekranie.'),
          ],
        },
        {
          uid: 'pochodzenie-i-ochrona', name: 'Pochodzenie i ochrona tokenów',
          introduction: 'Rodowód każdego tokenu i co z niego wynika.',
          bloki: [
            tekstB('Każdy token niesie pochodzenie: z kodu, ze źródła projektowego, z propozycji piaskownicy albo nieustalone. Pochodzenie z kodu daje ochronę bezwarunkową — import nie nadpisze takiego tokenu bez decyzji człowieka; próba ląduje w kolejce jako konflikt chroniony.'),
            tabelaB(
              ['Pochodzenie', 'Znaczenie', 'Ochrona przy imporcie'],
              [
                ['code', 'utrzymywany w repozytorium zespołu', 'bezwarunkowa — konflikt wymaga decyzji'],
                ['figma', 'przyjęty z pliku projektowego', 'polityka scalania pole po polu'],
                ['proposed', 'kandydat z piaskownicy lub ekstrakcji', 'czeka na przyjęcie do rdzenia'],
                ['unknown', 'rodowód nieustalony — do wyjaśnienia', 'jak figma; sam wpis jest informacją'],
              ],
            ),
            kodB('json', '"$extensions": {\n  "com.example.provenance": "code",\n  "com.example.layer": "semantic",\n  "com.example.curated": true\n}', 'Metadane pochodzenia w pliku DTCG'),
            calloutB('warning', 'Warstwa deklarowana i wyprowadzona to dwie różne rzeczy: deklarację pisze człowiek, wyprowadzenie liczy graf aliasów. Rozbieżność jest typem rozjazdu — trzy takie tokeny są celowo zasiane w tym zestawie.'),
          ],
        },
        {
          uid: 'rozjazd-i-kolejka', name: 'Rozjazd i kolejka decyzji',
          introduction: 'Co się dzieje, gdy źródło odjeżdża od kanonu.',
          bloki: [
            tekstB('Skan porównuje zrzut zmiennych źródła z kanonem i klasyfikuje każde znalezisko: do naprawy, architektoniczne albo założenie. Silnik niczego nie rozstrzyga sam — każde znalezisko czeka w kolejce na decyzję z kierunkiem prawdy.'),
            listaB(
              'REAL: wartość faktycznie się rozjechała; ktoś musi wskazać, czy prawdą jest kanon, czy źródło.',
              'ARCHITECTURAL: obszar modelowany wyłącznie w kodzie pojawił się w pliku projektowym.',
              'ASSUMPTION: założenie niedomknięte, na przykład tryb-zaślepka; kubełek pytań do rozstrzygnięcia.',
            ),
            calloutB('danger', 'Dwanaście typów rozjazdu wartości plus dziewięć typów rozjazdu komponentów — każdy z własnym priorytetem i trasą. „Wszystko leci jako błąd" to antywzorzec, który ten routing eliminuje.'),
          ],
        },
        {
          uid: 'zasilanie-agentow', name: 'Zasilanie agentów',
          introduction: 'Serwer MCP: system czytelny dla maszyn.',
          bloki: [
            tekstB('Platforma wystawia serwer MCP, przez który agent programistyczny czyta system: tokeny z metadanymi, strony, komponenty ze statusami. Uprawnienia egzekwuje serwer: szkice i strony zablokowane nie wychodzą nigdy, niezależnie od tego, kto pyta.'),
            kodB('json', '{\n  "mcpServers": {\n    "design-system": {\n      "url": "https://twoja-instalacja.example/mcp"\n    }\n  }\n}', 'Konfiguracja klienta MCP'),
            zalacznikiB(['piramida-tokenow', 'piramida-tokenow.svg']),
            calloutB('info', 'Sekcja Agent w studiu pokazuje adres tej instalacji, listę narzędzi i gotowy fragment konfiguracji do skopiowania.'),
          ],
        },
      ],
    },
    {
      nazwa: 'Wydania',
      strony: [
        {
          uid: 'dziennik-zmian', name: 'Dziennik zmian',
          introduction: 'Historia wydań systemu.',
          bloki: [
            tekstB('Każde wydanie zamyka sekcję zmian nieopublikowanych i tworzy niezmienny snapshot wersji. Wpisy poniżej pochodzą z rejestru wydań, nie z ręcznie pisanej listy.'),
            notyB(),
          ],
        },
        {
          uid: 'zasady-wersjonowania', name: 'Zasady wersjonowania',
          introduction: 'Jak numerujemy wydania i co łamie zgodność.',
          bloki: [
            tekstB('Wydania numerujemy semantycznie na podstawie agregatu zmian: usunięcie tokenu lub zmiana typu podnosi wersję główną, nowe tokeny — wersję drugą, zmiany wartości — trzecią. Wpływ liczy silnik z rejestru zmian; autor wydania niczego nie wpisuje ręcznie.'),
            listaB(
              'Zmiana łamiąca w komponencie wymaga nowej wersji głównej kontraktu.',
              'Token wycofywany dostaje datę wycofania, następcę i okno migracji.',
              'Usunięcie przed końcem okna migracji blokuje bramka lintu metadanych.',
            ),
            kodB('text', '2.0.0  usunięto: rdzen.color.sygnalowy-stary (koniec okna migracji)\n1.3.0  dodano: grupa rdzen.propozycje (kandydaci z piaskownic)\n1.2.1  zmieniono: rdzen.krycie.mocne 0,86 → 0,84', 'Przykładowy wypis wpływu zmian'),
          ],
        },
      ],
    },
    {
      nazwa: 'Zespół',
      strony: [
        {
          uid: 'notatki-wewnetrzne', name: 'Notatki wewnętrzne', locked: true,
          introduction: 'Strona zablokowana — widoczna wyłącznie po zalogowaniu.',
          bloki: [
            tekstB('Treść dla zespołu: ustalenia robocze, których nie publikujemy publicznie. Ta strona istnieje także po to, żeby pokazać, że serwer MCP nigdy jej nie zwróci bez uprawnień.'),
          ],
        },
      ],
    },
  ],
}

function emitujStrony() {
  // uid-y bez myślników (kontrakt URL) — hasz sluga zadeklarowanego w treści
  for (const sekcja of TRESC.sekcje) {
    for (const strona of sekcja.strony) {
      if (!/^p[0-9a-z]{7}$/.test(strona.uid)) strona.uid = uidDla(strona.uid)
    }
  }
  const liczbaStron = TRESC.sekcje.reduce((s, sek) => s + sek.strony.length, 0)
  zapisz('kanon/strony.json', {
    comment: `Treść witryny zasiewu: ${TRESC.sekcje.length} sekcji, ${liczbaStron} stron. Bloki w kształcie edytora treści (kind + config + contentRich); bloki odroczone (design, galeria, załączniki) uzupełnia zasiew po utworzeniu źródła danych i wgraniu zasobów. Plik wygenerowany: scripts/generuj.mjs.`,
    sekcje: TRESC.sekcje,
  })
  return liczbaStron
}

// Zasoby graficzne (SVG wyliczane — żaden piksel nie pochodzi z realnego wdrożenia)
function emitujZasoby() {
  const svgSiatkaIkon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" role="img" aria-label="Cztery rozmiary ikon">
  <rect width="320" height="120" fill="${krokHex('grafit', 0)}"/>
  ${[16, 20, 24, 32].map((r, i) => `<rect x="${28 + i * 76}" y="${(120 - r * 2) / 2}" width="${r * 2}" height="${r * 2}" rx="6" fill="${krokHex('blekit', 5)}"/>`).join('\n  ')}
</svg>
`
  const warstwy = [['prymitywy', 8, 200], ['role semantyczne', 6, 150], ['warstwa funkcjonalna', 4, 100], ['warstwa komponentowa', 2, 50]]
  const svgPiramida = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-label="Piramida tokenów">
  <rect width="320" height="200" fill="${krokHex('grafit', 0)}"/>
  ${warstwy.map(([nazwa, krok, szer], i) => `<rect x="${160 - szer * 0.7}" y="${150 - i * 40}" width="${szer * 1.4}" height="32" rx="4" fill="${krokHex('blekit', krok)}"/><text x="160" y="${170 - i * 40}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="${i > 1 ? krokHex('grafit', 0) : krokHex('grafit', 9)}">${nazwa}</text>`).join('\n  ')}
</svg>
`
  const pelnaSiatka = path.join(KATALOG, 'zasoby')
  mkdirSync(pelnaSiatka, { recursive: true })
  writeFileSync(path.join(pelnaSiatka, 'siatka-ikon.svg'), svgSiatkaIkon)
  writeFileSync(path.join(pelnaSiatka, 'piramida-tokenow.svg'), svgPiramida)
  console.log('  zasoby/siatka-ikon.svg')
  console.log('  zasoby/piramida-tokenow.svg')
}

function emitujZrodla() {
  const oczekiwane = ZABURZENIA.map((z, i) => ({
    nr: i + 1,
    driftType: z.typ,
    sciezka: z.sciezka,
    kategoria: z.kategoria,
    severity: z.severity,
    ...(z.powod ? { powod: z.powod } : {}),
    od: OKRESY[z.od - 1],
  }))

  for (let m = 1; m <= 6; m++) {
    const vars = zbudujZrodlo(m)
    const zawartosc = {
      comment: `Zrzut źródła projektowego — stan ${OKRESY[m - 1]} (${m} z 6). Zaburzenia narastają z miesiąca na miesiąc; stan 6 == zrodlo/zrzut-alfa.json. Plik wygenerowany: scripts/generuj.mjs.`,
      variables: vars,
    }
    zapisz(`zrodlo/stany/${OKRESY[m - 1]}/zrzut.json`, zawartosc)
    zapisz(`zrodlo/stany/${OKRESY[m - 1]}/pokrycie.json`, zbudujPokrycie(m))
    if (m === 1) {
      zapisz(`zrodlo/stany/${OKRESY[0]}/zrzut-surowy.json`, {
        comment: 'Ten sam stan co zrzut.json, w surowym kształcie trasy przyjęcia (POST /data-sources/:id/snapshots) — wejście importu przez bramkę scalania.',
        kind: 'variables',
        payload: zbudujZrzutSurowy(vars),
      })
    }
  }

  // stan bieżący (miesiąc 6) — pliki bramek CLI i dokumentacji
  const finalne = zbudujZrodlo(6)
  zapisz('zrodlo/zrzut-alfa.json', {
    comment: `Zasiane rozjazdy: zrzut źródła projektowego celowo rozjechany z kanonem zestawu (stan ${OKRESY[5]} — identyczny ze zrodlo/stany/${OKRESY[5]}/zrzut.json). Bramka drift-gate wykrywa DOKŁADNIE ${oczekiwane.length} znalezisk — pełna lista w polu expected, opisy w opis-rozjazdow.md. Typ missing-in-code wymaga artefaktu buildu i nie jest zasiany (jawna granica zestawu).`,
    expected: oczekiwane,
    variables: finalne,
  })
  zapisz('zrodlo/pokrycie.json', zbudujPokrycie(6))
  zapisz('zrodlo/komponenty.json', {
    comment: 'Warstwa komponentów: rejestr produktowy (encje + statusy), inwentarz skanera rejestr-vs-stan (rodziny z wariantami + instancje z zasianymi rozbieżnościami obu rodzajów).',
    statusy: [
      { name: 'Stabilny', color: krokHex('zielen', 6) },
      { name: 'W przygotowaniu', color: krokHex('bursztyn', 6) },
      { name: 'Wycofywany', color: krokHex('czerwien', 6) },
    ],
    rejestr: KOMPONENTY.map((k) => ({ slug: k.slug, name: k.nazwa, description: k.opis, status: STATUSY_KOMPONENTOW[k.status] })),
    inventory: INWENTARZ,
    registeredLibraries: ['bib-rdzen'],
  })
  zapisz('zrodlo/komponenty-surowe.json', zbudujKomponentySurowe())
  zapisz('zrodlo/oczekiwania-komponentow.json', {
    comment: 'Rejestr oczekiwań komponentów (ComponentExpectation) — jeden rejestr dla skanera.',
    oczekiwania: OCZEKIWANIA,
  })
  return oczekiwane
}

function emitujMarkiStany() {
  for (let m = 1; m <= 6; m++) {
    for (const [marka, stan] of [['beta', stanBety(m)], ['gamma', stanGammy(m)]]) {
      const korzen = {
        $description: `Kolekcja lustrzana marki (${marka}) — stan ${OKRESY[m - 1]}. Dostawa zespołu marki importowana trasą produktu (import DTCG do kolekcji marki). Plik wygenerowany.`,
      }
      for (const t of stan) {
        const segmenty = t.path.split('.')
        let wezel = korzen
        for (const s of segmenty.slice(0, -1)) {
          wezel[s] = wezel[s] ?? {}
          wezel = wezel[s]
        }
        wezel[segmenty.at(-1)] = {
          $type: t.type, $value: t.value,
          $extensions: {
            [`${NS}.provenance`]: t.provenance ?? 'unknown',
            ...(t.detail ? { [`${NS}.provenance-detail`]: t.detail } : {}),
            [`${NS}.status`]: 'active',
          },
        }
      }
      zapisz(`marki/${marka}/${OKRESY[m - 1]}.dtcg.json`, korzen)
    }
  }
}

function emitujBramki(liczbaOczekiwanych) {
  zapisz('bramki/rozjazd.json', {
    comment: `Konfiguracja bramki rozjazdu (CLI drift-gate). Ścieżki względem tego pliku. Bramka: kod wyjścia 1, gdy istnieje znalezisko kategorii REAL o severity P2 lub wyższej; 0 gdy czysto; 2 przy błędzie zdrowia danych. Oczekiwane znaleziska: ${liczbaOczekiwanych} (lista w zrodlo/zrzut-alfa.json).`,
    kanon: { plik: '../kanon/tokeny.dtcg.json', format: 'dtcg', namespace: NS },
    zrodlo: '../zrodlo/zrzut-alfa.json',
    drift: DRIFT_KONFIG,
    failOn: { category: 'REAL', minSeverity: 'P2' },
  })
  zapisz('bramki/pokrycie.json', {
    comment: 'Konfiguracja bramki pokrycia (CLI coverage-gate). Bramka: kod wyjścia 1, gdy odsetek związanych propert (occurrence) spadnie poniżej progu; 0 gdy próg dotrzymany; 2 przy błędnym wejściu.',
    wejscie: '../zrodlo/pokrycie.json',
    legacyNamePatterns: ['LEGACY'],
    collectedAt: '2026-08-31',
    failBelow: { occurrencePercent: 50 },
  })
  zapisz('bramki/kontrast.json', {
    comment: 'Pary kontrastu WCAG (bramka jakości): tekst na tle, per tryb Jasny. Jedna para celowo poniżej progu AA — bramka MA się zatrzymać (kod wyjścia 1). Pary zasiewane też do bazy (contrast_pair) i uruchamiane silnikiem platformy.',
    level: 'AA',
    blockPipeline: true,
    modes: ['Jasny'],
    namespace: NS,
    tokensFile: '../kanon/tokeny.dtcg.json',
    pairs: PARY_KONTRASTU.map(({ oczekiwane, ...p }) => p),
  })
}

const DRIFT_KONFIG = {
  designSystemId: 'zestaw-demonstracyjny',
  slugMap: [{ pattern: '/', flags: 'g', template: '.' }],
  modeRanking: ['Jasny', 'Ciemny'],
  semanticCollection: 'Semantyka',
  codeOnlyPrefixes: ['rdzen.wewnetrzne'],
  placeholderModes: ['Okolicznosciowy'],
  placeholderValues: ['"#000000"'],
  severityRules: [
    { match: { driftType: 'value-mismatch', pathPrefix: 'rdzen.semantic.' }, severity: 'P0' },
    { match: { driftType: 'missing-in-figma' }, severity: 'P1' },
    { match: { driftType: 'layer-mismatch' }, severity: 'P1' },
    { match: { driftType: 'deprecated-still-used' }, severity: 'P3' },
    { match: {}, severity: 'P2' },
  ],
}

function emitujDostawce() {
  zapisz('dostawcy/wykonawca.json', {
    comment: 'Dostawca zewnętrzny odpowiedzialny za dostawę do Marki Gamma (miesiąc 2026-06). Karta wyników liczona silnikiem platformy (scorecard adopcyjny 0–100) na pomiarach zebranych z instancji.',
    dostawca: { name: 'Wykonawca zewnętrzny', marki: ['Marka Gamma'] },
    kontrakty: [
      {
        komponent: 'przycisk', wersja: '1.0.0',
        props: [
          { name: 'odmiana', type: 'enum', enum: ['podstawowa', 'drugorzedna', 'destrukcyjna'], required: true },
          { name: 'rozmiar', type: 'enum', enum: ['maly', 'sredni', 'duzy'], default: 'sredni' },
          { name: 'wylaczony', type: 'boolean', default: false },
        ],
        tokenConsumption: ['rdzen.komponent.przycisk-tlo', 'rdzen.komponent.przycisk-tresc', 'rdzen.semantic.promien-interakcja'],
      },
      {
        komponent: 'karta', wersja: '1.0.0',
        props: [
          { name: 'uklad', type: 'enum', enum: ['pionowy', 'poziomy'], default: 'pionowy' },
          { name: 'obwodka', type: 'boolean', default: true },
        ],
        tokenConsumption: ['rdzen.komponent.karta-tlo', 'rdzen.komponent.karta-obwodka', 'rdzen.semantic.promien-powierzchnia'],
      },
    ],
  })
}

function emitujManifest() {
  zapisz('zestaw.json', {
    nazwa: 'Zestaw demonstracyjny — jeden rdzeń, trzy marki, sześć miesięcy pomiaru',
    wersja: '2.0',
    namespace: NS,
    system: {
      name: 'System demonstracyjny',
      docSlug: 'system-demonstracyjny',
      shareId: 'demo000001',
      description: 'Jeden rdzeń, trzy marki, sześć miesięcy pomiaru — dane zasiewowe instancji.',
    },
    drift: DRIFT_KONFIG,
    pliki: {
      kanon: 'kanon/tokeny.dtcg.json',
      tryby: 'kanon/tryby.json',
      marki: 'kanon/marki.json',
      strony: 'kanon/strony.json',
      rdzenObowiazkowy: 'kanon/rdzen-obowiazkowy.json',
      zrzutZrodla: 'zrodlo/zrzut-alfa.json',
      pokrycie: 'zrodlo/pokrycie.json',
      komponenty: 'zrodlo/komponenty.json',
      komponentySurowe: 'zrodlo/komponenty-surowe.json',
      zasoby: { 'siatka-ikon': 'zasoby/siatka-ikon.svg', 'piramida-tokenow': 'zasoby/piramida-tokenow.svg' },
      oczekiwaniaKomponentow: 'zrodlo/oczekiwania-komponentow.json',
      kontrast: 'bramki/kontrast.json',
      dostawca: 'dostawcy/wykonawca.json',
    },
    // sześć następujących po sobie stanów źródła — zasiew przepuszcza każdy przez
    // ten sam potok pomiarowy i zapisuje migawkę z datą wsteczną (tylko znacznik czasu)
    stany: OKRESY.map((okres, i) => ({
      okres,
      zrzut: `zrodlo/stany/${okres}/zrzut.json`,
      pokrycie: `zrodlo/stany/${okres}/pokrycie.json`,
      marki: {
        'Marka Beta': `marki/beta/${okres}.dtcg.json`,
        'Marka Gamma': `marki/gamma/${okres}.dtcg.json`,
      },
      ...(i === 0 ? { zrzutSurowy: `zrodlo/stany/${okres}/zrzut-surowy.json` } : {}),
    })),
    // jawne wskazówki typów dla importu FLOAT (heurystyka nazw zna tylko konwencje
    // angielskie; zbiór nazwany po polsku deklaruje swoje konwencje — biała etykieta)
    typeHints: [
      { pattern: '(^|\\.)krycie\\.', type: 'opacity' },
      { pattern: '(^|\\.)warstwa\\.', type: 'zIndex' },
      { pattern: 'grubosc-', type: 'fontWeight' },
      { pattern: 'wysokosc-', type: 'lineHeight' },
      { pattern: '(^|\\.)czas\\.', type: 'duration' },
    ],
    // dopasowanie marka↔rdzeń po JAWNYM słowniku nazw (slug-map per marka)
    slugMapyMarek: {
      'Marka Beta': [{ pattern: '^marka-beta\\.', template: 'rdzen.' }],
      'Marka Gamma': [{ pattern: '^marka-gamma\\.', template: 'rdzen.' }],
    },
    kolekcjeMarek: { 'Marka Beta': 'marka-beta', 'Marka Gamma': 'marka-gamma' },
    zastosowania: [
      'zasiew platformy z warstwą dowodową (app seed <katalog-zestawu>)',
      'publiczne repozytorium demonstracyjne',
      'źródło publicznego serwera MCP (wyłącznie nienaruszony zasiew)',
      'szablon piaskownicy efemerycznej',
    ],
  })
}

// ---------------------------------------------------------------------------
// Przebieg
// ---------------------------------------------------------------------------

console.log('Generuję zestaw demonstracyjny:')
emitujKanon()
emitujTryby()
zapisz('kanon/rdzen-obowiazkowy.json', {
  comment: 'Rdzeń obowiązkowy marki (mianownik pokrycia): active × warstwy primitive+semantic, bez grupy wewnetrzne. Wyliczony z kanonu — plik wygenerowany.',
  sciezki: rdzenObowiazkowy,
})
emitujMarki()
const liczbaStron = emitujStrony()
emitujZasoby()
const oczekiwane = emitujZrodla()
emitujMarkiStany()
emitujBramki(oczekiwane.length)
emitujDostawce()
emitujManifest()

// Podsumowanie kontrolne (do README i opisu rozjazdów)
const wgTypu = {}
const wgKategorii = { REAL: 0, ARCHITECTURAL: 0, ASSUMPTION: 0 }
const wgSeverity = { P0: 0, P1: 0, P2: 0, P3: 0 }
for (const z of oczekiwane) {
  wgTypu[z.driftType] = (wgTypu[z.driftType] ?? 0) + 1
  wgKategorii[z.kategoria]++
  wgSeverity[z.severity]++
}
console.log('\nPodsumowanie:')
console.log(`  tokeny kanonu: ${tokeny.length} (prymitywy ${tokeny.filter((t) => t.layer === 'primitive').length} · semantyka ${tokeny.filter((t) => t.layer === 'semantic').length} · funkcjonalne ${tokeny.filter((t) => t.layer === 'functional').length} · komponentowe ${tokeny.filter((t) => t.layer === 'component').length})`)
console.log(`  rdzeń obowiązkowy (mianownik): ${rdzenObowiazkowy.length}`)
console.log(`  zasiane rozjazdy: ${oczekiwane.length} — kategorie ${JSON.stringify(wgKategorii)} — severity ${JSON.stringify(wgSeverity)}`)
console.log(`  typy: ${Object.entries(wgTypu).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
console.log(`  pokrycie Bety (z ${rdzenObowiazkowy.length}): ${BETA_POKRYCIE.map((n) => (n / rdzenObowiazkowy.length * 100).toFixed(1)).join(' → ')}`)
console.log(`  pokrycie Gammy: ${(GAMMA_POKRYCIE / rdzenObowiazkowy.length * 100).toFixed(1)} (stałe) · odchylenia ${GAMMA_ODCH_ILE.join(' → ')} · dodatki ${GAMMA_DODATKI_ILE.join(' → ')}`)
console.log(`  definicje pokrycia komponentów: ${DEFINICJE.length}`)
console.log(`  komponenty modelu: ${KOMPONENTY.length} · oczekiwania skanera: ${OCZEKIWANIA.length} · rodziny w stanie: ${INWENTARZ.families.length}`)
console.log(`  strony treści: ${liczbaStron} w ${TRESC.sekcje.length} sekcjach`)
