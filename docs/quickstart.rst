Quick start: one listing to a reviewable batch
==============================================

Node.js
-------

Install into your own project, then save the example as ``import.mjs``.

.. code-block:: console

   npm install novasia-listing-normalizer
   node import.mjs

.. code-block:: javascript

   import { normalizeBatch } from 'novasia-listing-normalizer';

   const report = normalizeBatch([
     {id: 'demo-1', priceText: 'THB 3500000', areaText: '80',
       areaUnit: 'sqm', numberStyle: 'dot'},
     {id: 'demo-2', priceText: '$120000', areaText: '80',
       areaUnit: 'sqm', numberStyle: 'dot'}
   ]);
   console.log(report.valid, report.invalid); // 1 1
   console.log(report.results[0].normalized.pricePerSqm); // 43750
   console.log(report.results[1].error);
   // The $ symbol is ambiguous. Select its currency.

The unresolved dollar is an error to review, not a reason to discard the valid
row. Preserve the original record, its stable ID and the report together.
For CommonJS use ``require('novasia-listing-normalizer')``.

Deno / JSR
----------

.. code-block:: console

   deno add jsr:@novasia-estate/listing-normalizer

.. code-block:: typescript

   import { convertArea } from '@novasia-estate/listing-normalizer';
   console.log(convertArea('1-2-50', 'deed').sqm); // 2600

The JSR package is a native ESM distribution of the same parsing rules.
The filesystem CLI is supplied by npm, not JSR.

JSON command line
-----------------

After npm installation, save an array of input records in ``listings.json``:

.. code-block:: json

   [{"priceText":"USD 120000","areaText":"80","areaUnit":"sqm","numberStyle":"dot"}]

.. code-block:: console

   npx novasia-normalize listings.json > report.json

This returns price ``120000``, area ``80`` and price per square metre ``1500``.
The input is never rewritten. ``-`` reads standard input; no argument also reads
standard input. A UTF-8 byte-order mark is accepted.

.. list-table:: Exit status
   :header-rows: 1
   :widths: 15 85

   * - Code
     - Meaning
   * - 0
     - All records were normalized.
   * - 1
     - A report was produced, but at least one row failed.
   * - 2
     - Unreadable file, invalid JSON, invalid array shape or oversized input.

Batch input is limited to 10,000 records and CLI input to 4 MiB. A row-error
report is still useful output: inspect ``invalid`` before accepting a feed.
