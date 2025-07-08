const { Before, After, BeforeAll, AfterAll, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const LoginPage = require('../pages/login/LoginPage');
const MenteeLoginPage = require('../pages/login/MenteeLoginPage');
const MentorLoginPage = require('../pages/login/MentorLoginPage');
const fs = require('fs');
const path = require('path');

// 全局变量来跟踪所有打开的浏览器实例
let globalBrowsers = [];

class CustomWorld {
    async launchBrowser() {
        const headless = process.env.TEST_HEADLESS === 'true';
        
        this.browser = await chromium.launch({ 
            headless: headless,  // 根据环境变量决定是否headless模式
            timeout: 10000    // 增加超时时间
        });
        
        // 将浏览器实例添加到全局数组中
        globalBrowsers.push(this.browser);
        
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        
        // 在页面创建后立即实例化页面对象
        this.loginPage = new LoginPage(this.page);
        this.menteeLoginPage = new MenteeLoginPage(this.page);
        this.mentorLoginPage = new MentorLoginPage(this.page);
    }

    async closeBrowser() {
        try {
            if (this.page) {
                await this.page.close();
                this.page = null;
            }
            if (this.context) {
                await this.context.close();
                this.context = null;
            }
            if (this.browser) {
                await this.browser.close();
                // 从全局数组中移除
                globalBrowsers = globalBrowsers.filter(b => b !== this.browser);
                this.browser = null;
            }
        } catch (error) {
            console.log('Error closing browser:', error.message);
        }
    }
}

setWorldConstructor(CustomWorld);

// 测试套件开始前的钩子
BeforeAll(async function() {
    console.log('🚀 Starting test suite...');
    
    // 设置进程退出处理器
    process.on('SIGINT', async () => {
        console.log('\n🛑 Received SIGINT, cleaning up...');
        await cleanupAllBrowsers();
        process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
        console.log('\n🛑 Received SIGTERM, cleaning up...');
        await cleanupAllBrowsers();
        process.exit(0);
    });
});

// 测试套件结束后的钩子
AfterAll(async function() {
    console.log('Test suite completed, cleaning up...');
    await cleanupAllBrowsers();
});

// 清理所有浏览器实例的函数
async function cleanupAllBrowsers() {
    console.log('Cleaning up all browser instances...');
    for (const browser of globalBrowsers) {
        try {
            await browser.close();
        } catch (error) {
            console.log('Error closing browser:', error.message);
        }
    }
    globalBrowsers = [];
    console.log('✅ All browser instances cleaned up');
}

// 增加超时时间到15秒
Before({ timeout: 15000 }, async function() {
    await this.launchBrowser();
});

After(async function(scenario) {
    try {
        if (scenario.result && scenario.result.status === 'FAILED') {
            // 确保截图目录存在
            const screenshotDir = path.join(__dirname, '..', 'reports', 'screenshots');
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }
            
            // 生成截图文件名
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
            const screenshotPath = path.join(screenshotDir, `${scenarioName}_${timestamp}.png`);
            
            // 截图
            if (this.page) {
                await this.page.screenshot({ path: screenshotPath, fullPage: true });
                console.log('Screenshot saved:', screenshotPath);
                
                // 尝试附加截图到报告
                if (this.attach) {
                    try {
                        const screenshot = fs.readFileSync(screenshotPath);
                        this.attach(screenshot, 'image/png');
                        console.log('Screenshot attached to report');
                    } catch (attachError) {
                        console.log('Error attaching screenshot:', attachError.message);
                    }
                }
            }
        }
    } catch (error) {
        console.log('Error in After hook:', error.message);
    } finally {
        // 无论成功还是失败都要关闭浏览器
        await this.closeBrowser();
    }
});