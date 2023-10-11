# Makefile for project

# Build documentation using Sphinx and zip it
build_docs:
	sphinx-build -n -a -b html docs builddocs
	cd builddocs && zip -r ../builddocs.zip . -x ".*" && cd ..

# Format code using Black
black:
	black .

# Sort imports using isort
isort:
	isort . --overwrite-in-place

# Run ruff on the codebase
ruff:
	ruff .

# Serve the built docs on port 5000
serve_docs:
	cd builddocs && python -m http.server 5000

# Install the project
install:
	pip install -e .[all]

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
	rm -rf .coverage
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/

pip-compile:
	python -m piptools compile -o docs/requirements.txt pyproject.toml
