const { Given, Then } = require('@cucumber/cucumber');
const PageFactory = require('../utils/PageFactory');

Given('the user is logged in as {string}', async (username) => {
  const loginPage = PageFactory.getPage('loginPage');
  await loginPage.open('/');
  await loginPage.login(username, 'secret_sauce');

  await expect(browser).toHaveUrl(expect.stringContaining('inventory.html'));
});

Then('there should be {int} items in the inventory', async (expectedCount) => {
  const inventoryPage = PageFactory.getPage('inventoryPage');

  try {
    await expect(inventoryPage.inventoryItems).toBeElementsArrayOfSize(expectedCount);
  } catch (error) {
    throw new Error(`Expected ${expectedCount} inventory items to be displayed. ${error.message}`);
  }
});