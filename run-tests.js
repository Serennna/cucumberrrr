const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 确保报告目录存在
const reportsDir = path.join(__dirname, 'reports');
[
    reportsDir,
    path.join(reportsDir, 'json'),
    path.join(reportsDir, 'html'),
    path.join(reportsDir, 'screenshots')
].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('🚀 Starting Cucumber tests...');

// 运行cucumber测试
const cucumberProcess = spawn('npx', ['cucumber-js'], {
    stdio: 'inherit',
    shell: true
});

// 测试进程完成后的处理
cucumberProcess.on('close', (code) => {
    console.log(`\n📊 Tests completed with exit code: ${code}`);
    
    // 检查是否有JSON报告文件
    const jsonReportPath = path.join(__dirname, 'reports', 'json', 'cucumber-report.json');
    if (fs.existsSync(jsonReportPath)) {
        console.log('📄 JSON report found, generating HTML report...');
        
        // 生成HTML报告
        const reportProcess = spawn('node', ['report.js'], {
            stdio: 'inherit',
            shell: true
        });
        
        reportProcess.on('close', (reportCode) => {
            console.log(`\n📊 Report generation completed with exit code: ${reportCode}`);
            
            // 清理残留的浏览器进程
            cleanupBrowserProcesses();
            
            // 退出主进程
            process.exit(code);
        });
        
        reportProcess.on('error', (error) => {
            console.error('❌ Error generating report:', error);
            cleanupBrowserProcesses();
            process.exit(1);
        });
    } else {
        console.log('⚠️  No JSON report found, skipping HTML report generation');
        cleanupBrowserProcesses();
        process.exit(code);
    }
});

// 处理测试进程错误
cucumberProcess.on('error', (error) => {
    console.error('❌ Error running tests:', error);
    cleanupBrowserProcesses();
    process.exit(1);
});

// 处理中断信号
process.on('SIGINT', () => {
    console.log('\n🛑 Received interrupt signal, cleaning up...');
    
    // 终止cucumber进程
    if (cucumberProcess) {
        cucumberProcess.kill('SIGINT');
    }
    
    cleanupBrowserProcesses();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received terminate signal, cleaning up...');
    
    // 终止cucumber进程
    if (cucumberProcess) {
        cucumberProcess.kill('SIGTERM');
    }
    
    cleanupBrowserProcesses();
    process.exit(0);
});

// 清理浏览器进程的函数
function cleanupBrowserProcesses() {
    console.log('🧹 Cleaning up browser processes...');
    
    try {
        // 在不同操作系统上清理chromium进程
        const platform = process.platform;
        
        if (platform === 'darwin') {
            // macOS
            spawn('pkill', ['-f', 'chromium'], { stdio: 'ignore' });
            spawn('pkill', ['-f', 'chrome'], { stdio: 'ignore' });
        } else if (platform === 'linux') {
            // Linux
            spawn('pkill', ['-f', 'chromium'], { stdio: 'ignore' });
            spawn('pkill', ['-f', 'chrome'], { stdio: 'ignore' });
        } else if (platform === 'win32') {
            // Windows
            spawn('taskkill', ['/f', '/im', 'chrome.exe'], { stdio: 'ignore' });
            spawn('taskkill', ['/f', '/im', 'chromium.exe'], { stdio: 'ignore' });
        }
        
        console.log('✅ Browser cleanup completed');
    } catch (error) {
        console.log('⚠️  Browser cleanup warning:', error.message);
    }
} 