# Update version ONLY here
VERSION := 1.4.3
SHELL := /bin/bash
READTHEDOCS_WEBHOOK = https://readthedocs.org/api/v2/webhook/jsphinx/252546/
# Makefile for project
VENV := ~/.virtualenvs/jsphinx/bin/activate

# Build documentation using Sphinx and zip it
build_docs:
	source $(VENV) && sphinx-build -n -a -b html docs builddocs
	cd builddocs && zip -r ../builddocs.zip . -x ".*" && cd ..

pre-commit:
	pre-commit run --all-files

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

# Serve the built docs on port 5001
serve_docs:
	source $(VENV) && cd builddocs && python -m http.server 5001

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
	find . -name "builddocs.zip" -exec rm -rf {} \;
	find . -name "*.py,cover" -exec rm -rf {} \;
	find . -name "*.orig" -exec rm -rf {} \;
	find . -name "__pycache__" -exec rm -rf {} \;
	rm -rf build/
	rm -rf dist/
	rm -rf .cache/
	rm -rf htmlcov/
	rm -rf builddocs/
	rm -rf testdocs/
	rm -rf .coverage
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/
	rm -rf dist/

compile-requirements:
	source $(VENV) && python -m piptools compile --all-extras -o docs/requirements.txt pyproject.toml

compile-requirements-upgrade:
	source $(VENV) && python -m piptools compile --all-extras -o docs/requirements.txt pyproject.toml --upgrade

TAGS = sphinx_rtd_theme alabaster sphinx_immaterial sphinx_material bootstrap furo sphinx_book_theme pydata_sphinx_theme

tags:
	for tag in $(TAGS); do \
		git tag -f $$tag; \
	done
	git push --tags --force

update-version:
	sed -i 's/"version": "[0-9.]\+"/"version": "$(VERSION)"/' package.json
	sed -i 's/version = "[0-9.]\+"/version = "$(VERSION)"/' pyproject.toml
	sed -i 's/__version__ = "[0-9.]\+"/__version__ = "$(VERSION)"/' src/jsphinx/__init__.py
	find src/ -type f -name '*.css' -exec sed -i 's/@version [0-9.]\+/@version $(VERSION)/' {} \;
	find src/ -type f -name '*.js' -exec sed -i 's/@version [0-9.]\+/@version $(VERSION)/' {} \;

build-python:
	source $(VENV) && python -m build .

check-python-build:
	source $(VENV) && twine check dist/*

release-python:
	source $(VENV) && twine upload dist/* --verbose

test-release-python:
	source $(VENV) && twine upload --repository testpypi dist/*

trigger-readthedocs-build:
	@for tag in $(TAGS); do \
#		echo "Triggering ReadTheDocs build for tag: $$tag"; \
		curl -X POST "$(READTHEDOCS_WEBHOOK)" -H "Content-Type: application/json" -d '{"ref": "'$$tag'"}' || exit 1; \
	done
