const pages = require('../pages');

class PageFactory {
  static getPage(pageName) {
    const page = pages[pageName];

    if (!page) {
      throw new Error(`No page registered for name "${pageName}"`);
    }

    return page;
  }
}

module.exports = PageFactory;