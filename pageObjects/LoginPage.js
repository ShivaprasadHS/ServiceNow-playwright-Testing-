const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    this.signInBtn = page.getByRole('button',{name: 'Sign in',hasText:'Sign in', exact : true});
    this.userName = page.locator('#username');
    this.password = page.locator('#password');
    this.submitUser = page.locator('#identify-submit');
    this.submitPwd = page.locator('#challenge-authenticator-submit');

    this.dropDown = page.getByRole('button', {name: 'Expand the secondary navigation menu'});
    this.manageInstance = page.getByText('Manage my instance');
    this.cookieBtn = page.getByRole('button',{name : 'Accept and Proceed',exact : true});
    this.popUp1 = page.locator('.walkme-launcher-image-div').getByText('X', { exact: true });
    this.popUp2 = page.getByRole('button',{name : 'Done',exact : true});
  }

  async open() {
    await this.page.goto('https://developer.servicenow.com/dev.do');
  }

  async login(userName, password) {
    await this.signInBtn.click();

    await this.userName.fill(userName);
    await this.submitUser.click();

    await this.password.fill(password);
    await this.submitPwd.click();
    // await this.page.pause();

    await this.cookieBtn.click();
    await this.dropDown.click();
    await this.manageInstance.click();
    await this.popUp1.click();
    await this.popUp2.click();

    await expect(this.page.getByText('Online')).toBeVisible();
  }


  async verifyInstalledApps(appNames) {
    for (const appName of appNames) {
      // Find the app row that contains the app name
      const row = this.page.locator(
        '.installed-apps-section > .installed-app',
        { has: this.page.locator('.installed-app-name', { hasText: appName }) }
      );

      // Ensure the row is present and visible
      await expect(row, `Row for "${appName}" should be visible`).toBeVisible();

      // Prefer class-based status first
      const statusByClass = row.locator('.app-status.installed');

      // If class is absent, fall back to text "Installed"
      const statusByText = row.locator('.app-status').getByText('Installed', { exact: false });

      const hasClass = await statusByClass.first().isVisible();
      const hasText = hasClass ? true : await statusByText.first().isVisible();

      expect(
        hasClass || hasText,
        `Status for "${appName}" should indicate Installed (class ".app-status.installed" or text "Installed")`
      ).toBeTruthy();

      console.log(`${appName} is installed`);
    }
  }

}

module.exports = { LoginPage };