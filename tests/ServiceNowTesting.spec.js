const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
const { InstancePage } = require('../pageObjects/InstancePage');
const { IncidentForm } = require('../pageObjects/IncidentForm');

test('ServiceNow – Create Incident', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  const poManager = new POManager(page);

  const userName = 'hs.shivaprasad@tcs.com';
  const password = 'Tcs@1234';

  // -------- Login --------
  const loginPage = poManager.getLoginPage();
  await loginPage.open();
  await loginPage.login(userName, password);

  await loginPage.verifyInstalledApps([
    "Build Agent",
    "ServiceNow Studio",
    "App engine studio"
  ]);

  // -------- Open Instance (NEW TAB) --------
  const launcherPage = poManager.getInstancePage();
  const instanceTab = await launcherPage.openInstance();

  // IMPORTANT: new page → new page object
  const instancePage = new InstancePage(instanceTab);
  await instancePage.openCreateIncident();

  // -------- Incident Form (IFRAME) --------
  const incidentForm = new IncidentForm(instanceTab);
  const incidentNumber = await incidentForm.getIncNumberByLabel("Number");
  console.log('Incident Number : ', incidentNumber);

  const caller = await incidentForm.getCallerByLabel("Caller",instanceTab);
  console.log('Caller Name : ', caller);

  await incidentForm.getCategoryLabel("Category");
  await incidentForm.getSubCategoryLabel("Subcategory");
  await incidentForm.validateCategorySubcategory();
  
  
});

// const {test,expect} = require('@playwright/test');
// test('servicenow',async({browser})=> {
//     //new context and new page
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     // landing page
//     await page.goto('https://developer.servicenow.com/dev.do');


//     //signin button 
//     await page.locator('#utility-sign-in')
//               .locator('.sn-cx-navigation__utility-button-signin')
//               .locator('.sn-cx-navigation__utility-button-signin-text',{hasText : 'Sign in'}).click();

//     //user credentials
//     const userName = page.locator("//input[@id = 'username']")
//     await userName.clear(' ');
//     await userName.fill("hs.shivaprasad@tcs.com");
//     const submitBtn = page.locator("//button[@id = 'identify-submit']");
//     await submitBtn.click();
//     const password  = page.locator("//input[@id = 'password']");
//     await password.fill("Tcs@1234");
//     const submit = page.locator("//button[@id = 'challenge-authenticator-submit']");
//     await submit.click();

//     //Cookie
//     await page.locator('#truste-button-container')
//           .locator('button.truste-button2', { hasText: 'Accept and Proceed' })
//           .click();
//     await page.locator(".sn-cx-navigation__secondary-menu-toggle .sn-cx-navigation__secondary-menu-expanded-icon").click(); // dropdown

//     // manage my instance button
//     await page.locator('.sn-cx-navigation__secondary-menu-ctas')
//               .locator('#cta-developer-manage-instance-cta', {hasText: 'Manage my instance'})
//               .click();

//     // close pop up
//     await page.locator('.wm-close-button')
//               .locator('.walkme-to-remove')
//               .locator('.SkipThisFixedPosition')
//               .locator('.walkme-icon-image-div',{hasText : 'X'})
//               .click();

//     //close 2nd pop up
//     //await page.locator('.walkme-click-and-hover').click();
//     await page.locator('.walkme-custom-balloon-button')
//               .locator('.walkme-custom-balloon-button-text', {hasText : 'Done'})
//               .click();
    
//     // checking the version
//     await expect(page.getByText("Online")).toBeVisible();
//     await expect(page.getByText("Installed")).toHaveCount(3);
//     await expect(page.locator('.instance-info-container')
//                      .getByText("Zurich")).toBeVisible();


//     //instance info
//     await expect(page.locator('.instance-info-container')
//                      .locator('.user-name')
//                      .locator('.user-name-label', {hasText : 'User name'})
//                      .locator('user-name-value', {hasText : 'admin'})
//                 );
//     await expect(page.locator('.user-role')
//                      .locator('.user-role-label', {hasText : 'User role'})
//                      .locator('user-role-value', {hasText : 'admin'})
//                 );
    

//     //click on instance url 
//     await page.locator('.instance-url-value')
//               .locator('.instance-url-text')
//               .click();

    
//     // // await page.locator(".sn-cx-navigation__secondary-menu-cta-button --secondary").click()
//     // // await page.locator(".SkipThisFixedPosition").click();
//     // // await page.locator(".instance-url-text").click();
//     await page.pause();
// })