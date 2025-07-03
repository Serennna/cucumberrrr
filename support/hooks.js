const { Before, After, setWorldConstructor} = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const LoginPage = require('../pages/login/LoginPage');
const MenteeLoginPage = require('../pages/login/MenteeLoginPage');
const MentorLoginPage = require('../pages/login/MentorLoginPage');

class CustomWorld {
    async launchBrowser() {
        this.browser = await chromium.launch({ 
            headless: false,  // 设置为 true 可以无头模式运行
            timeout: 10000    // 增加超时时间
        });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        
        // 在页面创建后立即实例化页面对象
        this.loginPage = new LoginPage(this.page);
        this.menteeLoginPage = new MenteeLoginPage(this.page);
        this.mentorLoginPage = new MentorLoginPage(this.page);
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

setWorldConstructor(CustomWorld);

Before(async function() {
    await this.launchBrowser();
});

After(async function() {
    await this.closeBrowser();
});