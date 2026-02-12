Project source-tree
===================

Below is the layout of the project (to 10 levels), followed by
the contents of each key file.

.. code-block:: text
   :caption: Project directory layout

   jsphinx/
   ├── docs
   │   ├── _static
   │   │   ├── scripts
   │   │   │   └── download_adapter.js
   │   │   └── themes
   │   │       ├── alabaster.css
   │   │       ├── bootstrap.css
   │   │       ├── furo.css
   │   │       ├── pydata_sphinx_theme.css
   │   │       ├── sphinx_book_theme.css
   │   │       ├── sphinx_immaterial.css
   │   │       ├── sphinx_material.css
   │   │       └── sphinx_rtd_theme.css
   │   ├── examples
   │   │   └── simple
   │   │       ├── __init__.py
   │   │       ├── snippet_1.py
   │   │       ├── snippet_2.py
   │   │       ├── snippet_3.py
   │   │       └── snippet_4.py
   │   ├── changelog.rst
   │   ├── conf.py
   │   ├── documentation.rst
   │   ├── examples.rst
   │   ├── index.rst
   │   ├── llms.rst
   │   ├── make.bat
   │   ├── Makefile
   │   ├── readme.rst
   │   ├── requirements.in
   │   ├── requirements.txt
   │   ├── source_tree.rst
   │   ├── test_docs.py
   │   └── test_theme.py
   ├── examples
   │   └── simple
   │       ├── __init__.py
   │       ├── snippet_1.py
   │       ├── snippet_2.py
   │       ├── snippet_3.py
   │       └── snippet_4.py
   ├── src
   │   ├── css
   │   │   ├── alabaster.css
   │   │   ├── bootstrap.css
   │   │   ├── furo.css
   │   │   ├── pydata_sphinx_theme.css
   │   │   ├── sphinx_book_theme.css
   │   │   ├── sphinx_immaterial.css
   │   │   ├── sphinx_material.css
   │   │   └── sphinx_rtd_theme.css
   │   ├── js
   │   │   └── download_adapter.js
   │   └── jsphinx
   │       ├── __init__.py
   │       └── cdn.py
   ├── .pre-commit-config.yaml
   ├── .pre-commit-hooks.yaml
   ├── .readthedocs.yaml
   ├── CHANGELOG.rst
   ├── conftest.py
   ├── LICENSE
   ├── Makefile
   ├── package.json
   ├── pyproject.toml
   └── README.rst

.pre-commit-config.yaml
-----------------------

.. literalinclude:: ../.pre-commit-config.yaml
   :language: yaml
   :caption: .pre-commit-config.yaml

.pre-commit-hooks.yaml
----------------------

.. literalinclude:: ../.pre-commit-hooks.yaml
   :language: yaml
   :caption: .pre-commit-hooks.yaml

.readthedocs.yaml
-----------------

.. literalinclude:: ../.readthedocs.yaml
   :language: yaml
   :caption: .readthedocs.yaml

CHANGELOG.rst
-------------

.. literalinclude:: ../CHANGELOG.rst
   :language: rst
   :caption: CHANGELOG.rst

README.rst
----------

.. literalinclude:: ../README.rst
   :language: rst
   :caption: README.rst

conftest.py
-----------

.. literalinclude:: ../conftest.py
   :language: python
   :caption: conftest.py

docs/changelog.rst
------------------

.. literalinclude:: changelog.rst
   :language: rst
   :caption: docs/changelog.rst

docs/conf.py
------------

.. literalinclude:: conf.py
   :language: python
   :caption: docs/conf.py

docs/documentation.rst
----------------------

.. literalinclude:: documentation.rst
   :language: rst
   :caption: docs/documentation.rst

docs/examples.rst
-----------------

.. literalinclude:: examples.rst
   :language: rst
   :caption: docs/examples.rst

docs/index.rst
--------------

.. literalinclude:: index.rst
   :language: rst
   :caption: docs/index.rst

docs/llms.rst
-------------

.. literalinclude:: llms.rst
   :language: rst
   :caption: docs/llms.rst

docs/readme.rst
---------------

.. literalinclude:: readme.rst
   :language: rst
   :caption: docs/readme.rst

docs/source_tree.rst
--------------------

.. literalinclude:: source_tree.rst
   :language: rst
   :caption: docs/source_tree.rst

docs/test_docs.py
-----------------

.. literalinclude:: test_docs.py
   :language: python
   :caption: docs/test_docs.py

docs/test_theme.py
------------------

.. literalinclude:: test_theme.py
   :language: python
   :caption: docs/test_theme.py

examples/simple/__init__.py
---------------------------

.. literalinclude:: ../examples/simple/__init__.py
   :language: python
   :caption: examples/simple/__init__.py

examples/simple/snippet_1.py
----------------------------

.. literalinclude:: ../examples/simple/snippet_1.py
   :language: python
   :caption: examples/simple/snippet_1.py

examples/simple/snippet_2.py
----------------------------

.. literalinclude:: ../examples/simple/snippet_2.py
   :language: python
   :caption: examples/simple/snippet_2.py

examples/simple/snippet_3.py
----------------------------

.. literalinclude:: ../examples/simple/snippet_3.py
   :language: python
   :caption: examples/simple/snippet_3.py

examples/simple/snippet_4.py
----------------------------

.. literalinclude:: ../examples/simple/snippet_4.py
   :language: python
   :caption: examples/simple/snippet_4.py

package.json
------------

.. literalinclude:: ../package.json
   :language: json
   :caption: package.json

pyproject.toml
--------------

.. literalinclude:: ../pyproject.toml
   :language: toml
   :caption: pyproject.toml

src/js/download_adapter.js
--------------------------

.. literalinclude:: ../src/js/download_adapter.js
   :language: javascript
   :caption: src/js/download_adapter.js

src/jsphinx/__init__.py
-----------------------

.. literalinclude:: ../src/jsphinx/__init__.py
   :language: python
   :caption: src/jsphinx/__init__.py

src/jsphinx/cdn.py
------------------

.. literalinclude:: ../src/jsphinx/cdn.py
   :language: python
   :caption: src/jsphinx/cdn.py
