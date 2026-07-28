class BasePage {
  open(path = '/') {
    return browser.url(path);
  }
}

module.exports = BasePage;
