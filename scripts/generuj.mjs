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
    const name = t.path.replaceAll('.', '/')
    const valuesByMode = {}
    if (typeof t.value === 'string' && t.value.startsWith('{')) {
      valuesByMode.Jasny = { aliasOf: t.value.slice(1, -1).replaceAll('.', '/') }
    } else {
      valuesByMode.Jasny = t.value
    }
    if (t.dark !== undefined) valuesByMode.Ciemny = t.dark
    // tokeny o pochodzeniu figma niosą opis zgodny z kanonem — import przez bramkę
    // scalania ma dać pełne `unchanged` (opis wchodzi do porównania poza ochroną code)
    const opis = t.provenance === 'figma' ? t.desc : undefined
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
    wynik.push({ path: luster(przedrostek, sciezkaRdzenia), type: rdzenny.type, value: wartosc })
  }
  for (const [koncowka, typ, wartosc] of dodatki) {
    wynik.push({ path: `${przedrostek}.${koncowka}`, type: typ, value: wartosc })
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

const OCZEKIWANIA = [
  { slug: 'przycisk', required: true, requiredVariants: [{ odmiana: 'podstawowa' }, { odmiana: 'drugorzedna' }, { odmiana: 'destrukcyjna' }], platforms: ['www', 'aplikacja'], intentionalSinglePlatform: false, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'pole-tekstowe', required: true, requiredVariants: [{ stan: 'zwykly' }, { stan: 'blad' }], platforms: ['www', 'aplikacja'], intentionalSinglePlatform: false, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'karta', required: true, requiredVariants: [{ uklad: 'pionowy' }, { uklad: 'poziomy' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'znacznik', required: true, requiredVariants: [{ ton: 'neutralny' }, { ton: 'sukces' }, { ton: 'blad' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'okno-dialogowe', required: true, requiredVariants: [{ rozmiar: 'srednie' }], platforms: ['www', 'aplikacja'], intentionalSinglePlatform: false, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'powiadomienie', required: true, requiredVariants: [{ ton: 'informacja' }, { ton: 'blad' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'przelacznik', required: true, requiredVariants: [{ stan: 'wlaczony' }, { stan: 'wylaczony' }], platforms: ['www', 'aplikacja'], intentionalSinglePlatform: false, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'zakladki', required: false, requiredVariants: [{ uklad: 'poziomy' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'tabela', required: false, requiredVariants: [], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  { slug: 'stronicowanie', required: false, requiredVariants: [], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
  // brak w stanie → MISSING_COMPONENT (nieobowiązkowy → P1)
  { slug: 'krokownica', required: false, requiredVariants: [{ krok: 'pierwszy' }], platforms: ['www'], intentionalSinglePlatform: true, libraryRef: 'bib-rdzen', helper: false },
]

const INWENTARZ = {
  families: [
    { slug: 'przycisk', platforms: ['www'], variants: [{ name: 'podstawowa', axes: { odmiana: 'podstawowa' } }, { name: 'drugorzedna', axes: { odmiana: 'drugorzedna' } }] }, // brak destrukcyjnej → MISSING_VARIANT; brak platformy aplikacja → PLATFORM_MISSING
    { slug: 'pole-tekstowe', platforms: ['www', 'aplikacja'], variants: [{ name: 'zwykly', axes: { stan: 'zwykly' } }, { name: 'blad', axes: { stan: 'blad' } }, { name: 'eksperymentalny', axes: { stan: 'eksperymentalny' } }] }, // nadmiarowy wariant → EXTRA_VARIANT
    { slug: 'karta', platforms: ['www'], variants: [{ name: 'pionowy', axes: { uklad: 'pionowy' } }, { name: 'poziomy', axes: { uklad: 'poziomy' } }] },
    { slug: 'znacznik', platforms: ['www'], variants: [{ name: 'neutralny', axes: { ton: 'neutralny' } }, { name: 'sukces', axes: { ton: 'sukces' } }, { name: 'blad', axes: { ton: 'blad' } }] },
    { slug: 'okno-dialogowe', platforms: ['www'], variants: [{ name: 'srednie', axes: { rozmiar: 'srednie' } }] }, // brak platformy aplikacja → PLATFORM_MISSING
    { slug: 'powiadomienie', platforms: ['www'], variants: [{ name: 'informacja', axes: { ton: 'informacja' } }] }, // brak tonu blad → MISSING_VARIANT
    { slug: 'przelacznik', platforms: ['www', 'aplikacja'], variants: [{ name: 'wlaczony', axes: { stan: 'wlaczony' } }, { name: 'wylaczony', axes: { stan: 'wylaczony' } }] },
    { slug: 'zakladki', platforms: ['www'], variants: [{ name: 'poziomy', axes: { uklad: 'poziomy' } }] },
    { slug: 'tabela', platforms: ['www'], variants: [{ name: 'zwykla', axes: {} }] },
    { slug: 'stronicowanie', platforms: ['www'], variants: [{ name: 'zwykle', axes: {} }] },
    { slug: 'eksperyment-zespolu', platforms: ['www'], variants: [{ name: 'a', axes: {} }] }, // bez wpisu w rejestrze → EXTRA_COMPONENT
  ],
  instances: [
    { id: 'inst-001', familySlug: 'przycisk', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-002', familySlug: 'przycisk', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-003', familySlug: 'karta', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-004', familySlug: 'znacznik', masterExists: false, libraryRef: null, topLevel: true }, // odpięta instancja → DETACHED_INSTANCE (P0)
    { id: 'inst-005', familySlug: 'przycisk', masterExists: true, libraryRef: 'bib-obca', topLevel: true }, // biblioteka spoza kontraktu → WRONG_LIBRARY
    { id: 'inst-006', familySlug: 'eksperyment-zespolu', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true }, // master jest, rejestru brak → INTERNAL_UNREGISTERED
    { id: 'inst-007', familySlug: 'pole-tekstowe', masterExists: true, libraryRef: 'bib-rdzen', topLevel: true },
    { id: 'inst-008', familySlug: 'tabela', masterExists: true, libraryRef: 'bib-rdzen', topLevel: false }, // nie top-level — nieliczona
  ],
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
      [`${NS}.layer`]: t.layer,
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

function emitujStrony() {
  zapisz('kanon/strony.json', {
    comment: 'Treść witryny zasiewu: sekcja nawigacji + strony (trzy publiczne, jedna zablokowana).',
    sekcja: 'Dokumentacja',
    strony: [
      { uid: 'aa11bb22', name: 'Wprowadzenie', introduction: 'Czym jest ten system i jak z niego korzystać.', text: 'Jeden rdzeń semantyczny, trzy marki różniące się wyłącznie wartościami prymitywów. Ta strona pochodzi z danych zasiewowych.' },
      { uid: 'cc33dd44', name: 'Zasady marki', introduction: 'Reguły użycia tokenów i komponentów w produktach.', text: 'Kolory, typografia i odstępy pochodzą z tokenów; wartości surowe w kodzie produktu są rozjazdem do wykrycia.' },
      { uid: 'gg77hh88', name: 'Pomiar zamiast opinii', introduction: 'Skąd biorą się liczby na ekranie przeglądu.', text: 'Pokrycie, wierność i dodatki własne liczy kalkulator miar na kolekcjach lustrzanych marek. Rozjazd wykrywa skan zrzutu źródła wobec kanonu. Sześć kolejnych pomiarów układa się w historię: jedna marka rośnie, jedna stoi, jedna spada po dostawie z zewnątrz.' },
      { uid: 'ee55ff66', name: 'Notatki wewnętrzne', locked: true, introduction: 'Strona zablokowana — widoczna wyłącznie po zalogowaniu.', text: 'Treść dla zespołu: ustalenia robocze, których nie publikujemy publicznie.' },
    ],
  })
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
    comment: 'Inwentarz skanera komponentów rejestr-vs-stan: rodziny z wariantami + instancje. Zasiane rozjazdy komponentowe opisane w README.',
    inventory: INWENTARZ,
    registeredLibraries: ['bib-rdzen'],
  })
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
          $extensions: { [`${NS}.provenance`]: 'unknown', [`${NS}.status`]: 'active' },
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
emitujStrony()
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
