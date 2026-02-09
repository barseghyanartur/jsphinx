# Required imports
from fake import FAKER

# Generate DOCX file of 3 pages with custom texts
docx_file = FAKER.docx_file(texts=["1st page", "2nd page", "3rd page"])

# Tests
assert docx_file.data["storage"].exists(docx_file)
assert len(docx_file.data["content"]) > 0
