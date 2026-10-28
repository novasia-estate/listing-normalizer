Troubleshooting and maintenance
===============================

The dollar symbol fails
-----------------------

``$`` is shared by several currencies. Add ``currency: 'USD'`` only if the
source establishes USD. Otherwise keep the row unresolved. Selecting USD just
to eliminate an error would introduce unsupported information.

The area or unit price is unexpectedly large
--------------------------------------------

Check ``numberStyle`` and the actual unit. In auto mode ``1.234`` becomes 1234.
Also distinguish square feet from square metres, and land area from interior
area. The SDK cannot infer these definitions from a number alone.

The report exists but the command failed
----------------------------------------

Exit 1 means one or more row errors. The JSON report is intentional and lists
both valid and invalid entries. Exit 2 is a request-level failure; inspect the
error on stderr. Do not treat a nonempty output file as proof of a clean import.

A zero price passed
-------------------

The parser accepts nonnegative prices. If your catalogue uses zero as an
unpublished-price placeholder, keep that policy outside the parser and require
manual review. Never turn an absent price into zero before calling the SDK.

Reproduce the software checks
-----------------------------

From a checkout of the public source repository:

.. code-block:: console

   npm test
   node build-jsr.cjs

The tests cover parsing, batch failures, CLI behavior and npm/JSR parity. They
do not prove market accuracy or legal correctness of user-supplied records.

Build these docs locally
------------------------

.. code-block:: console

   python -m pip install -r docs/requirements.txt
   python -m sphinx -W --keep-going -b html docs docs/_build/html

Read the Docs uses the repository's ``.readthedocs.yaml`` and pinned Sphinx/theme
versions. A documentation-only update does not require releasing a new npm or
JSR version. Code is MIT licensed; the repository includes the full licence.
