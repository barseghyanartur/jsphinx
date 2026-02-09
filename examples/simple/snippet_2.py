# Required imports
from fake import FAKER

# Generate DOCX file of 100 pages
docx_file = FAKER.docx_file(nb_pages=100)

# Tests
assert docx_file.data["storage"].exists(docx_file)
assert len(docx_file.data["content"]) > 0
