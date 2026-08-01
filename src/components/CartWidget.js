class CartWidget {
  get badge() {
    return $("//span[@class='shopping_cart_badge']");
  }

  async getCount() {
    const exists = await this.badge.isExisting();
    return exists ? Number(await this.badge.getText()) : 0;
  }
}

module.exports = CartWidget;