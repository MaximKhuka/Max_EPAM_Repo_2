const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  get sortDropdown() {
    return $("//select[@data-test='product-sort-container']");
  }

  get itemPrices() {
    return $$("//div[@data-test='inventory-item-price']");
  }

  get cartBadge() {
    return $("//span[@class='shopping_cart_badge']");
  }

  get burgerMenuButton() {
    return $('#react-burger-menu-btn');
  }

  get resetAppStateLink() {
    return $('#reset_sidebar_link');
  }

  get closeMenuButton() {
    return $('#react-burger-cross-btn');
  }

  async sortBy(optionText) {
    await this.sortDropdown.selectByVisibleText(optionText);
  }

  async getDisplayedPrices() {
    const priceElements = await this.itemPrices;
    const prices = [];

    for (const el of priceElements) {
      const text = await el.getText();
      prices.push(Number(text.replace('$', '')));
    }

    return prices;
  }

  addToCartButtonFor(itemName) {
    return $(
      `//div[@data-test='inventory-item-name' and text()='${itemName}']`
        + "/ancestor::div[@data-test='inventory-item']"
        + "//button[contains(@data-test, 'add-to-cart')]",
    );
  }

  removeButtonFor(itemName) {
    return $(
      `//div[@data-test='inventory-item-name' and text()='${itemName}']`
        + "/ancestor::div[@data-test='inventory-item']"
        + "//button[contains(@data-test, 'remove')]",
    );
  }

  async addItemToCart(itemName) {
    await this.addToCartButtonFor(itemName).click();
  }

  async removeItemFromCart(itemName) {
    await this.removeButtonFor(itemName).click();
  }

  async resetAppState() {
    await this.burgerMenuButton.click();
    await this.resetAppStateLink.waitForClickable();
    await this.resetAppStateLink.click();
    await this.closeMenuButton.click();
  }
}

module.exports = new InventoryPage();