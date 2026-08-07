#!/usr/bin/env node
// Tabela pokrycia katalogu [widoki generowane, kryterium 5]: pozycja → przepis → osie →
// kontrakt → stan widoku. Czyta wyłącznie pliki zestawu, więc wynik nie zależy od tego,
// czy instancja akurat stoi.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { KONTRAKTY } from './kontrakty-komponentow.mjs'

const KATALOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const czytaj = (rel) => JSON.parse(readFileSync(path.join(KATALOG, rel), 'utf8'))

const rejestr = czytaj('zrodlo/komponenty.json').rejestr
const surowe = czytaj('zrodlo/komponenty-surowe.json')
const wLustrze = new Set(czytaj('kanon/rdzen-obowiazkowy.json').sciezki)
const kanon = czytaj('kanon/tokeny.dtcg.json')

const wartoscWgSciezki = new Map()
;(function walk(w, pre) {
  for (const [k, v] of Object.entries(w)) {
    if (k.startsWith('$') || typeof v !== 'object' || !v) continue
    const p = pre ? `${pre}.${k}` : k
    if (v.$value !== undefined) wartoscWgSciezki.set(p, v.$value)
    else walk(v, p)
  }
})(kanon, '')

const sterowana = (sciezka, widziane = new Set()) => {
  if (wLustrze.has(sciezka)) return true
  if (widziane.has(sciezka)) return false
  widziane.add(sciezka)
  const w = wartoscWgSciezki.get(sciezka)
  return typeof w === 'string' && /^\{.+\}$/.test(w) ? sterowana(w.slice(1, -1), widziane) : false
}

const zestawyWariantow = new Set(surowe.payload.componentSets.meta.component_sets.map((z) => z.key))

const wiersze = rejestr.map((k) => {
  const dane = KONTRAKTY[k.slug]
  const przepis = dane?.przepis
  const uzyte = new Set()
  const literaly = []
  const zbierz = (bind, gdzie) => {
    for (const [wl, b] of Object.entries(bind ?? {})) {
      if (b?.token) uzyte.add(b.token)
      if (b?.literal) literaly.push(`${gdzie}.${wl}`)
    }
  }
  for (const cz of przepis?.parts ?? []) zbierz(cz.bind, cz.id)
  for (const w of Object.values(przepis?.variants ?? {})) {
    for (const ov of Object.values(w)) for (const [id, props] of Object.entries(ov)) zbierz(props, id)
  }
  for (const ov of Object.values(przepis?.states ?? {})) {
    for (const [id, props] of Object.entries(ov)) zbierz(props, id)
  }
  const osie = dane?.osie ?? null
  const liczbaOsi = osie ? Object.keys(osie).length : 0
  const liczbaWariantow = osie ? Object.values(osie).reduce((s, v) => s + v.length, 0) : 0
  const stany = Object.keys(dane?.kontrakt?.states ?? {})
  const reaguje = [...uzyte].some((s) => sterowana(s))
  return {
    slug: k.slug,
    nazwa: k.name,
    czesci: przepis?.parts?.length ?? 0,
    osie: liczbaOsi ? `${liczbaOsi} (${liczbaWariantow} wartości)` : '—',
    refZWariantami: zestawyWariantow.has(`kmp-${k.slug}`),
    stany: stany.length,
    tokeny: uzyte.size,
    literaly: literaly.length,
    reaguje,
  }
})

const kol = (t, n) => String(t).padEnd(n)
console.log('# Tabela pokrycia katalogu\n')
console.log('| Pozycja | Przepis (części) | Osie | Stany | Tokeny | Zaszyte | Reaguje na markę | Stan widoku |')
console.log('|---|---|---|---|---|---|---|---|')
for (const w of wiersze) {
  const stan = w.czesci === 0
    ? 'BRAK PRZEPISU — macierz pokazuje nazwany brak'
    : w.osie === '—'
      ? 'render w jednej kolumnie (pozycja bez wariantów)'
      : 'macierz wariantów × stanów'
  console.log(`| ${w.nazwa} | ${w.czesci} | ${w.osie} | ${w.stany} | ${w.tokeny} | ${w.literaly || '—'} | ${w.reaguje ? 'tak' : 'NIE'} | ${stan} |`)
}

const bezPrzepisu = wiersze.filter((w) => !w.czesci).length
const bezOsi = wiersze.filter((w) => w.osie === '—').length
const niereagujace = wiersze.filter((w) => !w.reaguje)
const zLiteralami = wiersze.filter((w) => w.literaly)
console.log(`\n**Razem ${wiersze.length} pozycji.** Przepis ma ${wiersze.length - bezPrzepisu}; bez osi wariantów: ${bezOsi}.`)
console.log(`Niereagujących na zmianę marki: ${niereagujace.length}${niereagujace.length ? ` (${niereagujace.map((w) => w.nazwa).join(', ')})` : ''}.`)
console.log(`Z wartościami zaszytymi: ${zLiteralami.length}${zLiteralami.length ? ` (${zLiteralami.map((w) => `${w.nazwa}: ${w.literaly}`).join(', ')})` : ''}.`)
console.log(`Suma zużywanych ścieżek tokenów: ${new Set(wiersze.flatMap((w) => w.tokeny)).size ? wiersze.reduce((s, w) => s + w.tokeny, 0) : 0} wystąpień.`)
