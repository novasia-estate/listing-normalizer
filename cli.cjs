#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const { normalizeBatch } = require('./index.cjs');
if (process.argv.includes('--help')) {
  console.log('novasia-normalize [listings.json|-]\nRead a JSON array; emit a report to stdout. Invalid rows give exit 1; invalid input gives exit 2. No files are changed.');
} else {
  try {
    if (process.argv.length > 3) throw Error('Use one JSON file path or - for stdin.');
    const path = process.argv[2] || '-';
    const chunks = []; let size = 0;
    const fd = path === '-' ? 0 : fs.openSync(path, 'r');
    try {
      const buffer = Buffer.alloc(65536); let read;
      while ((read = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) {
        size += read;
        if (size > 4 * 1024 * 1024) throw Error('Input is limited to 4 MiB.');
        chunks.push(Buffer.from(buffer.subarray(0, read)));
      }
    } finally { if (fd !== 0) fs.closeSync(fd); }
    const report = normalizeBatch(JSON.parse(Buffer.concat(chunks).toString('utf8').replace(/^\uFEFF/, '')));
    console.log(JSON.stringify(report, null, 2));
    if (report.invalid) process.exitCode = 1;
  } catch (error) { console.error('Invalid input: ' + error.message); process.exitCode = 2; }
}
