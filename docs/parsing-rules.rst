Parsing rules and ambiguity
===========================

Currency is a label, not an exchange rate
-----------------------------------------

Recognized inline codes are THB, USD, IDR, EUR, GBP, RUB, AUD, SGD and KHR.
The explicit symbols ฿, €, £ and ₽ map to their corresponding codes. A bare
``$`` needs a caller-supplied ``currency``. Conflicting inline and selected
labels fail. A supplied currency label must contain three uppercase letters;
that syntax check does not establish that a code is an issued currency.

English and Russian suffixes for thousands, millions and billions are accepted,
including ``k``, ``million``, ``млн`` and ``млрд``. Ranges, negative prices,
unknown text and non-finite values fail. Zero price is accepted numerically;
your application must decide whether zero means a real price or missing data.

Choose a number style
---------------------

.. list-table:: The same characters can mean different numbers
   :header-rows: 1
   :widths: 25 25 50

   * - Input
     - Style
     - Result
   * - ``1.234``
     - ``auto``
     - 1234, with a heuristic warning on listing results
   * - ``1.234``
     - ``dot``
     - 1.234
   * - ``3,5``
     - ``comma``
     - 3.5
   * - ``1,234.50``
     - ``dot``
     - 1234.5

In auto mode one separator followed by exactly three digits is interpreted as
grouping. With both separators the rightmost is decimal. Thousands groups must
contain three digits after the first group. Spaces, nonbreaking spaces and
apostrophes are removed before parsing. Prefer an explicit style agreed with
the feed producer instead of guessing per row.

Area conversions
----------------

.. list-table:: Supported factors in square metres
   :header-rows: 1
   :widths: 35 65

   * - Unit
     - Factor / rule
   * - ``sqm``
     - 1
   * - ``sqft``
     - 0.09290304
   * - ``rai``
     - 1600
   * - ``wah``
     - 4 (square wah)
   * - ``are``
     - 100
   * - ``hectare``
     - 10000
   * - ``deed``
     - rai-ngan-square wah: ``1-2-50`` = 1600 + 800 + 200 = 2600

The deed notation requires ngan from 0 to 3 and square wah below 100. Its final
fraction uses a dot. Areas must be positive. Conversion does not determine
whether an area is land, net usable area, gross floor area or saleable area.
Do not compare price per m² across those definitions without reviewing them.

Numerical limits
----------------

Parsed numbers, prices after suffix expansion and converted square metres are
limited to 1 trillion. Price and price per m² are rounded to two decimals;
area conversion is not rounded to two decimals. Price per m² above 1 quadrillion
is rejected. JavaScript floating point is used: choose decimal arithmetic for
settlement amounts or legally payable instalments.
