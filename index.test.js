import "expect-puppeteer";
import { existsSync } from "fs";
import puppeteer from "puppeteer";
import { argosScreenshot } from "./index";

const screenshotsFolder = `${process.env.PWD}/screenshots`;

describe("argosScreenshot", () => {
  let browser;
  let page;
  const url = `file://${process.env.PWD}/fixtures/dummy.html`;
  const screenshotName = "dummy-page.png";

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await argosScreenshot(page, `${screenshotsFolder}/${screenshotName}`);
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

    it("takes a screenshot", () => {
      expect(existsSync(`${screenshotsFolder}/${screenshotName}`)).toBe(true);
    });
  });

  describe("with specified component", () => {
    it("should take a component screenshot", async () => {
      const breadcrumb = await page.waitForSelector(".red-square");
      await argosScreenshot(breadcrumb, `${screenshotsFolder}/red-square.png`);
    });
  });

  describe("with omitBackground options", () => {
    it("should take a screenshot without background", async () => {
      await argosScreenshot(page, `${screenshotsFolder}/no-background.png`, {
        omitBackground: true,
      });
      expect(existsSync(`${screenshotsFolder}/no-background.png`)).toBe(true);
    });
  });

  describe("without name", () => {
    it("should throw an error", async () => {
      expect.assertions(1);
      try {
        await argosScreenshot(page);
      } catch (error) {
        expect(error.message).toBe("The `name` argument is required.");
      }
    });
  });

  describe("without page", () => {
    it("should throw an error", async () => {
      expect.assertions(1);
      try {
        await argosScreenshot(null, `${screenshotsFolder}/${screenshotName}`);
      } catch (error) {
        expect(error.message).toBe(
          "An instance of Puppeteer `page` object is required."
        );
      }
    });
  });
});
