==============
prismjs-sphinx
==============

.. Dependencies

.. _Sphinx: https://github.com/sphinx-doc/sphinx
.. _PrismJS: https://github.com/PrismJS/prism
.. _sphinx-rtd-theme: https://github.com/readthedocs/sphinx_rtd_theme
.. _alabaster: https://github.com/sphinx-doc/alabaster
.. _sphinx-material: https://github.com/bashtage/sphinx-material
.. _sphinx-bootstrap-theme: https://pypi.org/project/sphinx-bootstrap-theme/
.. _furo: https://github.com/pradyunsg/furo

.. Project

.. _GitHub issues: https://github.com/barseghyanartur/prismjs-sphinx/issues

.. Demos

.. _sphinx-rtd-theme demo: https://prismjs-sphinx.readthedocs.io/en/sphinx_rtd_theme/examples.html
.. _alabaster demo: https://prismjs-sphinx.readthedocs.io/en/alabaster/examples.html
.. _sphinx-material demo: https://prismjs-sphinx.readthedocs.io/en/sphinx_material/examples.html
.. _sphinx-bootstrap demo: https://prismjs-sphinx.readthedocs.io/en/bootstrap/examples.html
.. _furo demo: https://prismjs-sphinx.readthedocs.io/en/furo/examples.html
.. _faker-file documentation: https://faker-file.readthedocs.io/en/latest/creating_pdf.html#building-pdfs-with-text-using-reportlab

`Sphinx`_ adapter for `PrismJS`_.

``prismjs-sphinx`` is a lightweight CSS/JS library designed to seamlessly
integrate `Sphinx`_'s ``:download:`` directive with `PrismJS`_. The library
aims to simplify the implementation process and offer an efficient way to
beautify your `Sphinx`_-generated documentation with `PrismJS`_.

Features
========

PrismJS themes for Sphinx
-------------------------

Standalone `PrismJS`_ themes based on `Sphinx`_'s aesthetics.

Included themes:

- `sphinx-rtd-theme`_ (key: ``sphinx_rtd_theme``, `sphinx-rtd-theme demo`_)
- `alabaster`_ (key: ``alabaster``, `alabaster demo`_)
- `sphinx-material`_ (key: ``sphinx_material``, `sphinx-material demo`_)
- `sphinx-bootstrap-theme`_ (key: ``bootstrap``, `sphinx-bootstrap demo`_)
- `furo`_ (key: ``furo``, `furo demo`_)

PrismJS Sphinx adapter
----------------------

Extends `Sphinx`_ ``:download:`` directive for more interactive code snippets
and which allows you to test the Python code snippets for correctness and
therefore leads to more accurate documentation.

Installation
============

Via CDN (jsDelivr)
------------------

To use both the theme and adapter in your HTML:

.. code-block:: html

   <!-- CSS for PrismJS Sphinx RTD theme -->
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css">

   <!-- JS for PrismJS Sphinx Adapter -->
   <script src="https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/js/download_adapter.js">
   </script>

Sphinx integration
==================

Configuration
-------------

To integrate both into your `Sphinx`_ project, add the following in your ``conf.py``:

.. code-block:: python

   # ************************************************************
   # ************************** The theme ***********************
   # ************************************************************
   html_theme = "sphinx_rtd_theme"

   # ************************************************************
   # ***************** Additional JS/CSS files ******************
   # ************************************************************
   html_css_files = [
       # ...
       "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css",
       # ...
   ]

   html_js_files = [
       # ...
       "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/js/download_adapter.js",
       # ...
   ]

A complete configuration example, together with loaded `PrismJS`_ and the
toolbar with plugins, would look as follows:

.. code-block:: python

   prismjs_base = "//cdnjs.cloudflare.com/ajax/libs/prism/1.29.0"

   html_css_files = [
       f"{prismjs_base}/themes/prism.min.css",
       f"{prismjs_base}/plugins/toolbar/prism-toolbar.min.css",
       f"{prismjs_base}/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.css",
       "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css",
   ]

   html_js_files = [
       f"{prismjs_base}/prism.min.js",
       f"{prismjs_base}/plugins/autoloader/prism-autoloader.min.js",
       f"{prismjs_base}/plugins/toolbar/prism-toolbar.min.js",
       f"{prismjs_base}/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js",
       "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/js/download_adapter.js",
   ]

----

You can also use other `Sphinx`_ themes, such as `alabaster`_, `sphinx-bootstrap-theme`_,
`sphinx-material`_ or `furo`_.

`alabaster`_, `furo`_, `sphinx-bootstrap-theme`_ and `sphinx-material`_ do
require loading jQuery in the ``html_js_files``.

.. code-block:: python

   html_js_files.insert(
       0,
       "//cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
   )

Make sure to specify appropriate value (theme key) in ``html_theme``,
as follows (pick one):

.. code-block:: python

   html_theme = "alabaster"
   html_theme = "sphinx_rtd_theme"
   html_theme = "sphinx_material"
   html_theme = "bootstrap"
   html_theme = "furo"

Finally, make sure to specify correct path to the desired theme:

.. code-block:: python

   html_css_files = [
       # ...
       f"https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/{html_theme}.css",
   ]

Markup
------

In your Sphinx RST (reStructuredText) files, you can define code snippets and
download links as follows:

.. code-block:: rst

   .. literalinclude:: _static/examples/creating_pdf/reportlab_1.py
       :language: python
       :lines: 4-7, 11-

   *See the full example*
   :download:`here <_static/examples/creating_pdf/reportlab_1.py>`

This markup does a couple of things:

- The ``literalinclude`` directive embeds a portion of the code (lines 4-7
  and lines from 11 to the end) from a file located
  at ``_static/examples/creating_pdf/reportlab_1.py``.
- The ``:download:`` directive allows the user to download the entire file.
  The provided ``download_adapter.js`` ensures that files are downloaded and
  shown in-line.

Demos
=====

Available demos:

- `sphinx-rtd-theme demo`_
- `alabaster demo`_
- `sphinx-material demo`_
- `sphinx-bootstrap demo`_
- `furo demo`_
- `faker-file documentation`_

Click on any ``See the full example`` link to see how it works.

License
=======

MIT

Support
=======

For security issues contact me at the e-mail given in the `Author`_ section.

For overall issues, go to `GitHub issues`_.

Author
======

Artur Barseghyan
`artur.barseghyan@gmail.com <artur.barseghyan@gmail.com>`__.
