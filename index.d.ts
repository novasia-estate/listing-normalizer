export type NumberStyle = 'auto' | 'dot' | 'comma';
export type AreaUnit = 'sqm' | 'sqft' | 'rai' | 'wah' | 'are' | 'hectare' | 'deed';
export interface Listing {
  priceText: string; currency?: string; areaText: string;
  areaUnit: AreaUnit; numberStyle?: NumberStyle;
  [key: string]: unknown;
}
export interface NormalizedListing {
  original: Listing;
  normalized: {price: number; currency: string; areaSqm: number; pricePerSqm: number};
  interpretation: string; warnings: string[];
}
export type BatchRow = ({index: number; ok: true} & NormalizedListing) | {index: number; ok: false; error: string; original: unknown};
export function normalizeListing(record: Listing): NormalizedListing;
export function normalizeBatch(records: unknown[]): {total: number; valid: number; invalid: number; results: BatchRow[]};
export function parseNumber(input: string | number, style?: NumberStyle): number;
export function parsePrice(input: string, options?: {style?: NumberStyle; currency?: string}): {original: string; amount: number; currency: string; interpretation: string; abbreviated: boolean};
export function convertArea(input: string | number, unit?: AreaUnit, style?: NumberStyle): {original: string; unit: AreaUnit; sqm: number; sqft: number; rai: number};
export const AREA_FACTORS: Readonly<Record<Exclude<AreaUnit, 'deed'>, number>>;
declare const api: {normalizeListing: typeof normalizeListing; normalizeBatch: typeof normalizeBatch; parseNumber: typeof parseNumber; parsePrice: typeof parsePrice; convertArea: typeof convertArea; AREA_FACTORS: typeof AREA_FACTORS};
export default api;
