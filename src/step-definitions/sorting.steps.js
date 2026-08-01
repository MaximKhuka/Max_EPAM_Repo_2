const { When, Then } = require('@cucumber/cucumber');
const PageFactory = require('../utils/PageFactory');

When('the user selects {string} from the sort dropdown', async (optionText) => {
  const inventoryPage = PageFactory.getPage('inventoryPage');
  await inventoryPage.sortBy(optionText);
});

Then('the displayed item prices should be sorted in ascending order', async () => {
  const inventoryPage = PageFactory.getPage('inventoryPage');

  try {
    const prices = await inventoryPage.getDisplayedPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    await expect(prices).toEqual(sortedPrices);
  } catch (error) {
    throw new Error(`Sorting validation failed: prices were not in ascending order. ${error.message}`);
  }
});