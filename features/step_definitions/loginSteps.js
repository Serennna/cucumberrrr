const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../config');
const { capitalize } = require('../../support/helper');

// Login Navigations functions
Given('the user is on the Sign In page', async function() {
    await this.page.goto(`${config.baseURL}/sign_in`);
});

When('the user clicks login as {string}', async function(role) {
    const formattedRole = capitalize(role);
    await this.page.click(`//div[text()="As a ${formattedRole}"]`);
});

When('the user clicks the Get Started button', async function(){
    // 使用Playwright原生定位器，性能更好且更简洁
    await this.page.click(`button:has-text("Get Started")`);
});

Then('the user should be redirected to the {string} login page', async function(role) {
    const formattedRole = role.toLowerCase();
    const expectedUrl = `${config.baseURL}/${formattedRole}/sign_in`;
    
    // wait for the url to be the expected url
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    
    // confirm the url is the expected url
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});

// Mentee specific login steps
When('the mentee enters valid credentials', async function() {
    await this.menteeLoginPage.enterCredentials(
        config.users.mentee.email, 
        config.users.mentee.password
    );
});

When('the mentee clicks the Sign In button', async function() {
    await this.menteeLoginPage.clickSignInButton();
});

Then('the mentee should be redirected to the mentee dashboard', async function() {
    const expectedUrl = `${config.baseURL}/mentee/dashboard`;
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});

// Mentor specific login steps
When('the mentor enters valid credentials', async function() {
    await this.mentorLoginPage.enterCredentials(
        config.users.mentor.email, 
        config.users.mentor.password
    );
});

When('the mentor clicks the login button', async function() {
    await this.mentorLoginPage.clickLoginButton();
});

Then('the mentor should be redirected to the mentor dashboard', async function() {
    const expectedUrl = `${config.baseURL}/mentor/dashboard`;
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});
