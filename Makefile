# Update version ONLY here
VERSION := 1.2.1
SHELL := /bin/bash
# Makefile for project
VENV := ~/.virtualenvs/jsphinx/bin/activate

# Build documentation using Sphinx and zip it
build_docs:
	source $(VENV) && sphinx-build -n -a -b html docs builddocs
	cd builddocs && zip -r ../builddocs.zip . -x ".*" && cd ..

# Format code using Black
black:
	source $(VENV) && black .

# Sort imports using isort
isort:
	source $(VENV) && isort . --overwrite-in-place

doc8:
	source $(VENV) && doc8

# Run ruff on the codebase
ruff:
	source $(VENV) && ruff .

# Serve the built docs on port 5000
serve_docs:
	source $(VENV) && cd builddocs && python -m http.server 5000

# Install the project
install:
	source $(VENV) && pip install -e .[all]

test:
	source $(VENV) && pytest -vrx -s

create-secrets:
	source $(VENV) && detect-secrets scan > .secrets.baseline

detect-secrets:
	source $(VENV) && detect-secrets scan --baseline .secrets.baseline

# Clean up generated files
clean:
	find . -name "*.pyc" -exec rm -rf {} \;
	find . -name "*.py,cover" -exec rm -rf {} \;
	find . -name "*.orig" -exec rm -rf {} \;
	find . -name "__pycache__" -exec rm -rf {} \;
	rm -rf build/
	rm -rf dist/
	rm -rf .cache/
	rm -rf htmlcov/
	rm -rf buiddocs/
	rm -rf .coverage
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/

compile-requirements:
	source $(VENV) && python -m piptools compile --extra all -o docs/requirements.txt pyproject.toml

TAGS = sphinx_rtd_theme alabaster sphinx_material bootstrap furo sphinx_book_theme pydata_sphinx_theme

tags:
	for tag in $(TAGS); do \
		git tag -f $$tag; \
	done
	git push --tags --force

update-version:
	sed -i 's/"version": "[0-9.]\+"/"version": "$(VERSION)"/' package.json
	sed -i 's/version = "[0-9.]\+"/version = "$(VERSION)"/' pyproject.toml
	find src/ -type f -name '*.css' -exec sed -i 's/@version [0-9.]\+/@version $(VERSION)/' {} \;
	find src/ -type f -name '*.js' -exec sed -i 's/@version [0-9.]\+/@version $(VERSION)/' {} \;
