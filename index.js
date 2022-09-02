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

export async function argosScreenshot(
  page,
  name,
  { element = page, ...options } = {}
) {
  if (!page) throw new Error("A Puppeteer `page` object is required.");
  if (!name) throw new Error("The `name` argument is required.");

  if (typeof element === "string") {
    await page.waitForSelector(element);
    element = await page.$(element);
  }

  const directory = resolve(process.cwd(), "screenshots/argos");

  const [resolvedElement] = await Promise.all([
    (async () => {
      if (typeof element === "string") {
        await page.waitForSelector(element);
        return page.$(element);
      }
      return element;
    })(),
    mkdirp(directory),
    page.addStyleTag({ content: GLOBAL_STYLES }),
    page.waitForFunction(ensureNoBusy),
    page.waitForFunction(waitForFontLoading),
  ]);

  await resolvedElement.screenshot({
    path: resolve(directory, `${name}.png`),
    type: "png",
    ...options,
  });
}
