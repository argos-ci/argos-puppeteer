# @argos-ci/puppeteer

[Puppeteer](https://pptr.dev/) commands and utilities for [Argos](https://argos-ci.com) visual testing.

[![npm version](https://img.shields.io/npm/v/@argos-ci/puppeteer.svg)](https://www.npmjs.com/package/@argos-ci/puppeteer)
[![npm dm](https://img.shields.io/npm/dm/@argos-ci/puppeteer.svg)](https://www.npmjs.com/package/@argos-ci/puppeteer)
[![npm dt](https://img.shields.io/npm/dt/@argos-ci/puppeteer.svg)](https://www.npmjs.com/package/@argos-ci/puppeteer)

## Installation

```sh
npm install --save-dev @argos-ci/puppeteer
```

## Usage

Stabilizes the UI before taking a screenshot.

`argosScreenshot(page, name[, options])`

- `page` - A `puppeteer` page instance
- `name` - The screenshot name; must be unique
- `options` - See [Page.screenshot command options](https://pptr.dev/next/api/puppeteer.page.screenshot/)
- `options.element` - Accept an ElementHandle or a string selector to screenshot an element

```js
describe("Integration test with visual testing", () => {
  it("Loads the homepage", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(TEST_URL);
    await argosScreenshot(page, this.test.fullTitle());
  });
});
```

Screenshots are stored in `screenshots/argos` folder, relative to current directory.

### Helper attributes

The `data-visual-test` attributes allow you to control how elements behave in the Argos screenshot.

It is often used to hide changing element like dates.

- `[data-visual-test="transparent"]` - Make the element transparent (`opacity: 0`)
- `[data-visual-test="removed"]` - Remove the element (`display: none`)
- `[data-visual-test="blackout"]` - Blacked out the element

```html
<!-- Hide a div from a screenshot -->
<div id="clock" data-visual-test="transparent">...</div>
```
