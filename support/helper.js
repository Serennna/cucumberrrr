const { expect } = require('@playwright/test');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function waitForToast(page, expectedMessage, timeout=5000) {
    const toast = page.locator('.ant-message-notice-content');
    await expect(toast).toHaveText(expectedMessage, { timeout });
}
module.exports = {
    capitalize,
    waitForToast,
};