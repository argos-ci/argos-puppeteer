import { resolve } from "node:path";
import mkdirp from "mkdirp";

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

export async function argosScreenshot(page, name, { fullPage, clip } = {}) {
  if (!page) throw new Error("A Puppeteer `page` object is required.");
  if (!name) throw new Error("The `name` argument is required.");

  await Promise.all([
    page.addStyleTag({ content: GLOBAL_STYLES }),
    page.waitForFunction(ensureNoBusy),
    page.waitForFunction(waitForFontLoading),
  ]);

  const directory = resolve(process.cwd(), "screenshots/argos");
  await mkdirp(directory);
  await page.screenshot({
    path: resolve(directory, `${name}.png`),
    type: "png",
    fullPage,
    clip,
  });
}
