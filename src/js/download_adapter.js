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
 *       "https://cdn.jsdelivr.net/gh/barseghyanartur/jsphinx/src/css/sphinx_rtd_theme.css",
 *   ]
 *
 *   html_js_files = [
 *       f"{prismjs_base}/prism.min.js",
 *       f"{prismjs_base}/plugins/autoloader/prism-autoloader.min.js",
 *       f"{prismjs_base}/plugins/toolbar/prism-toolbar.min.js",
 *       f"{prismjs_base}/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js",
 *       "https://cdn.jsdelivr.net/gh/barseghyanartur/jsphinx/src/js/download_adapter.js",
 *   ]
 *
 * @author Artur Barseghyan (https://github.com/barseghyanartur)
 * @url https://github.com/barseghyanartur/jsphinx
 * @version 1.4.0
 */

// ----------------------------------------------------------------------------
// jsphinx-download listener (standalone)
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Find all download links by their class
    let downloadLinks = document.querySelectorAll('.jsphinx-download a.reference.download.internal');

    downloadLinks.forEach(function(link, index) {
        // Skip links inside a jsphinx-download-replace container
        if (link.closest('.jsphinx-download-replace')) {
            return;
        }

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

// ----------------------------------------------------------------------------
// jsphinx-toggle-emphasis listeners
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Check if the HTML is under the 'jsphinx-toggle-emphasis' class
    const containers = document.querySelectorAll('.jsphinx-toggle-emphasis');

    containers.forEach((container) => {
        // Function to create a new div.highlight element with content from 'span.hll' elements
        function createNewCodeBlock(originalCodeBlock) {
            const spanElements = originalCodeBlock.querySelectorAll('span.hll');
            const newCodeBlock = document.createElement('div');
            newCodeBlock.classList.add('highlight');

            // Create a new pre element to hold the 'span.hll' elements
            const newPreElement = document.createElement('pre');

            spanElements.forEach((span) => {
                // Clone the 'span' element and its content
                const spanClone = span.cloneNode(true);
                newPreElement.appendChild(spanClone);
            });

            newCodeBlock.appendChild(newPreElement);
            return newCodeBlock;
        }

        // Function to toggle visibility of code blocks
        function toggleCodeBlocks(codeBlock1, codeBlock2, toggleLink) {
            console.log('codeBlock1');
            console.log(codeBlock1);
            console.log('codeBlock2');
            console.log(codeBlock2);
            const codeBlock1Style = getComputedStyle(codeBlock1);

            if (codeBlock1Style.display === 'none') {
                codeBlock1.style.display = '';
                codeBlock2.style.display = '';
                toggleLink.querySelector('em').textContent = 'Hide the full example'; // Update the text within <em>
            } else {
                codeBlock1.style.display = 'none';
                toggleLink.querySelector('em').textContent = 'Show the full example'; // Update the text within <em>
            }
        }

        // Add toggle links and create a new div.highlight element for each code block
        const codeBlocks = container.querySelectorAll('.highlight-python');

        codeBlocks.forEach((originalCodeBlock) => {
            // Create a new div.highlight element with content from 'span.hll' elements
            const newCodeBlock = createNewCodeBlock(originalCodeBlock);

            // Hide the original code block and show the new one
            originalCodeBlock.style.display = 'none';

            // Create the "See the full example" link with updated text within <em>
            const toggleLink = document.createElement('p');
            toggleLink.href = 'javascript:;';
            toggleLink.classList.add('toggle-link');
            toggleLink.innerHTML = '<em>Show the full example</em>&nbsp;<a href="javascript:;" class="reference download internal"><code class="xref download docutils literal notranslate"><span class="pre">here</span></code></a>';

            // Add a click event listener to the link to toggle code blocks
            toggleLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the link from navigating
                toggleCodeBlocks(originalCodeBlock, newCodeBlock, toggleLink);
            });

            // Wrap the link in a <p> element
            const linkContainer = document.createElement('p');
            linkContainer.appendChild(toggleLink);

            // Insert the link and the new code block as siblings
            originalCodeBlock.parentNode.insertBefore(linkContainer, originalCodeBlock.previousSibling);
            originalCodeBlock.parentNode.insertBefore(newCodeBlock, linkContainer);
        });
    });
});


// ----------------------------------------------------------------------------
// jsphinx-toggle-emphasis-replace listener
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Check if the HTML is under the 'jsphinx-toggle-emphasis-replace' class
    const containers = document.querySelectorAll('.jsphinx-toggle-emphasis-replace');

    containers.forEach((container) => {
        // Function to create a new div.highlight element with content from 'span.hll' elements
        function createNewCodeBlock(originalCodeBlock) {
            const spanElements = originalCodeBlock.querySelectorAll('span.hll');
            const newCodeBlock = document.createElement('div');
            newCodeBlock.classList.add('highlight');

            // Create a new pre element to hold the 'span.hll' elements
            const newPreElement = document.createElement('pre');

            spanElements.forEach((span) => {
                // Clone the 'span' element and its content
                const spanClone = span.cloneNode(true);
                newPreElement.appendChild(spanClone);
            });

            newCodeBlock.appendChild(newPreElement);
            return newCodeBlock;
        }

        // Function to toggle visibility of code blocks
        function toggleCodeBlocks(codeBlock1, codeBlock2, toggleLink) {
            const codeBlock1Style = getComputedStyle(codeBlock1);

            if (codeBlock1Style.display === 'none') {
                codeBlock1.style.display = '';
                codeBlock2.style.display = 'none';
                toggleLink.querySelector('em').textContent = 'Hide the full example'; // Update the text within <em>
            } else {
                codeBlock1.style.display = 'none';
                codeBlock2.style.display = '';
                toggleLink.querySelector('em').textContent = 'Show the full example'; // Update the text within <em>
            }
        }

        // Add toggle links and create a new div.highlight element for each code block
        const codeBlocks = container.querySelectorAll('.highlight-python');

        codeBlocks.forEach((originalCodeBlock) => {
            // Create a new div.highlight element with content from 'span.hll' elements
            const newCodeBlock = createNewCodeBlock(originalCodeBlock);

            // Hide the original code block and show the new one
            originalCodeBlock.style.display = 'none';

            // Create the "See the full example" link with updated text within <em>
            const toggleLink = document.createElement('p');
            toggleLink.href = 'javascript:;';
            toggleLink.classList.add('toggle-link');
            toggleLink.innerHTML = '<em>Show the full example</em>&nbsp;<a href="javascript:;" class="reference download internal"><code class="xref download docutils literal notranslate"><span class="pre">here</span></code></a>';

            // Add a click event listener to the link to toggle code blocks
            toggleLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the link from navigating
                toggleCodeBlocks(originalCodeBlock, newCodeBlock, toggleLink);
            });

            // Wrap the link in a <p> element
            const linkContainer = document.createElement('p');
            linkContainer.appendChild(toggleLink);

            // Insert the link and the new code block as siblings
            originalCodeBlock.parentNode.insertBefore(linkContainer, originalCodeBlock.nextSibling);
            originalCodeBlock.parentNode.insertBefore(newCodeBlock, originalCodeBlock.nextSibling);
        });
    });
});

// ----------------------------------------------------------------------------
// jsphinx-download-replace listener
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Find all containers using the 'jsphinx-download-replace' directive
    let replaceContainers = document.querySelectorAll('.jsphinx-download-replace');

    replaceContainers.forEach(function(container) {
        // Find the download link within the container
        let downloadLink = container.querySelector('a.reference.download.internal');
        if (!downloadLink) {
            return;
        }

        // Find the compact code snippet. We assume it is rendered as a .highlight element.
        let compactCodeBlock = container.querySelector('.highlight');
        if (!compactCodeBlock) {
            return;
        }

        // Create a new code block element for the full code example.
        let fullCodeBlock = document.createElement('div');
        fullCodeBlock.classList.add('highlight');
        fullCodeBlock.style.display = 'none'; // Initially hidden

        // Create a new <pre> and <code> for the full content.
        let preElement = document.createElement('pre');
        let codeElement = document.createElement('code');

        // Use the language class from the compact snippet for consistency.
        let compactCodeElement = compactCodeBlock.querySelector('code');
        if (compactCodeElement) {
            compactCodeElement.classList.forEach(function(cls) {
                if (cls.startsWith('language-')) {
                    codeElement.classList.add(cls);
                }
            });
        }

        preElement.appendChild(codeElement);
        fullCodeBlock.appendChild(preElement);

        // Insert the new full code block right after the compact snippet.
        compactCodeBlock.parentNode.insertBefore(fullCodeBlock, compactCodeBlock.nextSibling);

        // Flag to check if the full code content has already been fetched.
        let fetched = false;

        downloadLink.addEventListener('click', function(event) {
            event.preventDefault();

            // Toggle: if the full code block is hidden, show it; if visible, hide it.
            if (fullCodeBlock.style.display === 'none') {
                // If not yet fetched, retrieve the full file content.
                if (!fetched) {
                    let url = downloadLink.getAttribute('href');
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                // Set the full content and highlight it using Prism.
                                codeElement.textContent = xhr.responseText;
                                Prism.highlightElement(codeElement);
                                // Show the full version and hide the compact snippet.
                                fullCodeBlock.style.display = 'block';
                                compactCodeBlock.style.display = 'none';
                                fetched = true;
                            } else {
                                codeElement.textContent = 'Error fetching content.';
                                fullCodeBlock.style.display = 'block';
                                compactCodeBlock.style.display = 'none';
                            }
                        }
                    };
                    xhr.send();
                } else {
                    // Already fetched: simply toggle visibility.
                    fullCodeBlock.style.display = 'block';
                    compactCodeBlock.style.display = 'none';
                }
                // Optionally update the toggle text, if the link contains an <em> element.
                let emElement = downloadLink.querySelector('em');
                if (emElement) {
                    emElement.textContent = 'Hide the full example';
                }
            } else {
                // Hide the full code block and restore the compact snippet.
                fullCodeBlock.style.display = 'none';
                compactCodeBlock.style.display = 'block';
                let emElement = downloadLink.querySelector('em');
                if (emElement) {
                    emElement.textContent = 'Show the full example';
                }
            }
        });
    });
});

// ----------------------------------------------------------------------------
// jsphinx-eye-icon
// ----------------------------------------------------------------------------
// Helper: add the eye icon to a code container and bind it to the toggle link.
function addEyeIconToCodeContainer(codeContainer, toggleLink) {
  // Avoid duplicate icons
  if (codeContainer.querySelector('.jsphinx-eye-icon')) return;

  // Ensure the container is positioned relatively so the icon can be absolutely positioned.
  if (window.getComputedStyle(codeContainer).position === 'static') {
    codeContainer.style.position = 'relative';
  }

  // Create the eye icon element.
  const eyeIcon = document.createElement('span');
  // You can replace the innerHTML with an SVG or image if you prefer.
  eyeIcon.innerHTML = '👁';
  eyeIcon.classList.add('jsphinx-eye-icon');

  // Style the icon so it sits at the top right of the container.
  eyeIcon.style.position = 'absolute';
  eyeIcon.style.top = '5px';
  eyeIcon.style.right = '5px';
  eyeIcon.style.cursor = 'pointer';
  // (Optional: adjust font size, color, or add a hover effect via CSS)

  // When clicked, simulate clicking the toggle/download link.
  eyeIcon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleLink.click();
  });

  codeContainer.appendChild(eyeIcon);
}

document.addEventListener('DOMContentLoaded', function() {
  // Find all containers where jsphinx directives are used.
  const containers = document.querySelectorAll(
    '.jsphinx-download, .jsphinx-download-replace, .jsphinx-toggle-emphasis, .jsphinx-toggle-emphasis-replace'
  );

  containers.forEach(container => {
    // Determine the toggle link.
    // For jsphinx-download and jsphinx-download-replace, it's the <a class="reference download internal">
    // For jsphinx-toggle-emphasis* it's the element with class "toggle-link".
    let toggleLink = container.querySelector('.toggle-link') ||
                     container.querySelector('a.reference.download.internal');
    if (!toggleLink) return;

    // Look for any code snippet container:
    // - In jsphinx-download, the additional content div (with id starting with "additional-content-")
    // - In others, the code block usually has the "highlight" class.
    let codeContainers = container.querySelectorAll('.highlight, [id^="additional-content-"]');
    codeContainers.forEach(codeContainer => {
      addEyeIconToCodeContainer(codeContainer, toggleLink);
    });
  });

  // Use a MutationObserver to catch code containers that are added dynamically (e.g. when content is fetched).
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches('.highlight') || (node.id && node.id.startsWith('additional-content-'))) {
            // Look upward to find the jsphinx container
            let container = node.closest(
              '.jsphinx-download, .jsphinx-download-replace, .jsphinx-toggle-emphasis, .jsphinx-toggle-emphasis-replace'
            );
            if (container) {
              let toggleLink = container.querySelector('.toggle-link') ||
                               container.querySelector('a.reference.download.internal');
              if (toggleLink) {
                addEyeIconToCodeContainer(node, toggleLink);
              }
            }
          }
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
