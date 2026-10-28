'use strict';
  const FACTORS = Object.freeze({ sqm: 1, sqft: 0.09290304, rai: 1600, wah: 4, are: 100, hectare: 10000 });
  function number(input, style = 'auto') {
    if (!['auto', 'dot', 'comma'].includes(style)) throw Error('Choose a valid number format.');
    let value = String(input).trim().replace(/[\s\u00a0\u202f']/g, '');
    if (!value || value.length > 100 || !/^[+]?\d[\d.,]*$/.test(value)) throw Error('Enter one nonnegative number, without a range.');
    let decimal = style === 'comma' ? ',' : '.';
    if (style === 'auto') {
      const dot = value.lastIndexOf('.'), comma = value.lastIndexOf(',');
      if (dot >= 0 && comma >= 0) decimal = dot > comma ? '.' : ',';
      else if (dot >= 0 || comma >= 0) {
        const sep = dot >= 0 ? '.' : ',';
        const parts = value.split(sep);
        if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) decimal = sep === '.' ? ',' : '.';
        else decimal = sep;
      }
    }
    const grouping = decimal === '.' ? ',' : '.';
    const halves = value.split(decimal);
    if (halves.length > 2 || (halves.length === 2 && !/^\d+$/.test(halves[1]))) throw Error('Invalid decimal separator.');
    const groups = halves[0].replace(/^\+/, '').split(grouping);
    if (groups.length > 1 && (!/^\d{1,3}$/.test(groups[0]) || groups.slice(1).some(part => !/^\d{3}$/.test(part)))) throw Error('Thousands groups must contain three digits. Choose the number format explicitly if needed.');
    value = groups.join('') + (halves.length === 2 ? '.' + halves[1] : '');
    const result = Number(value);
    if (!Number.isFinite(result) || result > 1e12) throw Error('Use a finite value no larger than 1 trillion.');
    return result;
  }
  function price(input, { style = 'auto', currency = '' } = {}) {
    const original = String(input).trim();
    if (!original || original.length > 200) throw Error('Enter a price, for example THB 3.5 million.');
    let rest = original;
    const detected = new Set();
    const codes = { '฿': 'THB', '€': 'EUR', '£': 'GBP', '₽': 'RUB' };
    rest = rest.replace(/THB|USD|IDR|EUR|GBP|RUB|AUD|SGD|KHR|฿|€|£|₽/gi, match => { detected.add(codes[match] || match.toUpperCase()); return ' '; });
    rest = rest.replace(/\$/g, () => { if (!currency) throw Error('The $ symbol is ambiguous. Select its currency.'); return ' '; });
    if (detected.size > 1) throw Error('One price cannot contain multiple currencies.');
    const code = [...detected][0] || currency;
    if (currency && detected.size && currency !== code) throw Error('Selected currency conflicts with the price text.');
    if (!/^[A-Z]{3}$/.test(code)) throw Error('Select a currency or include its three-letter code. No exchange-rate conversion is performed.');
    let multiplier = 1, suffixCount = 0;
    rest = rest.replace(/(?:billion|миллиард(?:а|ов)?|млрд|bn|b|million|миллион(?:а|ов)?|млн|mn|m|thousand|тысяч(?:а|и)?|тыс|k)\.?\s*$/i, match => {
      suffixCount++;
      const s = match.trim().replace(/\.$/, '').toLowerCase();
      multiplier = /^(b|bn|billion|млрд|миллиард)/.test(s) ? 1e9 : /^(k|thousand|тыс)/.test(s) ? 1e3 : 1e6;
      return '';
    });
    const amount = number(rest, style) * multiplier;
    if (!Number.isFinite(amount) || amount > 1e12) throw Error('Price must be no larger than 1 trillion.');
    return { original, amount: Math.round(amount * 100) / 100, currency: code, interpretation: style === 'auto' ? 'Auto: one separator followed by exactly 3 digits is a thousands separator. Choose dot/comma explicitly to override.' : `Explicit ${style} decimal separator.`, abbreviated: suffixCount > 0 };
  }
  function area(input, unit = 'sqm', style = 'auto') {
    const original = String(input).trim();
    let sqm;
    if (unit === 'deed') {
      const match = original.match(/^(\d+)\s*-\s*([0-3])\s*-\s*(\d+(?:\.\d+)?)$/);
      if (!match || Number(match[3]) >= 100) throw Error('Use rai-ngan-square wah, e.g. 1-2-50; ngan 0–3 and square wah below 100.');
      sqm = Number(match[1]) * 1600 + Number(match[2]) * 400 + Number(match[3]) * 4;
    } else {
      if (!(unit in FACTORS)) throw Error('Select a supported area unit.');
      sqm = number(original, style) * FACTORS[unit];
    }
    if (!(sqm > 0) || sqm > 1e12) throw Error('Area must be positive and no larger than 1 trillion m².');
    return { original, unit, sqm, sqft: sqm / FACTORS.sqft, rai: sqm / 1600 };
  }

function normalizeListing(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('Each listing must be an object.');
  if (typeof record.priceText !== 'string' || typeof record.areaText !== 'string') throw new TypeError('priceText and areaText must be strings.');
  if (typeof record.areaUnit !== 'string') throw new TypeError('areaUnit must be explicit: sqm, sqft, rai, wah, are, hectare or deed.');
  const style = record.numberStyle === undefined ? 'auto' : record.numberStyle;
  const money = price(record.priceText, { style, currency: record.currency || '' });
  const size = area(record.areaText, record.areaUnit, style);
  const perSqm = money.amount / size.sqm;
  if (!Number.isFinite(perSqm) || perSqm > 1e15) throw new RangeError('Price per square metre exceeds the supported range.');
  return {
    original: { ...record },
    normalized: { price: money.amount, currency: money.currency, areaSqm: size.sqm,
      pricePerSqm: Math.round(perSqm * 100) / 100 },
    interpretation: money.interpretation,
    warnings: style === 'auto' ? ['Auto separator interpretation is heuristic. Use numberStyle dot or comma for ambiguous input.'] : []
  };
}
function normalizeBatch(records) {
  if (!Array.isArray(records) || records.length > 10000) throw new TypeError('Provide an array of at most 10,000 listings.');
  const results = records.map((record, index) => {
    try { return { index, ok: true, ...normalizeListing(record) }; }
    catch (error) { return { index, ok: false, error: error.message, original: record }; }
  });
  return { total: results.length, valid: results.filter(row => row.ok).length,
    invalid: results.filter(row => !row.ok).length, results };
}
module.exports = { parseNumber: number, parsePrice: price, convertArea: area, normalizeListing, normalizeBatch, AREA_FACTORS: FACTORS };
