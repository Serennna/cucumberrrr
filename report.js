const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// 读取package.json信息
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// 确保报告目录存在
const reportsDir = path.join(__dirname, 'reports');
const jsonDir = path.join(reportsDir, 'json');
const htmlDir = path.join(reportsDir, 'html');
const screenshotDir = path.join(reportsDir, 'screenshots');

[reportsDir, jsonDir, htmlDir, screenshotDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// 获取当前时间
const now = new Date();
const executionTime = now.toISOString();

// 生成报告
report.generate({
    jsonDir: jsonDir,
    reportPath: htmlDir,
    openReportInBrowser: true,
    reportName: 'Cucumber Test Report',
    pageTitle: 'Cucumber Test Results',
    displayDuration: true,
    displayReportTime: true,
    
    // 使用customData代替metadata，避免结构问题
    customData: {
        title: 'Test Information',
        data: [
            { label: 'Project', value: packageJson.name || 'Cucumber Test Suite' },
            { label: 'Version', value: packageJson.version || '1.0.0' },
            { label: 'Environment', value: process.env.TEST_ENV || 'QA' },
            { label: 'Platform', value: process.platform },
            { label: 'Browser', value: 'Chromium' },
            { label: 'Execution Time', value: executionTime },
            { label: 'Node Version', value: process.version },
            { label: 'Test Type', value: 'E2E Tests' },
            { label: 'Cucumber Version', value: packageJson.devDependencies['@cucumber/cucumber'] || 'N/A' },
            { label: 'Playwright Version', value: packageJson.devDependencies['@playwright/test'] || 'N/A' }
        ]
    }
});

console.log('✅ HTML Report generated successfully!');
console.log(`📁 Report location: ${path.join(htmlDir, 'index.html')}`);
console.log(`📸 Screenshots location: ${screenshotDir}`); 