# prismjs-sphinx

[Sphinx]: https://github.com/sphinx-doc/sphinx "Sphinx"
[sphinx_rtd_theme]: https://github.com/readthedocs/sphinx_rtd_theme "sphinx_rtd_theme"
[PrismJS]: https://github.com/PrismJS/prism "PrismJS"
[GitHub issues]: https://github.com/barseghyanartur/faker-file/issues "GitHub issues"

[Sphinx](Sphinx) adapter for [PrismJS](PrismJS).

``prismjs-sphinx`` is a lightweight CSS/JS library designed to seamlessly integrate 
[Sphinx](Sphinx)'s ``:download:`` directive with [PrismJS](PrismJS). The library 
aims to simplify the implementation process and offer an efficient way to beautify 
your Sphinx-generated documentation with [PrismJS](PrismJS).

## Features

### PrismJS themes for Sphinx

Standalone [PrismJS](PrismJS) themes based on [Sphinx](Sphinx)'s aesthetics.

Included themes:

- [Sphinx RTD theme](sphinx_rtd_theme)

### PrismJS Sphinx adapter

Extends [Sphinx](Sphinx) ``:download:`` directive for more interactive code 
snippets and enables testing of Python code snippets for correctness.

## Installation

### Via CDN (jsDelivr)

To use both the theme and adapter in your HTML:

```html
<!-- CSS for PrismJS-RTD-Theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css">

<!-- JS for PrismJS-Sphinx-Adapter -->
<script src="https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/js/download_adapter.js">
</script>
```

## Sphinx integration

To integrate both into your [Sphinx](Sphinx) project, add the following in 
your ``conf.py``:

```python
html_css_files = [
    "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css",
    # other CSS files
]

html_js_files = [
    "https://cdn.jsdelivr.net/gh/YourGitHubUsername/prismjs-sphinx/src/js/download_adapter.js",
    # other JS files
]
```

## License

MIT

## Support
For security issues contact me at the e-mail given in the [Author](#Author) section.

For overall issues, go to [GitHub issues](GitHub issues).

## Author

Artur Barseghyan [artur.barseghyan@gmail.com](artur.barseghyan@gmail.com).
