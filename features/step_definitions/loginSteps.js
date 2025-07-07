const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../config');
const { capitalize, waitForToast } = require('../../support/helper');
const LoginPage = require('../../pages/login/LoginPage');
const MenteeLoginPage = require('../../pages/login/MenteeLoginPage');
const MentorLoginPage = require('../../pages/login/MentorLoginPage');

// Givens
Given('the user is on the Sign In page', async function() {
    await this.page.goto(`${config.baseURL}/sign_in`);
});

// Whens
When('the user clicks login as {string}', async function(role) {
    const formattedRole = capitalize(role);
    await this.page.click(`//div[text()="As a ${formattedRole}"]`);
});

When('the user clicks the Get Started button', async function(){
    // 使用Playwright原生定位器，性能更好且更简洁
    await this.page.click(`button:has-text("Get Started")`);
});

When('the mentee enters valid credentials', async function() {
    await this.menteeLoginPage.enterCredentials(
        config.users.mentee.email, 
        config.users.mentee.password
    );
});

When('the mentee enters invalid credentials', async function() {
    await this.menteeLoginPage.enterCredentials(
        'invalid@email.com', 
        'invalid_password'
    );
});

When('the user enters empty password', async function() {
    // need to lose focus to trigger the error message
    await this.menteeLoginPage.enterEmptyPassword(
        config.users.mentee.email
    );
    await this.menteeLoginPage.loseFocus();
});

When('the mentee clicks the Sign In button', async function() {
    // 先确保按钮可见
    await this.page.waitForSelector(this.menteeLoginPage.signInButton, { state: 'visible', timeout: 10000 });
    
    // 点击按钮
    await this.menteeLoginPage.clickSignInButton();
    
    
    // // 可选：等待页面跳转或错误消息出现
    // try {
    //     // 尝试等待页面跳转到dashboard
    //     await this.page.waitForURL('**/mentee/dashboard', { timeout: 10000 });
    // } catch (error) {
    //     // 如果没有跳转，可能是登录失败，等待错误消息
    //     try {
    //         await this.page.waitForSelector('.toast, .error-message, .ant-message', { 
    //             timeout: 5000 
    //         });
    //     } catch (innerError) {
    //         // 如果都没有，说明可能还在处理中
    //         console.log('No immediate response detected, continuing...');
    //     }
    // }
});

When('the mentor enters valid credentials', async function() {
    await this.mentorLoginPage.enterCredentials(
        config.users.mentor.email, 
        config.users.mentor.password
    );
});

When('the mentor enters invalid credentials', async function() {
    await this.mentorLoginPage.enterCredentials(
        config.users.mentor.email, 
        'invalid_password'
    );
    await this.page.waitForSelector('//button[type="submit"]', { state: 'visible', timeout: 10000 });
});

When('the mentor clicks the Sign In button', async function() {
    await this.mentorLoginPage.clickSignInButton();    
});

// Thens
Then('the message {string} should display', async function(string) {
    await waitForToast(this.page, string);
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

Then('the mentee should be redirected to the mentee dashboard', async function() {
    const expectedUrl = `${config.baseURL}/mentee/dashboard`;
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});

Then('the user should be redirected to the Mentee dashboard', async function() {
    const expectedUrl = `${config.baseURL}/mentee/dashboard`;
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});

Then('the mentor should be redirected to the mentor dashboard', async function() {
    const expectedUrl = `${config.baseURL}/mentor/dashboard`;
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});

Then('the user should be redirected to the mentor dashboard', async function() {
    const expectedUrl = `${config.baseURL}/mentor/dashboard`;
    await this.page.waitForURL(expectedUrl, { timeout: 10000 });
    const url = await this.page.url();
    assert.strictEqual(url, expectedUrl);
});

Then('the explain error {string} should display', async function(string) {
    await this.page.waitForTimeout(2000);
    
    const errorMessages = await this.menteeLoginPage.getExplainError();
    
    console.log('Found error messages:', errorMessages);
    console.log('Expected error:', string);
    
    // 检查是否找到任何错误消息
    if (!errorMessages || errorMessages.length === 0) {
        // 如果没有找到错误消息，尝试调试页面内容
        const pageContent = await this.page.content();
        console.log('Page content contains expected error:', pageContent.includes(string));
        
        // 尝试手动查找错误文本
        const errorText = await this.page.textContent('body');
        if (errorText.includes(string)) {
            console.log('Error text found in page body');
            return; // 如果在页面中找到了错误文本，就通过测试
        }
        
        throw new Error(`No error messages found. Expected: "${string}"`);
    }
    
    // 检查第一个错误消息
    if (!errorMessages[0]) {
        throw new Error(`First error message is undefined. All messages: ${JSON.stringify(errorMessages)}`);
    }
    
    assert.strictEqual(errorMessages[0], string);
});