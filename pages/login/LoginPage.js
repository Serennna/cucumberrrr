// 页面操作封装 - Page Object
class LoginPage {
    constructor(page) {
        this.page = page;
        // 通用登录页面元素
        this.menteeRoleButton = '//div[contains(text(),"As a Mentee")]';
        this.mentorRoleButton = '//div[contains(text(),"As a Mentor")]';
        this.getStartedButton = 'button:has-text("Get Started")';
    }

    async navigateToSignIn() {
        await this.page.goto('https://ohhello-qa.web.app/sign_in');
    }

    async clickMenteeRole() {
        await this.page.click(this.menteeRoleButton);
    }

    async clickMentorRole() {
        await this.page.click(this.mentorRoleButton);
    }

    async clickGetStarted() {
        await this.page.click(this.getStartedButton);
    }

    async selectRoleAndProceed(role) {
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        await this.page.click(`//div[text()="As a ${formattedRole}"]`);
        await this.clickGetStarted();
    }
}

module.exports = LoginPage;