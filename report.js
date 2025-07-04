const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

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

// 生成报告
report.generate({
    jsonDir: jsonDir,
    reportPath: htmlDir,
    openReportInBrowser: true,
    reportName: 'Cucumber Test Report',
    pageTitle: 'Cucumber Test Results',
    displayDuration: true,
    displayReportTime: true,
    customData: {
        title: 'Test Info',
        data: [
            { label: 'Project', value: 'Cucumber Test Suite' },
            { label: 'Environment', value: process.env.TEST_ENV || 'QA' },
            { label: 'Platform', value: process.platform },
            { label: 'Browser', value: 'Chromium' },
            { label: 'Execution Start Time', value: new Date().toISOString() }
        ]
    }
});

console.log('✅ HTML Report generated successfully!');
console.log(`📁 Report location: ${path.join(htmlDir, 'index.html')}`);
console.log(`📸 Screenshots location: ${screenshotDir}`); 