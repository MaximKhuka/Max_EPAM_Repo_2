const { When, Then } = require('@cucumber/cucumber');
const PageFactory = require('../utils/PageFactory');

When('the user adds {string} and {string} to the cart', async (firstItem, secondItem) => {
  const inventoryPage = PageFactory.getPage('inventoryPage');
  await inventoryPage.addItemToCart(firstItem);
  await inventoryPage.addItemToCart(secondItem);
});

Then('the cart badge should be displayed', async () => {
  const inventoryPage = PageFactory.getPage('inventoryPage');

  try {
    await expect(inventoryPage.cartBadge).toBeDisplayed();
  } catch (error) {
    throw new Error(`Cart badge was not displayed. ${error.message}`);
  }
});

Then('the cart badge should show {string}', async (expectedCount) => {
  const inventoryPage = PageFactory.getPage('inventoryPage');

  try {
    await expect(inventoryPage.cartBadge).toHaveText(expectedCount);
  } catch (error) {
    throw new Error(`Cart badge did not show "${expectedCount}". ${error.message}`);
  }
});

When('the user removes {string} from the cart', async (itemName) => {
  const inventoryPage = PageFactory.getPage('inventoryPage');
  await inventoryPage.removeItemFromCart(itemName);
});