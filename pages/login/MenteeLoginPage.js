class MenteeLoginPage {
    constructor(page) {
        this.page = page;
        // Mentee login page specific elements
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

    async clickSignInButton() {
        await this.page.click(this.signInButton);
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
}

module.exports = MenteeLoginPage; 