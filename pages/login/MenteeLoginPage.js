class MenteeLoginPage {
    constructor(page) {
        this.page = page;
        // Mentee login page specific elements
        this.emailInput = '#email';
        this.passwordInput = '#password';
        this.signInButton = 'button[type="submit"]:has-text("Sign In")';
        this.forgotPasswordLink = '//a[text()="Forgot"]';
        this.signupLink = '//a[text()="Sign Up"]';
        this.explainError = '.ant-form-item-explain-error';
    }

    async enterCredentials(email, password) {
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, password);
    }

    async enterEmail(email) {
        await this.page.fill(this.emailInput, email);
    }
    async enterPassword(password) {
        await this.page.fill(this.passwordInput, password);
    }
    async enterEmptyPassword(email) {
        await this.enterEmail(email);
        await this.clickPassword();
    }
    async clickEmail(email) {
        await this.page.fill(this.emailInput);
    }
    async clickPassword(password) {
        await this.page.click(this.passwordInput);
    }
    async loseFocus() {
        await this.page.click(this.emailInput);
    }

    async clickSignInButton() {
        // 等待按钮可点击
        await this.page.waitForSelector(this.signInButton, { 
            state: 'visible', 
            timeout: 10000 
        });
        await this.page.click(this.signInButton);
    }

    async clickSignInButtonAndWaitForResponse() {
        // 等待按钮可点击
        await this.page.waitForSelector(this.signInButton, { 
            state: 'visible', 
            timeout: 10000 
        });
        
        // 同时等待网络请求和点击
        const [response] = await Promise.all([
            this.page.waitForResponse(response => 
                response.url().includes('/sign_in') || 
                response.url().includes('/login') ||
                response.url().includes('/auth')
            ),
            this.page.click(this.signInButton)
        ]);
        
        return response;
    }

    async clickSignInButtonAndWaitForNavigation() {
        // 等待按钮可点击
        await this.page.waitForSelector(this.signInButton, { 
            state: 'visible', 
            timeout: 10000 
        });
        
        // 点击按钮并等待URL变化
        await this.page.click(this.signInButton);
        
        // 等待URL变化（页面跳转）
        await this.page.waitForURL('**/mentee/dashboard', { timeout: 10000 });
    }

    async clickForgotPassword() {
        await this.page.click(this.forgotPasswordLink);
    }

    async clickSignup() {
        await this.page.click(this.signupLink);
    }

    async checkRememberMe() {
        await this.page.check(this.rememberMeCheckbox);
    }

    async login(email, password) {
        await this.enterCredentials(email, password);
        await this.clickSignInButton();
    }

    async getExplainError() {
        const errorMessages = await this.page.$$(this.explainError);
        return Promise.all(errorMessages.map(async (errorMessage) => {
            return await errorMessage.textContent();
        }));
    }
}

module.exports = MenteeLoginPage; 