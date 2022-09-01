import * as Puppeteer from "puppeteer";

export default function argosScreenshot(
  page: Puppeteer.Page,
  name: string,
  options?: Puppeteer.ScreenshotOptions
): Promise<void>;
