# prismjs-sphinx

[Sphinx]: https://github.com/sphinx-doc/sphinx "Sphinx"
[sphinx-rtd-theme]: https://github.com/readthedocs/sphinx_rtd_theme "sphinx-rtd-theme"
[PrismJS]: https://github.com/PrismJS/prism "PrismJS"
[GitHub issues]: https://github.com/barseghyanartur/prismjs-sphinx/issues "GitHub issues"
[faker-file documentation]: https://faker-file.readthedocs.io/en/latest/creating_pdf.html#building-pdfs-with-text-using-reportlab "faker-file documentation"

[Sphinx][Sphinx] adapter for [PrismJS][PrismJS].

``prismjs-sphinx`` is a lightweight CSS/JS library designed to seamlessly integrate 
[Sphinx][Sphinx]'s ``:download:`` directive with [PrismJS][PrismJS]. The library 
aims to simplify the implementation process and offer an efficient way to beautify 
your Sphinx-generated documentation with [PrismJS][PrismJS].

## Features

### PrismJS themes for Sphinx

Standalone [PrismJS][PrismJS] themes based on [Sphinx][Sphinx]'s aesthetics.

Included themes:

- [Sphinx RTD theme][sphinx-rtd-theme]

### PrismJS Sphinx adapter

Extends [Sphinx][Sphinx] ``:download:`` directive for more interactive code 
snippets and enables testing of Python code snippets for correctness.

## Installation

### Via CDN (jsDelivr)

To use both the theme and adapter in your HTML:

```html
<!-- CSS for PrismJS Sphinx RTD theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css">

<!-- JS for PrismJS Sphinx Adapter -->
<script src="https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/js/download_adapter.js">
</script>
```

## Sphinx integration

### Configuration

To integrate both into your [Sphinx][Sphinx] project, add the following in 
your ``conf.py``:

```python
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
```

A complete configuration example, together with loaded [PrismJS][PrismJS] and 
the toolbar with plugins, would look as follows:

```python
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
```

### Markup

In your Sphinx RST (reStructuredText) files, you can define code snippets and 
download links as follows:

```rst
.. literalinclude:: _static/examples/creating_pdf/reportlab_1.py
    :language: python
    :lines: 4-7, 11-

*See the full example*
:download:`here <_static/examples/creating_pdf/reportlab_1.py>`
```

This markup does a couple of things:

- The ``literalinclude`` directive embeds a portion of the code (lines 4-7 
  and lines from 11 to the end) from a file located 
  at ``_static/examples/creating_pdf/reportlab_1.py``.
- The ``:download:`` directive allows the user to download the entire file.
  The provided ``download_adapter.js`` ensures that files are downloaded and 
  shown in-line.

See the [faker-file documentation][faker-file documentation] as a demo. Click
on any ``See the full example`` link to see how it works.

## License

MIT

## Support
For security issues contact me at the e-mail given in the [Author](#Author) section.

For overall issues, go to [GitHub issues][GitHub issues].

## Author

Artur Barseghyan [artur.barseghyan@gmail.com](artur.barseghyan@gmail.com).
