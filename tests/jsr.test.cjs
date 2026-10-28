'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const npm = require('../index.cjs');
test('JSR code generation is current', () => {
  const file = path.join(__dirname, '../jsr/core.ts');
  const before = fs.readFileSync(file, 'utf8');
  const result = spawnSync(process.execPath, [path.join(__dirname, '../build-jsr.cjs')]);
  assert.equal(result.status, 0, String(result.stderr));
  assert.equal(fs.readFileSync(file, 'utf8'), before);
});
test('JSR and npm agree on mixed units, ambiguity, failures and metadata', async () => {
  const jsr = await import('../jsr/mod.ts');
  const cases = JSON.parse(fs.readFileSync(path.join(__dirname, '../examples/listings.json'), 'utf8'));
  cases.push({id:'deed', priceText:'THB 3,5 млн', areaText:'1-2-50', areaUnit:'deed', numberStyle:'comma'});
  cases.push({id:'invalid', priceText:'USD -100', areaText:'0', areaUnit:'sqm'});
  assert.deepEqual(jsr.normalizeBatch(cases), npm.normalizeBatch(cases));
  for (const [value, style] of [['1.234','dot'], ['1.234','auto'], ['1,234,567.89','auto'], ['1.234.567,89','auto']]) {
    assert.equal(jsr.parseNumber(value, style), npm.parseNumber(value, style));
  }
  assert.deepEqual(jsr.AREA_FACTORS, npm.AREA_FACTORS);
  assert.ok(Object.isFrozen(jsr.AREA_FACTORS));
});
