const loginPage = require('../pages/LoginPage');
const inventoryPage = require('../pages/InventoryPage');
const cartData = require('../data/cartItems');

describe('Inventory Logic', () => {
  beforeEach(async () => {
    await loginPage.open('/');
    await loginPage.login('standard_user', 'secret_sauce');
  });

  afterEach(async () => {
  await inventoryPage.resetAppState();
});

  describe('UC-1: Sorting Validation', () => {
    it('should sort item prices in ascending order when "Price (low to high)" is selected', async () => {
      await inventoryPage.sortBy('Price (low to high)');

      const prices = await inventoryPage.getDisplayedPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);

      await expect(prices).toEqual(sortedPrices);
    });
  });

  describe('UC-2: Cart State Logic', () => {
    cartData.forEach((data) => {
      it(data.title, async () => {
        await inventoryPage.addItemToCart(data.itemsToAdd[0]);
        await inventoryPage.addItemToCart(data.itemsToAdd[1]);

        await expect(inventoryPage.cartBadge).toHaveText('2');

        await inventoryPage.removeItemFromCart(data.itemToRemove);

        await expect(inventoryPage.cartBadge).toHaveText('1');
      });
    });
  });
});
