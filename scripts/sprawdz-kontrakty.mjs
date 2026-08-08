#!/usr/bin/env node
// =============================================================================
// Kontrola kontraktów i przepisów renderowania zestawu.
//
// Sprawdza to, czego nie sprawdzi walidacja struktury po stronie platformy: czy
// ścieżki tokenów istnieją w kanonie, czy deklaracja zużycia zgadza się z przepisem,
// czy osie przepisu odpowiadają osiom rejestru i czy pozycje katalogu mają komplet
// danych. Uruchamiane po generatorze; kod wyjścia 1 przy jakiejkolwiek usterce.
// =============================================================================
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { KONTRAKTY } from './kontrakty-komponentow.mjs'

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const czytaj = (rel) => JSON.parse(readFileSync(path.join(KATALOG, rel), 'utf8'))

const ELEMENTY = new Set(['box', 'stack', 'row', 'text', 'icon', 'input', 'spacer'])
const WLASCIWOSCI = new Set([
  'background', 'color', 'borderColor', 'borderWidth', 'radius',
  'paddingX', 'paddingY', 'gap', 'width', 'height',
  'fontSize', 'lineHeight', 'fontWeight', 'fontFamily',
  'opacity', 'shadow', 'textDecoration', 'letterSpacing',
  'outlineColor', 'outlineWidth',
])
// Ścieżki, których marka nie ma w kolekcji lustrzanej i które nie prowadzą do niej aliasem:
// render na nich nie reaguje na przełączenie marki [widoki generowane §3].
const POZA_LUSTREM_CELOWO = new Set(['baner'])
const ZASZYTE_CELOWO = new Set(['wiersz-tabeli'])

// ---- kanon: ścieżki, typy, graf aliasów ----
const kanon = czytaj('kanon/tokeny.dtcg.json')
const typWgSciezki = new Map()
const wartoscWgSciezki = new Map()
;(function walk(wezel, przedrostek) {
  for (const [klucz, wartosc] of Object.entries(wezel)) {
    if (klucz.startsWith('$') || typeof wartosc !== 'object' || !wartosc) continue
    const sciezka = przedrostek ? `${przedrostek}.${klucz}` : klucz
    if (wartosc.$value !== undefined) {
      typWgSciezki.set(sciezka, wartosc.$type)
      wartoscWgSciezki.set(sciezka, wartosc.$value)
    } else walk(wartosc, sciezka)
  }
})(kanon, '')

const wLustrze = new Set(czytaj('kanon/rdzen-obowiazkowy.json').sciezki)

/** Czy wartość ścieżki daje się nadpisać przez markę (bezpośrednio albo przez alias). */
function sterowanaPrzezMarke(sciezka, widziane = new Set()) {
  if (wLustrze.has(sciezka)) return true
  if (widziane.has(sciezka)) return false
  widziane.add(sciezka)
  const wartosc = wartoscWgSciezki.get(sciezka)
  if (typeof wartosc === 'string' && /^\{.+\}$/.test(wartosc)) {
    return sterowanaPrzezMarke(wartosc.slice(1, -1), widziane)
  }
  return false
}

// ---- typy właściwości: kontrola sensu bindingu ----
const TYPY_WLASCIWOSCI = {
  background: ['color'], color: ['color'], borderColor: ['color'], outlineColor: ['color'],
  borderWidth: ['borderWidth', 'dimension', 'size'], outlineWidth: ['borderWidth', 'dimension', 'size'],
  radius: ['radius', 'dimension'],
  paddingX: ['space', 'dimension', 'size'], paddingY: ['space', 'dimension', 'size'],
  gap: ['space', 'dimension', 'size'],
  // linia (separator, wskaźnik zakładki) ma wysokość albo szerokość równą GRUBOŚCI obwódki
  // — to jest właściwe źródło wartości, nie skala odstępów
  width: ['size', 'space', 'dimension', 'borderWidth'], height: ['size', 'space', 'dimension', 'borderWidth'],
  fontSize: ['fontSize', 'dimension'], lineHeight: ['lineHeight'], fontWeight: ['fontWeight'],
  fontFamily: ['fontFamily'], opacity: ['opacity'], letterSpacing: ['dimension', 'space'],
  shadow: ['shadow'], textDecoration: ['textDecoration', 'string'],
}

const usterki = []
const ostrzezenia = []
const zgloszenie = (slug, tekst) => usterki.push(`${slug}: ${tekst}`)

function sprawdzBinding(slug, gdzie, wlasciwosc, binding, uzyte, literaly) {
  if (!WLASCIWOSCI.has(wlasciwosc)) {
    zgloszenie(slug, `${gdzie}: nieznana właściwość „${wlasciwosc}"`)
    return
  }
  // format v2 [domknięcie §2]: unia znakowana — dokładnie jeden rodzaj bindingu
  if (binding?.kind === 'literal') {
    if (typeof binding.value !== 'string' || !binding.value.length) {
      zgloszenie(slug, `${gdzie}.${wlasciwosc}: binding zaszyty bez niepustej wartości`)
      return
    }
    literaly.push(`${gdzie}.${wlasciwosc}=${binding.value}`)
    return
  }
  if (binding?.kind !== 'token' || typeof binding.path !== 'string' || !binding.path.length) {
    zgloszenie(slug, `${gdzie}.${wlasciwosc}: binding wymaga {kind:'token',path} albo {kind:'literal',value}`)
    return
  }
  uzyte.add(binding.path)
  const typ = typWgSciezki.get(binding.path)
  if (!typ) {
    zgloszenie(slug, `${gdzie}.${wlasciwosc}: ścieżka spoza kanonu → ${binding.path}`)
    return
  }
  const dozwolone = TYPY_WLASCIWOSCI[wlasciwosc]
  if (dozwolone && !dozwolone.includes(typ)) {
    zgloszenie(slug, `${gdzie}.${wlasciwosc}: token typu ${typ} (${binding.path}), oczekiwano ${dozwolone.join('/')}`)
  }
}

for (const [slug, dane] of Object.entries(KONTRAKTY)) {
  const { osie, kontrakt, przepis } = dane
  if (!kontrakt || !przepis) {
    zgloszenie(slug, 'brak kontraktu albo przepisu')
    continue
  }
  if (przepis.version !== 2) zgloszenie(slug, `przepis bez pola version: 2 (jest: ${przepis.version})`)

  // --- przepis: struktura ---
  const czesci = new Map((przepis.parts ?? []).map((p) => [p.id, p]))
  if (!czesci.size) zgloszenie(slug, 'przepis bez części')
  if (!czesci.has('root')) zgloszenie(slug, 'przepis bez części o id „root"')
  for (const czesc of przepis.parts ?? []) {
    if (!ELEMENTY.has(czesc.element)) zgloszenie(slug, `część ${czesc.id}: nieznany element „${czesc.element}"`)
    for (const dziecko of czesc.children ?? []) {
      if (!czesci.has(dziecko)) zgloszenie(slug, `część ${czesc.id}: dziecko „${dziecko}" nie istnieje`)
    }
  }
  // osiągalność z korzenia (bez cykli)
  const odwiedzone = new Set()
  ;(function idz(id, stos) {
    if (stos.has(id)) {
      zgloszenie(slug, `cykl w drzewie części przez „${id}"`)
      return
    }
    if (odwiedzone.has(id)) return
    odwiedzone.add(id)
    stos.add(id)
    for (const dziecko of czesci.get(id)?.children ?? []) if (czesci.has(dziecko)) idz(dziecko, stos)
    stos.delete(id)
  })('root', new Set())
  for (const czesc of przepis.parts ?? []) {
    if (!odwiedzone.has(czesc.id)) zgloszenie(slug, `część „${czesc.id}" nieosiągalna z korzenia`)
  }

  // --- bindingi: ścieżki, typy, literały ---
  const uzyte = new Set()
  const literaly = []
  for (const czesc of przepis.parts ?? []) {
    for (const [wlasciwosc, binding] of Object.entries(czesc.bind ?? {})) {
      sprawdzBinding(slug, `części ${czesc.id}`, wlasciwosc, binding, uzyte, literaly)
    }
    if (czesc.element === 'text' && czesc.textFrom) {
      const [korzen, nazwa, pole] = czesc.textFrom.split('.')
      if (korzen === 'props') {
        const prop = (kontrakt.props ?? []).find((p) => p.name === nazwa)
        if (!prop) zgloszenie(slug, `część ${czesc.id}: textFrom wskazuje nieistniejącą właściwość „${nazwa}"`)
        else if (prop[pole] === undefined) zgloszenie(slug, `część ${czesc.id}: właściwość „${nazwa}" nie ma pola „${pole}"`)
      }
    }
  }
  for (const [os, wartosci] of Object.entries(przepis.variants ?? {})) {
    if (!osie || !osie[os]) zgloszenie(slug, `przepis nadpisuje oś „${os}", której nie ma w rejestrze`)
    for (const [wartosc, nadpisania] of Object.entries(wartosci)) {
      if (osie?.[os] && !osie[os].includes(wartosc)) zgloszenie(slug, `oś „${os}" nie ma wartości „${wartosc}"`)
      for (const [idCzesci, wlasciwosci] of Object.entries(nadpisania)) {
        if (!czesci.has(idCzesci)) zgloszenie(slug, `wariant ${os}=${wartosc}: nieistniejąca część „${idCzesci}"`)
        for (const [wlasciwosc, binding] of Object.entries(wlasciwosci ?? {})) {
          sprawdzBinding(slug, `wariantu ${os}=${wartosc}`, wlasciwosc, binding, uzyte, literaly)
        }
      }
    }
  }
  for (const [stan, nadpisania] of Object.entries(przepis.states ?? {})) {
    if (!kontrakt.states?.[stan]) zgloszenie(slug, `przepis opisuje stan „${stan}" spoza kontraktu`)
    for (const [idCzesci, wlasciwosci] of Object.entries(nadpisania)) {
      if (!czesci.has(idCzesci)) zgloszenie(slug, `stan ${stan}: nieistniejąca część „${idCzesci}"`)
      for (const [wlasciwosc, binding] of Object.entries(wlasciwosci ?? {})) {
        sprawdzBinding(slug, `stanu ${stan}`, wlasciwosc, binding, uzyte, literaly)
      }
    }
  }

  // --- deklaracja zużycia = zbiór ścieżek faktycznie użytych ---
  const zadeklarowane = new Set(kontrakt.tokenConsumption ?? [])
  for (const sciezka of uzyte) {
    if (!zadeklarowane.has(sciezka)) zgloszenie(slug, `przepis używa ${sciezka}, a kontrakt tego nie deklaruje`)
  }
  for (const sciezka of zadeklarowane) {
    if (!uzyte.has(sciezka)) zgloszenie(slug, `kontrakt deklaruje ${sciezka}, a przepis tego nie używa`)
  }

  // --- reakcja na markę i wartości zaszyte (zasiane celowo są wyjątkiem) ---
  const sterowane = [...uzyte].filter((s) => sterowanaPrzezMarke(s))
  if (!sterowane.length && !POZA_LUSTREM_CELOWO.has(slug)) {
    zgloszenie(slug, 'żadna zużywana ścieżka nie jest sterowana przez markę (render nie zareaguje na przełączenie)')
  }
  if (sterowane.length && POZA_LUSTREM_CELOWO.has(slug)) {
    zgloszenie(slug, 'pozycja miała celowo NIE reagować na markę, a zużywa ścieżki sterowane')
  }
  if (literaly.length && !ZASZYTE_CELOWO.has(slug)) {
    zgloszenie(slug, `wartości zaszyte poza zasianym wyjątkiem: ${literaly.join(', ')}`)
  }
  if (!literaly.length && ZASZYTE_CELOWO.has(slug)) {
    zgloszenie(slug, 'pozycja miała nieść zasiane wartości zaszyte, a nie niesie żadnej')
  }

  // --- opisy: brak wypełniacza (heurystyka: opis powtarzający wyłącznie nazwę klucza) ---
  for (const [klucz, opis] of Object.entries(kontrakt.states ?? {})) {
    if (typeof opis !== 'string' || opis.trim().length < 20) {
      zgloszenie(slug, `stan „${klucz}": opis krótszy niż 20 znaków (wypełniacz)`)
    }
  }
  for (const sekcja of ['behavior', 'a11y']) {
    const wpisy = Object.entries(kontrakt[sekcja] ?? {})
    if (!wpisy.length) zgloszenie(slug, `pusta sekcja ${sekcja} kontraktu`)
    for (const [klucz, opis] of wpisy) {
      // `rola` niesie nazwę roli dostępności (button, switch, img) i jest krótka z natury
      const prog = klucz === 'rola' ? 3 : 15
      if (typeof opis !== 'string' || opis.trim().length < prog) {
        zgloszenie(slug, `${sekcja}.${klucz}: opis krótszy niż ${prog} znaków (wypełniacz)`)
      }
    }
  }

  // --- czytelność próbki: coś w drzewie musi mieć tło albo obwódkę, tekst ma kolor ---
  // (korzeń bywa układem bez wypełnienia: pole tekstowe to etykieta nad ramką pola)
  const maWypelnienie = (przepis.parts ?? []).some(
    (cz) => cz.bind?.background || cz.bind?.borderColor || cz.bind?.borderWidth,
  )
  if (!maWypelnienie) ostrzezenia.push(`${slug}: żadna część nie ma tła ani obwódki — próbka może być niewidoczna`)
  for (const czesc of przepis.parts ?? []) {
    if (czesc.element === 'text' && !czesc.bind?.color) {
      ostrzezenia.push(`${slug}: część ${czesc.id} to tekst bez związanego koloru`)
    }
  }
}

// ---- pokrycie katalogu ----
const komponentyZestawu = czytaj('zrodlo/komponenty.json').rejestr?.map((k) => k.slug) ?? []
const brakujace = komponentyZestawu.filter((slug) => !KONTRAKTY[slug])
if (brakujace.length) usterki.push(`katalog: pozycje bez kontraktu → ${brakujace.join(', ')}`)
const nadmiarowe = Object.keys(KONTRAKTY).filter((slug) => komponentyZestawu.length && !komponentyZestawu.includes(slug))
if (nadmiarowe.length) usterki.push(`kontrakty spoza katalogu → ${nadmiarowe.join(', ')}`)

console.log(`Kontrola kontraktów: ${Object.keys(KONTRAKTY).length} pozycji, ${komponentyZestawu.length} w rejestrze zestawu.`)
if (ostrzezenia.length) {
  console.log(`\nOstrzeżenia (${ostrzezenia.length}):`)
  for (const o of ostrzezenia) console.log(`  · ${o}`)
}
if (usterki.length) {
  console.log(`\nUSTERKI (${usterki.length}):`)
  for (const u of usterki) console.log(`  ✗ ${u}`)
  process.exit(1)
}
console.log('\nBez usterek: ścieżki istnieją, deklaracje zgodne z przepisami, osie spójne z rejestrem.')
