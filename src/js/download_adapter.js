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
 * @version 1.4.2
 */

function getLangClassFromTargetHref(targetLink) {
    // Get the file extension and set language class
    let fileExtension = targetLink.getAttribute('href').split('.').pop();
    return fileExtension === 'py' ? 'language-python' :
        fileExtension === 'js' ? 'language-javascript' : 'language-plaintext';
}


function initializeJsphinxFeatures() {
    // Define icons for the two states.
    // Eye icon - when code is collapsed.
    const collapsedIconImage = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></g></svg>';
    // Crossed eye icon - when code is expanded.
    const expandedIconImage = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"/></g></svg>';
    // Copy icon
    const copyIconImage = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v4m1 4H11"/><path d="m15 10l-4 4l4 4"/></g></svg>';
    // Checkbox icon
    const checkIconImage = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"/></svg>';

    // ----------------------------------------------------------------------------
    // Inject CSS to show the eye and copy icons only on hover
    // ----------------------------------------------------------------------------
    function injectCSS() {
        let css = `
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
        let style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    injectCSS();

    // ----------------------------------------------------------------------------
    // jsphinx `:download:` directive integration with PrismJS.
    // ----------------------------------------------------------------------------
    function handleDownload() {
        // Find all download links by their class
        let downloadLinks = document.querySelectorAll('.jsphinx-download a.reference.download.internal');

        downloadLinks.forEach(function (link, index) {
            // Skip links inside a jsphinx-download-replace container
            if (link.closest('.jsphinx-download-replace')) {
                return;
            }

            // Create a unique id for the additional content div
            let contentID = 'additional-content-' + index;

            // Get the file extension and set language class
            let langClass = getLangClassFromTargetHref(link);

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
            link.addEventListener('click', function (event) {
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
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    if (xhr.status === 200) {
                                        additionalContent.textContent = xhr.responseText;
                                        console.log(additionalContent);
                                        Prism.highlightElement(additionalContent);
                                        console.log(additionalContent);
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
    }
    handleDownload();

    // ----------------------------------------------------------------------------
    // jsphinx-toggle-emphasis listeners
    // ----------------------------------------------------------------------------
    function handleToggleEmphasis() {
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
    }
    handleToggleEmphasis();

    // ----------------------------------------------------------------------------
    // jsphinx-toggle-emphasis-replace listener
    // ----------------------------------------------------------------------------
    function handleToggleEmphasisReplace() {
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
    }
    handleToggleEmphasisReplace();

    // ----------------------------------------------------------------------------
    // jsphinx-download-replace listener
    // ----------------------------------------------------------------------------
    function handleDownloadReplace() {
        // For each container with class jsphinx-download-replace:
        document.querySelectorAll('.jsphinx-download-replace').forEach(container => {
            // Find the download link
            const link = container.querySelector('a.reference.download.internal');
            if (!link) return;
            // Remove the download attribute immediately.
            link.removeAttribute('download');
            // Attach a click handler directly.
            link.addEventListener('click', function(event) {
                event.preventDefault();
                // On first click, create the full code block if not already done.
                if (!link._jsphinxInitialized) {
                    // Try to get the compact code block via .highlight; if not found, use the first <pre>
                    const compact = container.querySelector('.highlight') || container.querySelector('pre');
                    if (!compact) return;
                    const full = document.createElement('div');
                    full.classList.add('highlight');
                    full.style.display = 'none'; // Initially hidden
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    // Copy language classes from the compact code.
                    const compactCode = compact.querySelector('code');
                    // if (compactCode) {
                    //     compactCode.classList.forEach(cls => {
                    //         if (cls.startsWith('language-')) {
                    //             code.classList.add(cls);
                    //         }
                    //     });
                    // }
                    // Get the file extension and set language class
                    let langClass = getLangClassFromTargetHref(link);
                    code.classList.add(langClass);

                    pre.appendChild(code);
                    full.appendChild(pre);
                    compact.parentNode.insertBefore(full, compact.nextSibling);
                    link._jsphinxInitialized = { compact, full, code, fetched: false };
                }
                const initData = link._jsphinxInitialized;
                if (initData.full.style.display === 'none') {
                    if (!initData.fetched) {
                        const url = link.getAttribute('href');
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url, true);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    initData.code.textContent = xhr.responseText;
                                    console.log(initData.code);
                                    Prism.highlightElement(initData.code);
                                    console.log(initData.code);
                                    initData.full.style.display = 'block';
                                    initData.compact.style.display = 'none';
                                    initData.fetched = true;
                                } else {
                                    initData.code.textContent = 'Error fetching content.';
                                    initData.full.style.display = 'block';
                                    initData.compact.style.display = 'none';
                                }
                            }
                        };
                        xhr.send();
                    } else {
                        initData.full.style.display = 'block';
                        initData.compact.style.display = 'none';
                    }
                    const em = link.querySelector('em');
                    if (em) em.textContent = 'Hide the full example';
                } else {
                    initData.full.style.display = 'none';
                    initData.compact.style.display = 'block';
                    const em = link.querySelector('em');
                    if (em) em.textContent = 'Show the full example';
                }
            });
        });
    }
    handleDownloadReplace();

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

    function handleIcons() {
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
                updateContainerIcon(container, eyeIcon, collapsedIconImage, expandedIconImage);
                // Determine the toggle link within the container.
                const toggleLink = container.querySelector('.toggle-link') ||
                    container.querySelector('a.reference.download.internal');
                if (toggleLink) {
                    // When the icon is clicked, simulate a click on the toggle link.
                    eyeIcon.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLink.click();
                        // Wait a short time for the toggle action to complete, then update the icon.
                        setTimeout(() => {
                            updateContainerIcon(container, eyeIcon, collapsedIconImage, expandedIconImage);
                        }, 100);
                    });
                    // Also update the icon when the toggle link is clicked.
                    toggleLink.addEventListener('click', function () {
                        setTimeout(() => {
                            updateContainerIcon(container, eyeIcon, collapsedIconImage, expandedIconImage);
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
                copyIcon.innerHTML = copyIconImage;
                copyIcon.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const visibleCode = findVisibleCodeElement(container);
                    if (visibleCode) {
                        navigator.clipboard.writeText(visibleCode.textContent).then(function () {
                            const original = copyIcon.innerHTML;
                            copyIcon.innerHTML = checkIconImage;
                            setTimeout(() => {
                                copyIcon.innerHTML = original;
                            }, 2000);
                        }).catch(function (err) {
                            console.error('Copy failed: ', err);
                        });
                    }
                });
                container.appendChild(copyIcon);
            }
        });
    }
    handleIcons();
}

document.addEventListener('DOMContentLoaded', function() {
  initializeJsphinxFeatures();
});
