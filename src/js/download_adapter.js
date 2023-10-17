/**
 * Sphinx `:download:` directive integration with PrismJS.
 *
 * Install the snippet by adding it to the sphinx conf.py configuration
 * as shown below:
 *
 *   prismjs_base = "//cdnjs.cloudflare.com/ajax/libs/prism/1.29.0"
 *
 *   html_css_files = [
 *       f"{prismjs_base}/themes/prism.min.css",
 *       f"{prismjs_base}/plugins/toolbar/prism-toolbar.min.css",
 *       "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/css/sphinx_rtd_theme.css",
 *   ]
 *
 *   html_js_files = [
 *       f"{prismjs_base}/prism.min.js",
 *       f"{prismjs_base}/plugins/autoloader/prism-autoloader.min.js",
 *       f"{prismjs_base}/plugins/toolbar/prism-toolbar.min.js",
 *       f"{prismjs_base}/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js",
 *       "https://cdn.jsdelivr.net/gh/barseghyanartur/prismjs-sphinx/src/js/download_adapter.js",
 *   ]
 *
 * @author Artur Barseghyan (https://github.com/barseghyanartur)
 * @url https://github.com/barseghyanartur/prismjs-sphinx
 * @version 1.1.2
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all download links by their class
    let downloadLinks = document.querySelectorAll('.prismjs-sphinx a.reference.download.internal');

    downloadLinks.forEach(function(link, index) {
        // Create a unique id for the additional content div
        let contentID = 'additional-content-' + index;

        // Get the file extension and set language class
        let fileExtension = link.getAttribute('href').split('.').pop();
        let langClass = fileExtension === 'py' ? 'language-python' :
                        fileExtension === 'js' ? 'language-javascript' :
                        'language-plaintext';

        // Create a new div for the additional content
        let additionalContentDiv = document.createElement('div');
        additionalContentDiv.id = contentID;
        additionalContentDiv.style.display = 'none';

        // Create pre and code elements for syntax highlighting
        let preElement = document.createElement('pre');
        let codeElement = document.createElement('code');
        codeElement.classList.add(langClass);
        preElement.appendChild(codeElement);
        additionalContentDiv.appendChild(preElement);

        // Insert the additional content div after the link
        link.parentNode.insertBefore(additionalContentDiv, link.nextSibling);

        // Attach a click event to the download link
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Stop the link from being followed
            let additionalContent = document.getElementById(contentID).querySelector('code');

            if (additionalContentDiv.style.display === 'block') {
                additionalContentDiv.style.display = 'none';
            } else {
                // Check if content has been fetched
                if (!additionalContentDiv.classList.contains('fetched')) {
                    let retries = 3;
                    let url = link.getAttribute('href');
                    function fetchContent() {
                        // Fetch the content of the file and display it
                        let xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    additionalContent.textContent = xhr.responseText;
                                    Prism.highlightElement(additionalContent);
                                    additionalContentDiv.style.display = 'block';
                                    // Add fetched class
                                    additionalContentDiv.classList.add('fetched');
                                } else {
                                    additionalContent.textContent = 'Error fetching content.';
                                    additionalContentDiv.style.display = 'block';
                                }
                            }
                        };
                        xhr.send();
                    }
                    fetchContent();
                } else {
                    // Content has been fetched, just show it
                    additionalContentDiv.style.display = 'block';
                }
            }
        });
    });
});
