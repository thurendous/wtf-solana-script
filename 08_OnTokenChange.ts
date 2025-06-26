import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";

// 2.2 监听 PNUT 代币账户变化
const PNUT_MINT = new PublicKey("2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump"); // PNUT token地址
const PNUT_DECIMALS = 6; // PNUT 代币的小数位数

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const subscriptionId2 = connection.onProgramAccountChange(
  TOKEN_PROGRAM_ID,
  (keyedAccountInfo) => {
    const accountPubkey = keyedAccountInfo.accountId.toBase58();
    console.log(`🥜 PNUT token账户 ${accountPubkey} 更新！`);
    
    try {
      const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
      
      // 转换为实际的 PNUT 数量（考虑小数位）
      const rawAmount = Number(accountInfo.amount);
      const actualAmount = rawAmount / Math.pow(10, PNUT_DECIMALS);
      
      console.log(`👨‍💼 账户所有者: ${accountInfo.owner.toBase58()}`);
      console.log(`💰 PNUT 余额: ${actualAmount.toLocaleString()} PNUT`);
      console.log(`📊 原始数量: ${rawAmount}`);
      console.log(`🏷️  账户状态: ${getAccountStateText(accountInfo.state)}`);
      console.log(`⏰ 更新时间: ${new Date().toLocaleString()}`);
      
      // 如果是大额交易，特别标注
      if (actualAmount > 1000000) { // 超过100万 PNUT
        console.log(`🚨 大额账户！超过 100万 PNUT`);
      }
      
    } catch (error) {
      console.error(`❌ 解析 PNUT 账户数据失败:`, error instanceof Error ? error.message : String(error));
    }
    
    console.log("---");
  },
  "confirmed",
  [
    {
      memcmp: {
        offset: 0, // token account 中的 mint 地址在 offset 0
        bytes: PNUT_MINT.toBase58(), // 只匹配 PNUT 代币地址
      },
    },
  ]
);

console.log("🚀 开始监听 PNUT token 账户变化...");
console.log("📍 PNUT Mint 地址:", PNUT_MINT.toBase58());
console.log("🔗 订阅ID:", subscriptionId2);
console.log("🎯 过滤器: 只监听 PNUT 代币账户");
console.log("💡 按 Ctrl+C 退出监听\n");

function getAccountStateText(state: number): string {
  switch (state) {
    case 0: return "未初始化";
    case 1: return "已初始化";
    case 2: return "已冻结";
    default: return `未知状态 (${state})`;
  }
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭 PNUT 监听器...');
  connection.removeProgramAccountChangeListener(subscriptionId2);
  console.log('✅ 监听器已关闭');
  process.exit(0);
});
