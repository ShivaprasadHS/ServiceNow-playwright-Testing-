const { LoginPage } = require('./LoginPage');
const { InstancePage } = require('./InstancePage');

class POManager {
  constructor(page) {
    this.page = page;
  }

  getLoginPage() {
    return new LoginPage(this.page);
  }

  getInstancePage() {
    return new InstancePage(this.page);
  }
}

module.exports = { POManager };
