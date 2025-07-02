const { Before, After, setWorldConstructor} = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class CustomWorld {
    async launchBrowser() {
        this.browser = await chromium.launch();
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    async closeBrowser() {
        await this.browser.close();
    }
}

setWorldConstructor(CustomWorld);

Before(async function() {
    await this.launchBrowser();
});

After(async function() {
    await this.closeBrowser();
});