class MentorLoginPage {
    constructor(page) {
        this.page = page;
        // Mentor login page specific elements
        this.emailInput = '#email';
        this.passwordInput = '#password';
        this.signInButton = '//button[type="submit"]';
        this.forgotPasswordLink = '//a[text()="Forgot"]';
        this.signupLink = '//a[text()="Sign Up"]';
    }

    async enterCredentials(email, password) {
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, password);
    }

    async enterProfessionalCode(code) {
        await this.page.fill(this.professionalCodeInput, code);
    }

    async selectExperienceLevel(level) {
        await this.page.selectOption(this.experienceDropdown, level);
    }

    async clickSignInButton() {
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
        await this.page.waitForURL('**/mentor/dashboard', { timeout: 10000 });
    }

    async clickForgotPassword() {
        await this.page.click(this.forgotPasswordLink);
    }

    async clickSignup() {
        await this.page.click(this.signupLink);
    }

    async login(email, password, professionalCode = null) {
        await this.enterCredentials(email, password);
        if (professionalCode) {
            await this.enterProfessionalCode(professionalCode);
        }
        await this.clickSignInButton();
    }
}

module.exports = MentorLoginPage; 