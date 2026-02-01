const {test,expect} = require('@playwright/test');
test('servicenow',async({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/'); // landing page
    // await page.locator("text = Sign in").click(); // signin button
    // await page.getByRole("button",{name: "Sign In", exact:true});
    //await page.locator()
    console.log("Full URL test");
    await expect(page).toHaveURL('https://rahulshettyacademy.com/AutomationPractice/');

    console.log('this is for partial text')
    await expect(page).toHaveURL(/rahulshettyacadem?y\.com/);

    console.log('check the title of the website');
    await expect(page).toHaveTitle('Practice Page');

    console.log("blinking text assertion");
    const element = page.locator('.blinkingText');
    await expect(element).toHaveClass(/blinkingText/);
    await expect(element).toBeVisible();
    const text1 = await element.textContent();
    console.log(text1);
    const text2 = await element.innerText();
    console.log(text2);

    // await page.screenshot({path: 'page1.png'});
    // await page.screenshot({path:'page.jpg'});


    const h1Text = page.locator('h1');
    await expect(h1Text).toHaveText('Practice Page');
    console.log(await h1Text.innerText());
    console.log(await h1Text.textContent());
    await expect(h1Text).toContainText('Practice Page');

    const header = page.locator('header.header_style');

    console.log(await header.allInnerTexts());
    console.log(await header.allTextContents());

    await expect(header.getByRole('button',{name: "Home", exact:true})).toBeVisible();
    await expect(header.getByRole('button',{name:"Home", exact:true})).toHaveText('Home');
    await header.getByRole('button',{name: "Home",exact:true}).hover();
    await header.getByRole('button',{name: "Home",exact:true}).focus();


    await expect(header.getByRole('button',{name:"Practice", exact:true})).toBeVisible();
    await expect(header.getByRole('button',{name:"Practice", exact:true})).toHaveText('Practice');
    await header.getByRole('button',{name: "Practice",exact:true}).hover();
    await header.getByRole('button',{name: "Practice",exact:true}).focus();


    await expect(header.getByRole('button',{name:"Login", exact:true})).toBeVisible();
    await expect(header.getByRole('button',{name:"Signup", exact:true})).toBeVisible();

    const radioColumn = page.locator('fieldset > legend').first();
    await expect(radioColumn).toBeVisible();
    await expect(radioColumn).toHaveText('Radio Button Example');
    await expect(radioColumn).toContainText('Radio Button Example');
    console.log(await radioColumn.innerText());
    console.log(await radioColumn.textContent());


    console.log("Radio Button");
    const radioGroup = page.locator('#radio-btn-example');
    console.log(await radioGroup.allInnerTexts());
    console.log(await radioGroup.allTextContents());

    await expect(radioGroup.locator('input[type="radio"][value="radio1"]')).toBeVisible();
    await expect(radioGroup.locator('input[type="radio"][value="radio1"]')).toHaveAttribute('type','radio');
    await radioGroup.locator('input[type="radio"][value="radio1"]').check();
    await expect(radioGroup.locator('input[type="radio"][value="radio1"]')).toBeChecked();
    //await radioGroup.locator('input[type="radio"][value="radio1"]').not.toBeChecked();

    const suggestionColumn = page.locator('#select-class-example').locator('fieldset > legend');
    await expect(suggestionColumn).toBeVisible();
    await expect(suggestionColumn).toHaveText('Suggession Class Example');
    await expect(suggestionColumn).toContainText('Suggession Class Example');
    console.log(await suggestionColumn.innerText());
    console.log(await suggestionColumn.textContent());

    // const suggField = page.locator('input[type = "text"]');
    // await expect(suggField).toHaveAttribute('placeholder','Type to Select Countries');
    // await suggField.pressSequentially('india');

    
    // const suggField = page.getByPlaceholder('Type to Select Countries');
    // await expect(suggField).toBeVisible();
    // await expect(suggField).toHaveAttribute('placeholder', 'Type to Select Countries');
    // await suggField.click();
    // await suggField.pressSequentially('india');


    const dropdownColumn = page.locator('#cen-right-align').locator('fieldset > legend');
    // await expect(dropdownColumn).toBeVisible();
    await expect(dropdownColumn).toHaveText('Dropdown Example');
    await expect(dropdownColumn).toContainText('Dropdown Example');
    console.log(await dropdownColumn.innerText());
    console.log(await dropdownColumn.textContent());
    

    const opt =  page.locator('//select[id = "dropdown-class-example"]');
    await expect(opt).toHaveAttribute('name','dropdown-class-example');
    console.log(await opt.allInnerTexts());
    console.log(await opt.allTextContents());
    await expect(opt).toBeVisible();
    await opt.click();
    await expect(opt.locator('option',{hasText:'option1'})).toBeVisible();
    await expect(opt.locator('option',{hasText:'option2'})).toBeVisible();
    await expect(opt.locator('option',{hasText:'option2'})).toBeVisible();

    await opt.locator('option',{hasText: 'option2'}).click();
    console.log(opt.textContent());
    console.log(opt.inputValue());

    



    // await page.pause();
})