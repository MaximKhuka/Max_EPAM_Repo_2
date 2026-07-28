const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  get usernameInput() {
    return $("//input[@placeholder='Username']");
  }

  get passwordInput() {
    return $("//input[@placeholder='Password']");
  }

  get loginButton() {
    return $("//input[@value='Login']");
  }

  async login(username, password) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }
}

module.exports = new LoginPage();
