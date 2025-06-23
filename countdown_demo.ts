// 倒计时演示脚本

async function countdownDemo(seconds: number) {
    console.log(`🕐 开始 ${seconds} 秒倒计时演示:\n`);
    
    let countdown = seconds;
    
    // 方法1: 使用 setInterval 显示倒计时
    console.log("方法1: 使用 setInterval + process.stdout.write");
    const interval = setInterval(() => {
        // \r 让光标回到行首，实现原地更新
        process.stdout.write(`\r⏰ 倒计时: ${countdown} 秒`);
        countdown--;
        
        if (countdown < 0) {
            clearInterval(interval);
            console.log("\n✅ 倒计时结束!\n");
        }
    }, 1000);
    
    // 实际等待时间
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function countdownComparison() {
    // 先演示错误的方法
    console.log("❌ 错误方法 - 使用 console.log (会产生很多行):");
    for (let i = 5; i >= 1; i--) {
        console.log(`倒计时: ${i} 秒`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log("结束!\n");
    
    // 再演示正确的方法
    console.log("✅ 正确方法 - 使用 process.stdout.write + \\r:");
    let countdown = 5;
    const interval = setInterval(() => {
        process.stdout.write(`\r倒计时: ${countdown} 秒`);
        countdown--;
        
        if (countdown < 0) {
            clearInterval(interval);
            console.log("\n结束!\n");
        }
    }, 1000);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
}

async function main() {
    console.log("🎯 倒计时技术演示\n");
    
    // 演示对比
    await countdownComparison();
    
    // 演示关键技术
    console.log("📚 关键技术点:");
    console.log("1. \\r : 回车符，让光标回到行首");
    console.log("2. process.stdout.write(): 不换行输出");
    console.log("3. setInterval(): 定时更新显示");
    console.log("4. Promise + setTimeout(): 实际等待时间");
    console.log("5. clearInterval(): 清理定时器\n");
    
    // 进行一个 10 秒的演示
    await countdownDemo(10);
}

main().catch(console.error); 