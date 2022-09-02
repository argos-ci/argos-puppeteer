import type { Page, ScreenshotOptions } from "puppeteer";

export function argosScreenshot(
  page: Page,
  name: string,
  options?: ScreenshotOptions
): Promise<void>;
