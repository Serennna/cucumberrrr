const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 获取命令行参数
const args = process.argv.slice(2);
const featureFile = args[0];

if (!featureFile) {
    console.log('❌ 请指定要运行的feature文件');
    console.log('使用方法: node run-single-test.js <feature文件路径>');
    console.log('例如: node run-single-test.js features/login/menteeLogin.feature');
    process.exit(1);
}

// 检查文件是否存在
if (!fs.existsSync(featureFile)) {
    console.log(`❌ 文件不存在: ${featureFile}`);
    process.exit(1);
}

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

console.log(`🚀 运行单个测试文件: ${featureFile}`);

// 生成唯一的报告文件名
const fileBaseName = path.basename(featureFile, '.feature');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportFileName = `${fileBaseName}_${timestamp}.json`;

// 运行cucumber测试
const cucumberProcess = spawn('npx', [
    'cucumber-js',
    featureFile,
    '--format', `json:reports/json/${reportFileName}`,
    '--format', 'progress-bar'
], {
    stdio: 'inherit',
    shell: true
});

// 测试进程完成后的处理
cucumberProcess.on('close', (code) => {
    console.log(`\n📊 测试完成，退出代码: ${code}`);
    
    // 检查是否有JSON报告文件
    const jsonReportPath = path.join(__dirname, 'reports', 'json', reportFileName);
    if (fs.existsSync(jsonReportPath)) {
        console.log('📄 JSON报告已生成，正在生成HTML报告...');
        
        // 生成HTML报告
        const reportProcess = spawn('node', ['report.js'], {
            stdio: 'inherit',
            shell: true
        });
        
        reportProcess.on('close', (reportCode) => {
            console.log(`\n📊 报告生成完成，退出代码: ${reportCode}`);
            cleanupBrowserProcesses();
            process.exit(code);
        });
        
        reportProcess.on('error', (error) => {
            console.error('❌ 报告生成错误:', error);
            cleanupBrowserProcesses();
            process.exit(1);
        });
    } else {
        console.log('⚠️  未找到JSON报告文件，跳过HTML报告生成');
        cleanupBrowserProcesses();
        process.exit(code);
    }
});

// 处理测试进程错误
cucumberProcess.on('error', (error) => {
    console.error('❌ 测试运行错误:', error);
    cleanupBrowserProcesses();
    process.exit(1);
});

// 处理中断信号
process.on('SIGINT', () => {
    console.log('\n🛑 接收到中断信号，正在清理...');
    
    if (cucumberProcess) {
        cucumberProcess.kill('SIGINT');
    }
    
    cleanupBrowserProcesses();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 接收到终止信号，正在清理...');
    
    if (cucumberProcess) {
        cucumberProcess.kill('SIGTERM');
    }
    
    cleanupBrowserProcesses();
    process.exit(0);
});

// 清理浏览器进程的函数
function cleanupBrowserProcesses() {
    console.log('🧹 清理浏览器进程...');
    
    try {
        const platform = process.platform;
        
        if (platform === 'darwin') {
            spawn('pkill', ['-f', 'chromium'], { stdio: 'ignore' });
            spawn('pkill', ['-f', 'chrome'], { stdio: 'ignore' });
        } else if (platform === 'linux') {
            spawn('pkill', ['-f', 'chromium'], { stdio: 'ignore' });
            spawn('pkill', ['-f', 'chrome'], { stdio: 'ignore' });
        } else if (platform === 'win32') {
            spawn('taskkill', ['/f', '/im', 'chrome.exe'], { stdio: 'ignore' });
            spawn('taskkill', ['/f', '/im', 'chromium.exe'], { stdio: 'ignore' });
        }
        
        console.log('✅ 浏览器清理完成');
    } catch (error) {
        console.log('⚠️  浏览器清理警告:', error.message);
    }
} 