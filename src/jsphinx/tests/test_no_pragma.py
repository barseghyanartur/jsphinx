"""
https://github.com/barseghyanartur/jsphinx/
"""

import shutil
import unittest
from pathlib import Path

from sphinx.application import Sphinx

__author__ = "Artur Barseghyan <artur.barseghyan@gmail.com>"
__copyright__ = "2023 Artur Barseghyan"
__license__ = "MIT"
__all__ = ("TestNoPragmaLiteralInclude",)


class TestNoPragmaLiteralInclude(unittest.TestCase):
    def setUp(self):
        root_dir = Path(__file__).parent.parent.parent.parent
        self.docs_dir = root_dir / "docs"
        self.build_dir = root_dir / "test_builddocs"
        self.doctree_dir = self.build_dir / "doctrees"

    def test_build_docs(self):
        # Build the docs using Sphinx
        test_app = Sphinx(
            self.docs_dir,  # Source directory
            self.docs_dir,  # Config directory
            self.build_dir,  # Output directory
            self.doctree_dir,  # Doctree directory
            "html",  # Builder
        )
        test_app.build()

        # Check if usage.html exists
        usage_html_path = self.build_dir / "no_pragma_demo.html"
        self.assertTrue(usage_html_path.exists())

        # Read the content of usage.html
        with open(usage_html_path, "r") as f:
            content = f.read()

        # Check for the absence of pragma comments
        self.assertNotIn("# type: ignore", content)
        self.assertNotIn("# noqa", content)

    def tearDown(self):
        # Clean up the build directory
        if self.build_dir.exists():
            shutil.rmtree(self.build_dir)
