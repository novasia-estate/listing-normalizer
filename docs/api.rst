API reference
=============

The npm TypeScript declarations and JSR typed exports document the same six
exports. The following signatures describe version 1.0.0.

normalizeListing(record)
------------------------

Required strings: ``priceText``, ``areaText`` and ``areaUnit``. Optional fields:
``currency`` and ``numberStyle`` (``auto`` by default, or ``dot`` / ``comma``).
Other fields, such as your ID or source URL, remain in ``original``.

Returns ``original``, ``normalized``, ``interpretation`` and ``warnings``.
``normalized`` contains numeric ``price``, ``areaSqm`` and ``pricePerSqm``, plus
the string ``currency``. Invalid input throws; it does not return null or zero
in place of an unparseable price. Original data is shallow-copied, not deep-cloned.

normalizeBatch(records)
-----------------------

Accepts an array of up to 10,000 entries. An invalid top-level shape throws.
Returns ``{total, valid, invalid, results}``. Each successful result adds
``index`` and ``ok: true`` to a normalized listing. Failed rows have
``{index, ok: false, error, original}``. Indices are zero-based.

parseNumber(input, style = 'auto')
----------------------------------

Returns a nonnegative finite number using the separator rules in
:doc:`parsing-rules`. It accepts strings or numbers. It does not parse currency
codes or magnitude suffixes. On its own it returns no heuristic-warning object.

parsePrice(input, options = {})
-------------------------------

``options`` accepts ``style`` and ``currency``. Returns ``original``, ``amount``,
``currency``, ``interpretation`` and the boolean ``abbreviated``. The last flag
means a magnitude suffix was present, not that the price has been verified.

convertArea(input, unit = 'sqm', style = 'auto')
------------------------------------------------

Returns ``original``, ``unit``, ``sqm``, ``sqft`` and ``rai``. It accepts only
the unit keys in :doc:`parsing-rules`; it does not extract units from free text.
For example, supply ``'80'`` with ``'sqm'``, not ``'80 sqm'`` as the number.

AREA_FACTORS
------------

A frozen object with scalar conversion factors for ``sqm``, ``sqft``, ``rai``,
``wah``, ``are`` and ``hectare``. ``deed`` is a structured notation and therefore
has no scalar factor in this object.

Compatibility and issue reports
-------------------------------

Use Node.js 22 or newer for npm. The JSR artifact has been exercised with Deno
and Node.js; other runtimes are not claimed as tested. A useful bug report
includes a sanitized synthetic input, expected interpretation, actual result,
runtime version and SDK version. Do not paste customer details or contracts.
Report reproducible issues in the
`company source repository <https://github.com/novasia-estate/listing-normalizer/issues>`_.
