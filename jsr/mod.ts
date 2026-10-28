import * as core from './core.ts';
import type { NumberStyle, AreaUnit, Listing, NormalizedListing, BatchRow, PriceResult, AreaResult } from './types.ts';
export type { NumberStyle, AreaUnit, Listing, NormalizedListing, BatchRow, PriceResult, AreaResult } from './types.ts';

/**
 * Parse a nonnegative finite number with validated grouping, capped at 1e12.
 * Auto mode interprets a single separator followed by 3 digits as grouping.
 * @example `parseNumber('1.234', 'dot')` returns 1.234.
 */
export function parseNumber(input: string | number, style: NumberStyle = 'auto'): number {
  return core.parseNumber(input, style);
}

/**
 * Parse a property price. Supports English/Russian magnitudes; rejects currency
 * conflicts and unresolved dollars. Rounds to two decimals; never converts FX.
 * @example `parsePrice('THB 3,5 млн', {style: 'comma'}).amount` is 3500000.
 */
export function parsePrice(input: string, options: {style?: NumberStyle; currency?: string} = {}): PriceResult {
  return core.parsePrice(input, options);
}

/**
 * Convert positive land/floor area into square metres, square feet and rai.
 * @example `convertArea('1-2-50', 'deed').sqm` returns 2600.
 */
export function convertArea(input: string | number, unit: AreaUnit = 'sqm', style: NumberStyle = 'auto'): AreaResult {
  return core.convertArea(input, unit, style);
}

/**
 * Normalize one listing with explicit units, native currency and price per m².
 * Preserves the original record; throws on invalid input. Auto mode adds a warning.
 * @example
 * ```ts
 * normalizeListing({priceText: 'USD 120000', areaText: '80', areaUnit: 'sqm', numberStyle: 'dot'}).normalized.pricePerSqm;
 * // 1500
 * ```
 */
export function normalizeListing(record: Listing): NormalizedListing {
  return core.normalizeListing(record);
}

/**
 * Validate up to 10,000 rows independently, retaining errors and source indices.
 * Use explicit number styles; a failed row is a review task, not a zero price.
 */
export function normalizeBatch(records: unknown[]): {total: number; valid: number; invalid: number; results: BatchRow[]} {
  return core.normalizeBatch(records);
}

/** Square-metre factors for supported scalar units; immutable at runtime. */
export const AREA_FACTORS: Readonly<Record<Exclude<AreaUnit, 'deed'>, number>> = core.AREA_FACTORS;
