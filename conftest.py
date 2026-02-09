import pytest


@pytest.fixture
def extensions() -> list:
    return []


@pytest.fixture
def html_theme() -> str:
    return "sphinx_book_theme"
