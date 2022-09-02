const GLOBAL_STYLES = `
  /* Hide carets */
  * { caret-color: transparent !important; }

  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none !important;
  }

  /* Generic hide */
  [data-visual-test="transparent"] {
    color: transparent !important;
    font-family: monospace !important;
    opacity: 0 !important;
  }

  [data-visual-test="removed"] {
    display: none !important;
  }
`;

/**
 * Check if there is `[aria-busy="true"]` element on the page.
 */
async function ensureNoBusy() {
  const checkIsVisible = (element) =>
    Boolean(
      element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
    );

  return [...document.querySelectorAll('[aria-busy="true"]')].every(
    (element) => !checkIsVisible(element)
  );
}

// Check if the fonts are loaded
function waitForFontLoading() {
  return document.fonts.status === "loaded";
}

/**
 * Takes a screenshot for Argos.
 */
export async function argosScreenshot(page, name, options = {}) {
  if (!page) throw new Error("A Puppeteer `Page` is required.");
  if (!name) throw new Error("A `name` argument is required.");

  try {
    await Promise.all([
      page.addStyleTag({ content: GLOBAL_STYLES }),
      page.waitForFunction(ensureNoBusy),
      page.waitForFunction(waitForFontLoading),
    ]);
    await page.screenshot({ path: name, ...options });
  } catch (err) {
    console.error(`Could not take the screenshot "${name}"`);
    console.error(err);
  }
}
