const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');


Given('the user is on the login page', async() => {
    await this.page.goto('https://example.com/login')
});

When('the user enters a valid username and password', async() => {
    await this.page.fill('#username', 'testuser');
    await this.page.fill('#password', 'testpassword');
});

When('the user clicks the login button', async() =>{
    await this.page.click('#login-button');
});

Then('the user should be redirected to the home page', async() =>{
    await this.page.waitForURL('https://example.com/home');
    const url = await this.page.url();
    assert.ok(url.includes('/home'));
});
