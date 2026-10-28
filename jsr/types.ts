/** Explicit decimal convention. Auto mode reports its heuristic interpretation. */
export type NumberStyle = 'auto' | 'dot' | 'comma';
/** Supported area labels; deed is Thai rai-ngan-square wah notation. */
export type AreaUnit = 'sqm' | 'sqft' | 'rai' | 'wah' | 'are' | 'hectare' | 'deed';
/** Source listing; unrelated metadata is preserved in the output. */
export interface Listing {
  /** Quoted price, optionally with a supported currency code and magnitude. */
  priceText: string;
  /** Explicit currency label, mandatory when the price uses an ambiguous $. */
  currency?: string;
  /** Area as text; positive, without a range. */
  areaText: string;
  /** Never inferred from the listing country. */
  areaUnit: AreaUnit;
  /** Prefer dot/comma for controlled spreadsheet imports. */
  numberStyle?: NumberStyle;
  /** Identifiers and extra metadata pass through without modification. */
  [key: string]: unknown;
}
/** Parsed money with its source and declared interpretation; no FX conversion. */
export interface PriceResult {
  original: string; amount: number; currency: string;
  interpretation: string; abbreviated: boolean;
}
/** Area equivalents; does not establish legal title or usable floor area. */
export interface AreaResult {
  original: string; unit: AreaUnit; sqm: number; sqft: number; rai: number;
}
/** Normalized listing and review notes. */
export interface NormalizedListing {
  original: Listing;
  normalized: {price: number; currency: string; areaSqm: number; pricePerSqm: number};
  interpretation: string;
  warnings: string[];
}
/** Row-level success or failure; one rejected row does not stop the batch. */
export type BatchRow = ({index: number; ok: true} & NormalizedListing) |
  {index: number; ok: false; error: string; original: unknown};
