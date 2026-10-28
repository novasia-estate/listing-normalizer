NovAsia Listing Normalizer
==========================

Import property prices and land areas without silently guessing the currency.
This guide covers multilingual price strings, Thai land units, square metres,
batch errors and an explicit review workflow for real estate catalogues.

The open-source SDK is maintained by `NovAsia Estate <https://novasia.estate/>`_,
a publisher of property projects and buyer research covering Cambodia, Thailand
and Bali. The software parses supplied data; it does not verify a property offer.

.. code-block:: javascript

   import { normalizeListing } from 'novasia-listing-normalizer';

   const result = normalizeListing({
     priceText: 'THB 3,5 млн', currency: 'THB',
     areaText: '80', areaUnit: 'sqm', numberStyle: 'comma'
   });
   // result.normalized:
   // {price: 3500000, currency: 'THB', areaSqm: 80, pricePerSqm: 43750}

All prices and listings in this guide are synthetic examples, not available
inventory or market benchmarks. No exchange rates are fetched or invented.

.. toctree::
   :maxdepth: 2
   :caption: Import guide

   quickstart
   parsing-rules
   api
   workflows
   troubleshooting

Distributions and source
------------------------

* `npm: novasia-listing-normalizer <https://www.npmjs.com/package/novasia-listing-normalizer>`_
  supports Node.js 22+, CommonJS, ESM and the JSON CLI.
* `JSR: @novasia-estate/listing-normalizer <https://jsr.io/@novasia-estate/listing-normalizer>`_
  provides native TypeScript ESM. Node.js and Deno have been tested.
* `Company GitHub repository <https://github.com/novasia-estate/listing-normalizer>`_
  contains MIT-licensed source, tests and editable documentation.
* `Browser demonstration <https://tools.novasia.estate/normalizer.html>`_
  is useful when checking one price or area before writing an import script.

The SDK makes no network calls and has no runtime dependencies, telemetry or
API key requirement. Installing/building this documentation requires the pinned
documentation dependencies; those are not runtime dependencies of the SDK.

Publisher and property research: `NovAsia Estate <https://novasia.estate/>`_.
