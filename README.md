# Inventory Logic — WebdriverIO Test Suite

"Inventory Logic" Flow
Focus: Data validation, sorting algorithms, and state management.
Launch URL: [https://www.saucedemo.com/](https://www.saucedemo.com/)
UC-1 Sorting Validation:
o Login with standard_user.
o Select "Price (low to high)" from the sort dropdown.
o Validation: Scrape the prices of all items on the page and programmatically verify that the array is sorted correctly in ascending order.
UC-2 Cart State Logic:
o Add two different items to the cart.
o Verify the cart badge shows "2".
o Remove one item via the "Remove" button on the Inventory page.
o Verify the cart badge updates to "1".
Technical Requirements:
Tool: WebDriverIO.
Browsers: Firefox, Edge (Run in Parallel).
Pattern: Page Object Model (POM).
Locators: XPath (Focus on text-based selection).
Parametrization: Use Data Provider for the items being added/removed.
Documentation: Add a README.md explaining the sorting validation logic.

## Sorting Validation logic (UC-1)

1. Log in as `standard_user` and select **"Price (low to high)"** from the sort dropdown via `InventoryPage.sortBy()`.
2. `InventoryPage.getDisplayedPrices()` reads every item price element's text (e.g. `"$9.99"`), strips the `$`, and converts it to a `Number`, producing an array of prices in the exact order they appear in the DOM after sorting.
3. A second array is built by copying that array and sorting it ascending with `[...prices].sort((a, b) => a - b)`.
4. The test asserts the DOM-order array equals the independently-sorted array.

This checks the *application's* actual sort behavior rather than hardcoding an expected price list — it stays valid even if the product catalog changes, and fails clearly if the UI's sort ever breaks.

## Cart State Logic (UC-2)

Driven by a data provider (`src/data/cartItems.js`) with two item pairs. For each entry:
1. Add both items via `InventoryPage.addItemToCart()`, which locates each item's button by first finding the element containing its exact visible name, then traversing to the parent product card and down to the action button (text-based XPath).
2. Assert the cart badge reads `"2"`.
3. Remove one item via `InventoryPage.removeItemFromCart()` (same lookup strategy).
4. Assert the cart badge updates to `"1"`.

An `afterEach` hook calls `InventoryPage.resetAppState()` (via SauceDemo's "Reset App State" menu option) so cart state doesn't leak between test cases.

## Running the tests

\`\`\`bash
npm install
npx wdio run wdio.conf.js
\`\`\`

Firefox and Microsoft Edge sessions run concurrently (`maxInstances: 2`), each executing the full spec independently.