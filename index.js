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
 * Injected style to hide elements and fix unstable rendering.
 */
function injectStyles(style) {
  const css = document.createElement("style");
  css.type = "text/css";
  css.textContent = style;
  document.body.appendChild(css);
  return true;
}

/**
 * Check if there is `[aria-busy="true"]` element on the page.
 */
async function ensureNoBusy() {
  const isVisible = (element) =>
    Boolean(
      element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
    );

  const res = [...document.querySelectorAll('[aria-busy="true"]')].every(
    (element) => !isVisible(element)
  );
  console.log({ ensureNoBusy: res });
  return res;
}

// Check if the fonts are loaded
function waitForFontLoading() {
  return document.fonts.status === "loaded";
}

/**
 * Takes a screenshot for Argos.
 */
export async function argosScreenshot(page, name, options = {}) {
  if (!page)
    throw new Error("An instance of Puppeteer `page` object is required.");
  if (!name) throw new Error("The `name` argument is required.");

  try {
    await page.waitForFunction(injectStyles, {}, GLOBAL_STYLES);
    await page.waitForFunction(ensureNoBusy);
    await page.waitForFunction(waitForFontLoading);
    await page.screenshot({ path: name, ...options });
  } catch (err) {
    console.error(`Could not take the screenshot "${name}"`);
    console.error(err);
  }
}
