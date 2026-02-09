# Required imports
from fake import FAKER

# Generate DOCX file
docx_file = FAKER.docx_file()

# Tests
assert docx_file.data["storage"].exists(docx_file)
assert len(docx_file.data["content"]) > 0
