import os

# Required imports
from fake import FAKER

# Generate DOCX file
docx_file = FAKER.docx_file()

# Test things out
print(docx_file)
print(docx_file.data["filename"])
assert os.path.exists(docx_file.data["filename"])
