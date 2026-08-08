Task description

"Inventory Logic" Flow
Focus: Data validation, sorting algorithms, and state management.
Launch URL: [https://www.saucedemo.com/](https://www.saucedemo.com/)
UC-1 Sorting Validation:
- Login with standard_user.
- Select "Price (low to high)" from the sort dropdown.
- Validation: Scrape the prices of all items on the page and programmatically verify that the array is sorted correctly in ascending order.
UC-2 Cart State Logic:
- Add two different items to the cart.
- Verify the cart badge shows "2".
- Remove one item via the "Remove" button on the Inventory page.
- Verify the cart badge updates to "1".
Technical Requirements:
Tool: WebDriverIO.
Browsers: Firefox, Edge (Run in Parallel).
Pattern: Page Object Model (POM).
Locators: XPath (Focus on text-based selection).
Parametrization: Use Data Provider for the items being added/removed.
Documentation: Add a README.md explaining the sorting validation logic.

# Inventory Logic — WebdriverIO + Cucumber Test Suite

## Project structure

features/
├── sorting-validation.feature
└── cart-state-logic.feature
src/
├── pages/
│ ├── BasePage.js
│ ├── LoginPage.js
│ ├── InventoryPage.js
│ └── index.js
├── components/
│ └── CartWidget.js
├── utils/
│ └── PageFactory.js
├── hooks/
│ └── scenario-hooks.js
└── step-definitions/
├── login.steps.js
├── sorting.steps.js
└── cart.steps.js
wdio.conf.js

Naming convention: class files use PascalCase matching their class name (e.g. `InventoryPage.js`); everything else uses kebab-case with a purpose suffix (`.feature`, `.steps.js`).

## BDD approach (Cucumber)

This suite uses **real Cucumber** (`@wdio/cucumber-framework` + `@cucumber/cucumber`), not simulated BDD logging. Scenarios are written in Gherkin inside `.feature` files, completely separate from any implementation code:

```gherkin
Scenario: Sort items by price ascending
  Given the user is logged in as "standard_user"
  Then there should be 6 items in the inventory
  When the user selects "Price (low to high)" from the sort dropdown
  Then the displayed item prices should be sorted in ascending order
```

Each Gherkin line maps to a step definition in `src/step-definitions/`, which is the only place instance creation and page-object calls happen — feature files contain nothing but plain-language steps.

## Sorting Validation logic (UC-1)

1. Log in as `standard_user` and select **"Price (low to high)"** from the sort dropdown via `InventoryPage.sortBy()` (called from `sorting.steps.js`).
2. `InventoryPage.getDisplayedPrices()` reads every item price element's text (e.g. `"$9.99"`), strips the `$`, and converts it to a `Number`, producing an array of prices in the exact order they appear in the DOM after sorting.
3. A second array is built by copying that array and sorting it ascending with `[...prices].sort((a, b) => a - b)`.
4. The step asserts the DOM-order array equals the independently-sorted array.

This checks the *application's* actual sort behavior rather than hardcoding an expected price list — it stays valid even if the product catalog changes, and fails clearly if the UI's sort ever breaks.

## Cart State Logic (UC-2)

Parametrized via a Gherkin **Scenario Outline** with an `Examples:` table (`features/cart-state-logic.feature`) — this is the data provider requirement, expressed natively in Gherkin rather than a separate JS array:

```gherkin
Examples:
  | firstItem               | secondItem               | itemToRemove             |
  | Sauce Labs Backpack      | Sauce Labs Bike Light     | Sauce Labs Backpack       |
  | Sauce Labs Bolt T-Shirt  | Sauce Labs Fleece Jacket  | Sauce Labs Fleece Jacket  |
```

For each row: two items are added, the cart badge is asserted to show `"2"`, one item is removed, and the badge is asserted to update to `"1"`. Cart state doesn't leak between scenarios because `src/hooks/scenario-hooks.js` resets the app state after every scenario via SauceDemo's "Reset App State" menu option.

## Components layer

`src/components/CartWidget.js` isolates the cart badge as a reusable component, separate from the full `InventoryPage`. `InventoryPage` composes it (`this.cartWidget = new CartWidget()`), matching the Page → Component → Element hierarchy rather than treating every element as a flat page-level locator.

## Page Factory pattern

`src/utils/PageFactory.js` centralizes page-instance creation, reading from the `src/pages/index.js` barrel file. Step definitions call `PageFactory.getPage('loginPage')` / `PageFactory.getPage('inventoryPage')` instead of importing page modules directly.

## Error handling and failure artifacts

Each assertion in the step definitions is wrapped in a try/catch that re-throws a descriptive error on failure (e.g. `"Cart badge did not show '2' after adding two items..."`). Additionally, `src/hooks/scenario-hooks.js` registers an `afterScenario` hook that, on any failed scenario, captures a screenshot to `error-shots/` and attaches it to the Allure report — so a failed run leaves visual evidence, not just a stack trace.

## Browser configuration

Both Firefox and Microsoft Edge run in parallel (`maxInstances: 2`), each with explicit `browserVersion` and a fixed window size (`1920x1080`) set via browser-specific launch arguments (`moz:firefoxOptions` / `ms:edgeOptions`), rather than relying on default window dimensions.

## Running the tests

```bash
npm install
npx wdio run wdio.conf.js
```

## Viewing the Allure report

```bash
npm run allure:generate
npm run allure:open
```
