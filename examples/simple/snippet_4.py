from fake import FAKER, StringTemplate

template = """
{date(start_date='-7d')}
{name}
{sentence(nb_words=2, suffix='')} {pyint(min_value=1, max_value=99)}
{randomise_string(value='#### ??', digits='123456789')} {city}

Dear friend,

{text(nb_chars=1000, allow_overflow=True)}

Sincerely yours,

{name}
{email}
{domain_name}
"""
# DOCX file of 1 page
docx_file_1 = FAKER.docx_file(
    texts=[StringTemplate(template)],
)
# DOCX file of 10 pages
docx_file_10 = FAKER.docx_file(
    texts=[StringTemplate(template) for _ in range(10)],
)

# Tests
assert isinstance(docx_file_1, str)
assert docx_file_1.data["storage"].exists(docx_file_1)
assert isinstance(docx_file_10, str)
assert docx_file_10.data["storage"].exists(docx_file_10)
