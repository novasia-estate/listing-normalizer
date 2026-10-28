# NovAsia Listing Normalizer

Turn multilingual property prices and land areas into reviewable listing data: explicit currency labels, square metres, price per m² and row-level errors. A small SDK and JSON command-line tool from [NovAsia Estate](https://novasia.estate/).

Useful for estate agents importing spreadsheet feeds, property analysts checking mixed area units and developers building real estate catalogues. It handles English/Russian magnitude suffixes and common currency codes/symbols, including THB/IDR/KHR. It does not infer exchange rates, legal land boundaries or the currency behind `$`.

## Quick start

```sh
npm install novasia-listing-normalizer
```

```js
import { normalizeListing, normalizeBatch } from 'novasia-listing-normalizer';
const row = normalizeListing({
  priceText: 'THB 3,5 млн', currency: 'THB',
  areaText: '80', areaUnit: 'sqm', numberStyle: 'comma'
});
console.log(row.normalized);
// { price: 3500000, currency: 'THB', areaSqm: 80, pricePerSqm: 43750 }
```

CommonJS: `const { normalizeListing } = require('novasia-listing-normalizer')`.

### JSR / Deno / web-standard ESM

The JSR distribution uses native TypeScript ESM, with the same parsing rules as
the npm distribution. It contains no CommonJS imports or runtime dependencies.

```sh
deno add jsr:@novasia-estate/listing-normalizer
```

```ts
import { normalizeBatch } from '@novasia-estate/listing-normalizer';
console.log(normalizeBatch([
  {priceText: 'USD 120000', areaText: '80', areaUnit: 'sqm', numberStyle: 'dot'},
  {priceText: '$120000', areaText: '80', areaUnit: 'sqm'}
]));
// One valid row; the unresolved dollar is returned as a row-level error.
```

API reference is generated from the typed exports. JSR package contents are
limited to the ESM source, README, MIT license and synthetic example fixture.
The Node-only filesystem CLI remains available through the npm distribution.
These are two supported distribution formats of the same library.

## Batch reports and CLI

`normalizeBatch(array)` preserves row indices and original records. A bad row becomes `{index, ok:false, error, original}` while valid rows continue. At most 10,000 records per batch.

```sh
novasia-normalize listings.json > report.json
cat listings.json | novasia-normalize -
```

The CLI never changes source files. Exit 0: all valid; 1: row errors; 2: unreadable/invalid JSON or request shape. Input limit 4 MiB. [Example input](https://github.com/novasia-estate/listing-normalizer/blob/main/examples/listings.json) deliberately contains an unresolved `$` row to demonstrate validation. Its numbers are synthetic examples, not property offers.

## Parsing rules

Required listing fields: `priceText`, `areaText`, `areaUnit`. Optional: `currency`, `numberStyle` (`auto`, `dot`, `comma`), and your own id/metadata. Currency codes must be uppercase three-letter labels. Recognized inline codes are THB, USD, IDR, EUR, GBP, RUB, AUD, SGD and KHR; symbols ฿, €, £ and ₽ are explicit, while `$` requires a caller label. Conflicting labels are rejected. No currency conversion occurs.

Explicit number style is recommended for imports. In auto mode a single separator followed by three digits is treated as grouping: `1.234` means 1234. Both the interpretation and a warning accompany the result. Use dot style for decimal 1.234. Mixed separators use the rightmost separator as decimal, with validated thousands grouping. Malformed groups, ranges, negative amounts and non-finite values fail. Price is rounded to two decimals and limited to 1 trillion; price per m² is rounded to two decimals.

Supported area units: m² (`sqm`), square feet (`sqft`), Thai rai, square wah, are, hectare and Thai `rai-ngan-square wah` (`deed`). `1-2-50` means 2,600 m²; the ngan part is 0–3 and the final part below 100. Area is positive. Unit conversion does not determine title size, net/gross usable area or buildability.

Exports: `parseNumber`, `parsePrice`, `convertArea`, `normalizeListing`, `normalizeBatch`, `AREA_FACTORS`. TypeScript declarations included. Node 22+, no runtime dependencies, install scripts, telemetry, network calls or API keys. JavaScript floating-point arithmetic is suitable for data normalization, not settlement accounting; use an appropriate decimal library for payable amounts.

## Try it and learn more

- [Interactive price and area demo](https://tools.novasia.estate/normalizer.html)
- [NovAsia Estate — property projects and research in Southeast Asia](https://novasia.estate/)
- [English buyer guides](https://novasia.estate/en/)
- [Source and issues](https://github.com/novasia-estate/listing-normalizer)

The SDK shares its tested parsing core with the NovAsia browser normalizer, adding batch error reports, typed imports and a CLI for real data pipelines. It is a distinct developer utility, not a copy of the rental yield calculator.

## Development

```sh
npm test
node build-jsr.cjs
node cli.cjs examples/listings.json
```

The example command exits 1 because one row needs a currency. MIT licensed.
