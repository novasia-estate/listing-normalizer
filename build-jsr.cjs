'use strict';
// Keep the supported registry builds on the same parsing implementation.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
let source = fs.readFileSync(path.join(root, 'index.cjs'), 'utf8').replace(/\r\n/g, '\n');
const replacements = [
  ["'use strict';", '// Generated from index.cjs by build-jsr.cjs. Do not edit the algorithm here.\nimport type { NumberStyle, AreaUnit, Listing, NormalizedListing, BatchRow, PriceResult, AreaResult } from "./types.ts";'],
  ['const FACTORS =', "const FACTORS: Readonly<Record<Exclude<AreaUnit, 'deed'>, number>> ="],
  ["function number(input, style = 'auto') {", "function number(input: string | number, style: NumberStyle = 'auto'): number {"],
  ["function price(input, { style = 'auto', currency = '' } = {}) {", "function price(input: string, { style = 'auto', currency = '' }: { style?: NumberStyle; currency?: string } = {}): PriceResult {"],
  ['const detected = new Set();', 'const detected = new Set<string>();'],
  ['const codes =', 'const codes: Record<string, string> ='],
  ["function area(input, unit = 'sqm', style = 'auto') {", "function area(input: string | number, unit: AreaUnit = 'sqm', style: NumberStyle = 'auto'): AreaResult {"],
  ['function normalizeListing(record) {', 'function normalizeListing(record: Listing): NormalizedListing {'],
  ['function normalizeBatch(records) {', 'function normalizeBatch(records: unknown[]): { total: number; valid: number; invalid: number; results: BatchRow[] } {'],
  ['const results = records.map((record, index) => {', 'const results: BatchRow[] = records.map((record, index): BatchRow => {'],
  ['...normalizeListing(record)', '...normalizeListing(record as Listing)'],
  ['error: error.message', 'error: error instanceof Error ? error.message : String(error)'],
  ['module.exports = { parseNumber: number, parsePrice: price, convertArea: area, normalizeListing, normalizeBatch, AREA_FACTORS: FACTORS };', 'export { number as parseNumber, price as parsePrice, area as convertArea, normalizeListing, normalizeBatch, FACTORS as AREA_FACTORS };']
];
for (const [before, after] of replacements) {
  if (!source.includes(before) || source.indexOf(before) !== source.lastIndexOf(before)) throw Error('JSR conversion contract: ' + before);
  source = source.replace(before, after);
}
fs.mkdirSync(path.join(root, 'jsr'), {recursive: true});
fs.writeFileSync(path.join(root, 'jsr/core.ts'), source);
