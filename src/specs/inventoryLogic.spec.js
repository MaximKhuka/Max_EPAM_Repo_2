const PageFactory = require('../utils/PageFactory');
const { given, when, then } = require('../utils/logger');
const cartData = require('../data/cartItems');

const loginPage = PageFactory.getPage('login');
const inventoryPage = PageFactory.getPage('inventory');

describe('Inventory Logic', () => {
  beforeEach(async () => {
    given('the user is on the login page');
    await loginPage.open('/');

    when('the user logs in with valid standard_user credentials');
    await loginPage.login('standard_user', 'secret_sauce');
  });

  afterEach(async () => {
    await inventoryPage.resetAppState();
  });

  describe('UC-1: Sorting Validation', () => {
    it('should sort item prices in ascending order when "Price (low to high)" is selected', async () => {
      when('the user selects "Price (low to high)" from the sort dropdown');
      await inventoryPage.sortBy('Price (low to high)');

      then('the displayed item prices should be sorted in ascending order');
      try {
        const prices = await inventoryPage.getDisplayedPrices();
        const sortedPrices = [...prices].sort((a, b) => a - b);

        await expect(prices).toEqual(sortedPrices);
      } catch (error) {
        throw new Error(`Sorting validation failed: prices were not in ascending order. ${error.message}`);
      }
    });
  });

  describe('UC-2: Cart State Logic', () => {
    cartData.forEach((data) => {
      it(data.title, async () => {
        given(`"${data.itemsToAdd[0]}" and "${data.itemsToAdd[1]}" are available in the inventory`);

        when(`the user adds "${data.itemsToAdd[0]}" and "${data.itemsToAdd[1]}" to the cart`);
        await inventoryPage.addItemToCart(data.itemsToAdd[0]);
        await inventoryPage.addItemToCart(data.itemsToAdd[1]);

        then('the cart badge should show "2"');
        try {
          await expect(inventoryPage.cartBadge).toHaveText('2');
        } catch (error) {
          throw new Error(`Cart badge did not show "2" after adding two items. ${error.message}`);
        }

        when(`the user removes "${data.itemToRemove}" from the cart`);
        await inventoryPage.removeItemFromCart(data.itemToRemove);

        then('the cart badge should update to "1"');
        try {
          await expect(inventoryPage.cartBadge).toHaveText('1');
        } catch (error) {
          throw new Error(`Cart badge did not update to "1" after removing an item. ${error.message}`);
        }
      });
    });
  });
});