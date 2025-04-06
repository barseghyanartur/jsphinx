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
// Inject CSS to show the eye and copy icons only on hover
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    var css = `
        /* Hide the icons by default */
        .jsphinx-eye-icon,
        .jsphinx-copy-icon {
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 9999;
        }
        /* Show the icons when hovering over any jsphinx container */
        .jsphinx-download:hover .jsphinx-eye-icon,
        .jsphinx-download-replace:hover .jsphinx-eye-icon,
        .jsphinx-toggle-emphasis:hover .jsphinx-eye-icon,
        .jsphinx-toggle-emphasis-replace:hover .jsphinx-eye-icon,
        .jsphinx-download:hover .jsphinx-copy-icon,
        .jsphinx-download-replace:hover .jsphinx-copy-icon,
        .jsphinx-toggle-emphasis:hover .jsphinx-copy-icon,
        .jsphinx-toggle-emphasis-replace:hover .jsphinx-copy-icon {
            opacity: 1;
        }
    `;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
});

// ----------------------------------------------------------------------------
// jsphinx `:download:` directive integration with PrismJS.
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
// jsphinx-eye-icon and copy-to-clipboard functionality
// ----------------------------------------------------------------------------
// Helper to find the visible <code> elements that are inside a <pre> block in a container
function findVisibleCodeElement(container) {
    const preElements = container.querySelectorAll('pre');
    for (let i = 0; i < preElements.length; i++) {
        if (window.getComputedStyle(preElements[i]).display !== 'none') {
            const code = preElements[i].querySelector('code');
            if (code) return code;
        }
    }
    return null;
}

// Determine the current toggle state of the directive container.
function getToggleState(container) {
  // Check for the additional content div used in jsphinx-download.
  const additional = container.querySelector('[id^="additional-content-"]');
  if (additional) {
    return additional.style.display === 'block' ? 'expanded' : 'collapsed';
  }
  // Check for two code blocks (compact and full) used in jsphinx-download-replace.
  const highlights = container.querySelectorAll('.highlight');
  if (highlights.length === 2) {
    // Assume the second highlight is the full code block.
    const full = highlights[1];
    return full.style.display === 'block' ? 'expanded' : 'collapsed';
  }
  // Fallback: try to use the toggle link's text.
  const toggleLink = container.querySelector('.toggle-link') ||
                     container.querySelector('a.reference.download.internal');
  if (toggleLink) {
    const em = toggleLink.querySelector('em');
    if (em && em.textContent.indexOf('Hide') !== -1) {
      return 'expanded';
    }
  }
  return 'collapsed';
}

// Update the icon in the container based on its current state.
function updateContainerIcon(container, iconElement, collapsedIcon, expandedIcon) {
  const state = getToggleState(container);
  iconElement.innerHTML = state === 'expanded' ? expandedIcon : collapsedIcon;
}

document.addEventListener('DOMContentLoaded', function() {
  // Define icons for the two states.
  const collapsedIcon = '👁';    // When code is collapsed.
  const expandedIcon  = '👁‍🗨';   // When code is expanded.

  // Define the copy icon
  const copyIconSymbol = '📋';

  // Select all jsphinx directive containers.
  const containers = document.querySelectorAll(
    '.jsphinx-download, .jsphinx-download-replace, .jsphinx-toggle-emphasis, .jsphinx-toggle-emphasis-replace'
  );

  containers.forEach(container => {
    // Ensure the container is positioned relatively.
    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    // Avoid creating duplicate icons.
    // Create or update the eye icon if not already present.
    let eyeIcon = container.querySelector('.jsphinx-eye-icon');
    if (!eyeIcon) {
      eyeIcon = document.createElement('span');
      eyeIcon.classList.add('jsphinx-eye-icon');
      eyeIcon.style.position = 'absolute';
      eyeIcon.style.top = '5px';
      eyeIcon.style.right = '5px';
      eyeIcon.style.cursor = 'pointer';
      // Initial icon update.
      updateContainerIcon(container, eyeIcon, collapsedIcon, expandedIcon);
      // Determine the toggle link within the container.
      const toggleLink = container.querySelector('.toggle-link') ||
                         container.querySelector('a.reference.download.internal');
      if (toggleLink) {
        // When the icon is clicked, simulate a click on the toggle link.
        eyeIcon.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleLink.click();
          // Wait a short time for the toggle action to complete, then update the icon.
          setTimeout(() => {
            updateContainerIcon(container, eyeIcon, collapsedIcon, expandedIcon);
          }, 100);
        });
        // Also update the icon when the toggle link is clicked.
        toggleLink.addEventListener('click', function() {
          setTimeout(() => {
            updateContainerIcon(container, eyeIcon, collapsedIcon, expandedIcon);
          }, 100);
        });
      }
      container.appendChild(eyeIcon);
    }

    // Create the copy icon if not already present.
    if (!container.querySelector('.jsphinx-copy-icon')) {
      const copyIcon = document.createElement('span');
      copyIcon.classList.add('jsphinx-copy-icon');
      copyIcon.style.position = 'absolute';
      copyIcon.style.top = '5px';
      copyIcon.style.right = '30px'; // Positioned to the left of the eye icon
      copyIcon.style.cursor = 'pointer';
      copyIcon.innerHTML = copyIconSymbol;
      copyIcon.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const visibleCode = findVisibleCodeElement(container);
          if (visibleCode) {
              navigator.clipboard.writeText(visibleCode.textContent).then(function() {
                  const original = copyIcon.innerHTML;
                  copyIcon.innerHTML = '✅';
                  setTimeout(() => {
                      copyIcon.innerHTML = original;
                  }, 2000);
              }).catch(function(err) {
                  console.error('Copy failed: ', err);
              });
          }
      });
      container.appendChild(copyIcon);
    }
  });
});
