No pragma
=========
.. External references

.. _Sphinx: https://github.com/sphinx-doc/sphinx
.. _jsphinx: https://jsphinx.readthedocs.io/
.. _MyPy: https://mypy.readthedocs.io/

.. Internal references

.. _no-pragma: http://jsphinx.readthedocs.io/en/latest/no-pragma.html
.. _no-pragma-demo: http://jsphinx.readthedocs.io/en/latest/no-pragma-demo.html

**Improve developer experience**:

- Write better docs.
- Do not repeat yourself.
- Assure code low-maintenance.

**TL;DR**

The `no-pragma`_ extension is meant for stripping pragma comments from source
code used in documentation.

----

Some say, "documentation is the king". Others argue - "no, demos are". While
some say, "testing is everything!" and yet there will be someone else who
will jump in with "write clean code! black, isort, mypy and ruff everywhere!"

And yet there's you, who want to be good and write a better package, because
there's a problem that needs to be fixed, and you know how, you want to share
it with the world. You also want to assure or at least make an effort in
making your project developer friendly, attractive for making contributions,
which eventually leads to continuous improvement and make it live long(er).

So, combining the best practices, you:

- Introduce examples in your repository to make it easier to start with.
- Write awesome docs with usage examples (by eventually repeating yourself,
  copying things from your actual code examples).
- Write tests for your code. Then you realize it's good to test the examples
  too.
- Introduce linters and `MyPy`_.

Then you invest your time in making sure all your code looks correct and fix
the never-ending `MyPy`_ issues.

Then you need to make a small change, which is unfortunately backwards
incompatible. You need to change the examples, the docs, the tests and the
examples tests. However, you need to push the change quickly. As many times
before, you skip documentation update, leaving it for "another time".

By that time you discover that code maintenance is a hell. You start to make
use of pragma comments.

Does this sound familiar?

----

What if I tell you that you are actually just good with making sure your
examples work and are covered with tests. Your documentation can directly
include code from your examples (code that is tested). You don't need to
choose or balance between readability, explainability and low-maintenance.

Written by lazy developer for lazy developers to improve developer experience
in writing low-maintenance code.

Features
========
- Accurately stips out pragma comments from your source code that you include
  in your documentation.


Usage example
=============

In order to move forward, you first need to get educate yourself a little on
`Sphinx`_'s directives. Namely the ``.. literalinclude::`` and ``:download:``.
For that, first read the `jsphinx`_ documentation.

But there might be a little problem with that. Of course you might be lucky and
have zero pragma comments in your code (no ``# noqa``,
no ``# type: ignore``, etc). But more often, you get at least a couple of
these. Your perfectionist nature doesn't easily allow you to let them be
part of your concise, beautiful documentation. Cursing me for earlier
advices, you start to replace your DRY documentation part with copy-pasted
examples.

This is where this package jumps in. It simply is a `Sphinx`_ extension that
strips all pragma comments from your code that goes into documentation.

Sphinx configuration
--------------------
**docs/conf.py**

.. code-block:: python

    extensions = [
        # ... other extensions
        "jsphinx.no_pragma",
        # ... other extensions
    ]

Code example
------------
**examples/example_1.py**

.. code-block:: python

    from typing import Any, Optional

    class ThirdPartyLibrary:
        @staticmethod
        def get_dynamic_object() -> Any:
            # Returns an object whose type is not known at compile time
            return "a string"  # In reality, this could be any type


    # Usage of the third-party library
    obj = ThirdPartyLibrary.get_dynamic_object()

    # Attempt to use the object as a string, even though its type is 'Any'
    length = len(obj)  # type: ignore

    # Deliberately long line to violate PEP 8 line length rule, suppressed with noqa
    print(f"The length of the object, a dynamically typed one, is just {length}")  # noqa

Given that this is your code structure:

.. code-block:: text

    ├── examples
    │  └── no_pragma_examples
    │     └── example_1.py
    ├── docs
    │  ├── conf.py
    │  ├── index.rst
    │  ├── make.bat
    │  ├── Makefile
    │  ├── _static
    │  │  └── no_pragma_examples
    │  │     └── example_1.py
    │  └── usage.rst
    ├── src
    │  ├── conf.py
    │  ├── index.rst
    ├── LICENSE
    ├── Makefile
    ├── pyproject.toml
    └── README.rst

Either use ``html_extra_path = ["examples"]`` or make a symlink to
``examples/no_pragma_examples/example_1.py`` from ``docs/_static/no_pragma_examples``.

Then include it in your docs as follows:

.. code-block:: rst

    .. container:: jsphinx-download

    .. literalinclude:: _static/no_pragma_examples/example_1.py
        :language: python
        :lines: 1-

    *See the full example*
    :download:`here <_static/no_pragma_examples/example_1.py>`

Now, rendered, your code will not contain `# type: ignore` or `# noqa` pragma
comments.

See `no-pragma-demo`_ for a demo. Click on the `See the full example here` link to see
the original code.
