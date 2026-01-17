class InstancePage {
  constructor(page) {
    this.page = page;

    this.instanceLink = page.locator('.instance-url-text')
      .filter({ hasText: 'https://dev355030.service-now.com/' });
  }

  async openInstance() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.instanceLink.click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForLoadState('networkidle');

    return newPage;
  }

  async openCreateIncident() {
    await this.page.getByText('All',{exact:true,}).click();

    await this.page.locator('.navigation-filter')
      .pressSequentially('incid');

    await this.page.getByText('Create New', { exact: true }).click();

    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { InstancePage };