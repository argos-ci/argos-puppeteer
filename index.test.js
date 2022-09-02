import "expect-puppeteer";
import puppeteer from "puppeteer";
import { argosScreenshot } from "./index";
import { existsFile } from "./utils";

const screenshotsFolder = "screenshots";

describe("argosScreenshot", () => {
  let browser;
  let page;
  const url = new URL("fixtures/dummy.html", import.meta.url).href;
  const screenshotName = "dummy-page.png";
  const screenshotPath = `${screenshotsFolder}/${screenshotName}`;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await argosScreenshot(page, screenshotPath);
  }, 30000);

  afterAll(() => {
    browser.close();
  });

  describe("argosScreenshot", () => {
    it("should waits for loader hiding", async () => {
      const loaderContainer = await page.$eval(
        "#loader-container",
        (div) => div.innerHTML
      );
      expect(loaderContainer.trim()).toBe("");
    });

    it("hides div with data-visual-test='transparent'", async () => {
      const opacityStyle = await page.$eval(
        "div[data-visual-test='transparent']",
        (div) => getComputedStyle(div).opacity
      );
      expect(opacityStyle).toBe("0");
    });

    it("removes div with data-visual-test='removed'", async () => {
      const displayStyle = await page.$eval(
        "div[data-visual-test='removed']",
        (div) => getComputedStyle(div).display
      );
      expect(displayStyle).toBe("none");
    });

    it("takes a screenshot", async () => {
      const fileExists = await existsFile(screenshotPath);
      expect(fileExists).toBe(true);
    });
  });

  describe("with omitBackground options", () => {
    it("should take a screenshot without background", async () => {
      const screenshotPath = `${screenshotsFolder}/no-background.png`;
      await argosScreenshot(page, screenshotPath, { omitBackground: true });
      const fileExists = await existsFile(screenshotPath);
      expect(fileExists).toBe(true);
    });
  });

  describe("without name", () => {
    it("should throw an error", async () => {
      expect.assertions(1);
      try {
        await argosScreenshot(page);
      } catch (error) {
        expect(error.message).toBe("A `name` argument is required.");
      }
    });
  });

  describe("without page", () => {
    it("should throw an error", async () => {
      expect.assertions(1);
      try {
        await argosScreenshot(null, `${screenshotsFolder}/${screenshotName}`);
      } catch (error) {
        expect(error.message).toBe("A Puppeteer `Page` is required.");
      }
    });
  });
});
