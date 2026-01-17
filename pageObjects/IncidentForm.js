const { expect } = require('@playwright/test');

class IncidentForm {
  constructor(page) {
    this.frame = page.frameLocator('#gsft_main');

    //this.incidentNumber = this.frame.locator('#incident.number');
    this.callerLookup = this.frame.locator('//button[@id ="lookup.incident.caller_id"]');
    //this.searchInput = this.frame.locator('#sys_user_table_header_search_control');
    this.category = this.frame.locator('//select[@id = "incident.category"]');
    this.subcategory = this.frame.locator('//select[@id = "incident.subcategory"]');
  }

  
  async getIncNumberByLabel(formLable) {
    const labelVisible = this.frame.locator(`//span[text() = "${formLable}"]`);
    await expect(labelVisible).toBeVisible();
    if(!(labelVisible)){
        console.log(`Label "${formLable}" not found`);
    } else{
        console.log(`Label "${formLable}" is found and visible`)
        const incidentNumber = this.frame.locator('//input[@id = "incident.number"]');
        const value = await incidentNumber.inputValue();
        return value;
    }

  }

  async getCallerByLabel(callerLabel, page) {
  // 1) Label visible
  const label = this.frame.locator(`span:has-text("${callerLabel}")`);
  await expect(label).toBeVisible();
  console.log(`Label "${callerLabel}" is found and visible`);

  // 2) Mandatory icon
  const mandatoryIcon = this.frame.locator('#status\\.incident\\.caller_id');
  await expect(mandatoryIcon).toBeVisible();
  const mandatoryAttr = await mandatoryIcon.getAttribute('mandatory');
  console.log('Caller mandatory:', mandatoryAttr === 'true');

  // 3) Click lookup and wait for navigation to sys_user_list.do
  await Promise.all([
    page.context().waitForURL('**/sys_user_list.do**', { timeout: 15000 }), // same tab navigation[web:85][web:87]
    this.callerLookup.click()
  ]);

  // 4) Search in Users list
  const searchInput = page.locator('#sys_user_table_header_search_control');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('Abraham Lincoln');
  await searchInput.press('Enter');

  await page
    .locator('a', { hasText: 'Abraham Lincoln' })
    .first()
    .click(); // selects user and returns to incident form

  // 5) Back on Incident form in same tab
  // Wait for incident form URL again (optional but safer)
  await page.waitForURL('**/incident.do**', { timeout: 15000 });

  const callerDisplay = this.frame.locator('#sys_display\\.incident\\.caller_id');
  await expect(callerDisplay).toBeVisible();
  const callerName = await callerDisplay.inputValue();
  return callerName;
}



  // async getCallerByLabel(callerLabel,page) {
  //   const callerLabelVisible = this.frame.locator(`//span[text() = "${callerLabel}"]`)
  //   await expect(callerLabelVisible).toBeVisible()
  //   if(callerLabelVisible){
  //       console.log("Caller Lable is visible")
  //       const mandatoryicon = this.frame.locator('//span[@id = "status.incident.caller_id"]');
  //       const isMandatoryIcon = await mandatoryicon.getAttribute('mandatory');        
  //       if(isMandatoryIcon === "true"){
  //           console.log("Caller Field is marked mandatory");
  //       } else{
  //           console.log("Caller Field is not made mandatory");
  //       }
  //       await Promise.all([
  //           page.waitForURL('**/sys_user_list.do/**'),
  //           await this.callerLookup.click()
  //       ])
  //       const name = page.locator('#sys_user_table_header_search_control');
  //       await name.fill("Abraham Lincoln")
  //       await name.press('Enter');
  //       await page.locator('glide_ref_item_link',{ hasText: "Abraham Lincoln"}).click();

  //   } else {
  //       console.log(`Label ${callerLabel} is not visible`);
  //   }
  // }


async getCategoryLabel(category){
  const categoryVisible = this.frame.locator(`//span[text() = "${category}"]`)
  await expect(categoryVisible).toBeVisible()
  if(categoryVisible){
    console.log(`Label "${category}" is visible`);
  } else {
    console.log(`Label "${category}" is not visible`);
  }
}
  async getSubCategoryLabel(subCategory){
  const subCategoryVisible = this.frame.locator(`//span[text() = "${subCategory}"]`)
  await expect(subCategoryVisible).toBeVisible()
  if(subCategoryVisible){
    console.log(`Label "${subCategory}" is visible`);
  } else {
    console.log(`Label "${subCategory}" is not visible`);
  }
}

  async validateCategorySubcategory() {
    // Make sure the select exists, then is visible
    await this.category.waitFor({ state: 'attached', timeout: 15000 }); // attached to DOM[web:37][web:46]
    await this.category.waitFor({ state: 'visible', timeout: 15000 });  // visible

    // Wake up ServiceNow choice loading
    await this.category.click();

    // Wait until real category options load (placeholder + data)
    await expect
      .poll(async () => {
        return await this.category.locator('option').count();
      })
      .toBeGreaterThan(1); // at least 2 options[web:26]

    const categoryOptions = await this.category.locator('option').all();

    // Skip option[0] if it is empty/placeholder
    for (const catOption of categoryOptions.slice(1)) {
      const categoryValue = await catOption.getAttribute('value');
      if (!categoryValue) continue;

      const categoryText = (await catOption.textContent()).trim();
      console.log(`\nCategory → ${categoryText}`);

      await this.category.selectOption(categoryValue);

      // Wait for subcategory to refresh
      await this.subcategory.waitFor({ state: 'visible', timeout: 15000 });

      await expect.poll(async () => {
      return await this.subcategory.inputValue();
      }).toBe('');

      await expect
        .poll(async () => {
          return await this.subcategory.locator('option').count();
        })
        .toBeGreaterThan(0);

      const subOptions = await this.subcategory.locator('option').all();

      if (subOptions.length <= 1) {
        console.log('   (No subcategories)');
        continue;
      }

      for (const subOption of subOptions.slice(1)) {
        const subValue = await subOption.getAttribute('value');
        if (!subValue) continue;

        const subText = (await subOption.textContent()).trim();
        console.log(`   Subcategory → ${subText}`);

        await this.subcategory.selectOption(subValue);

        const selectedSub = await this.subcategory.inputValue();
        if (selectedSub !== subValue) {
          throw new Error(`Subcategory not set: ${categoryText} → ${subText}`);
        }
      }
    }
  }





}

module.exports = { IncidentForm };