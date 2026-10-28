From a spreadsheet feed to evidence review
==========================================

Normalization is one stage in a property-data pipeline. A useful import keeps
uncertainty visible instead of converting missing information into apparent
precision. The related tools below do different jobs; none verifies legal
ownership, availability or a promised rental return.

1. Map and inspect the source columns
-------------------------------------

Use `CSV Quality Lab <https://huggingface.co/spaces/novasia-estate/csv-quality-lab>`_
to inspect a table, map columns and review row-level problems before import.
Keep a stable listing ID and preserve original price, area, source and observed
date. Do not upload private customer data to a public example or issue report.

2. Normalize explicit values
----------------------------

Map the feed to ``priceText``, ``areaText`` and ``areaUnit``. Set ``currency``
only when established from the source. Set ``numberStyle`` for that feed.
Run ``normalizeBatch`` and retain failed rows for review rather than dropping
them invisibly. ``original`` preserves supplied metadata, but does not establish
its truth or automatically extract provenance.

3. Validate the target contract
-------------------------------

`Property Schema Validator <https://sourceforge.net/projects/novasia-property-validator/>`_
checks a separate listing-data contract. Its code and schema are also available
in the `company repository <https://github.com/novasia-estate/property-schema-validator>`_.

The normalizer output is not a drop-in validator record. Map field names and
serialize monetary/area values to the decimal strings required by that schema;
carry explicit currency, units and provenance separately. Check the validator's
required fields before exporting. Do not invent a source date to make a record
pass. A valid schema is evidence of shape, not evidence that an offer is correct.

4. Track what needs rechecking
------------------------------

`Evidence Freshness Ledger <https://gitlab.com/novasia/evidence-freshness-ledger>`_
records provenance and review timing. A stale observation is a prompt to recheck
the underlying source. A recent timestamp alone does not authenticate a claim.

For the human research context, visit the publisher's
`Southeast Asia property guides <https://novasia.estate/en/>`_.
Tools and research have different jobs: parsing a price does not confirm that a
unit can be bought at that price.

.. note::

   The worked values are synthetic. This workflow supplies no live property
   inventory, exchange rates, title assessment or jurisdiction-specific advice.
