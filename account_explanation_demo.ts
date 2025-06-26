import { 
  Connection, 
  clusterApiUrl, 
  PublicKey 
} from "@solana/web3.js";
import { 
  AccountLayout, 
  MintLayout, 
  TOKEN_PROGRAM_ID 
} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

async function explainAccounts() {
  console.log("=== Solana 账户系统解释 ===\n");

  // 示例1: USDC Mint 账户
  console.log("📍 示例1: USDC 的 Mint 账户");
  const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  
  try {
    const mintAccountInfo = await connection.getAccountInfo(usdcMint);
    if (mintAccountInfo) {
      const mintData = MintLayout.decode(mintAccountInfo.data);
      
      console.log(`🏦 USDC Mint 账户: ${usdcMint.toBase58()}`);
      console.log(`   📊 总供应量: ${mintData.supply} (原始单位)`);
      console.log(`   🔢 小数位数: ${mintData.decimals} (所以 1 USDC = 10^${mintData.decimals} 最小单位)`);
      console.log(`   🔑 铸币权限: ${mintData.mintAuthorityOption ? mintData.mintAuthority.toBase58() : '无'}`);
      console.log(`   ❄️  冻结权限: ${mintData.freezeAuthorityOption ? mintData.freezeAuthority.toBase58() : '无'}`);
      console.log(`   💾 数据大小: ${mintAccountInfo.data.length} 字节\n`);
    }
  } catch (error) {
    console.error("获取 USDC Mint 信息失败:", error);
  }

  // 示例2: 查找一些 Token 账户
  console.log("📍 示例2: 查找 USDC Token 账户");
  
  try {
    // 获取一些 USDC token 账户
    const tokenAccounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        { dataSize: AccountLayout.span }, // 只要 Token 账户 (165字节)
        { 
          memcmp: {
            offset: 0, // mint 字段在开头
            bytes: usdcMint.toBase58() // 只要 USDC 的账户
          }
        }
      ]
    });

    console.log(`🔍 找到 ${tokenAccounts.length} 个 USDC Token 账户\n`);

    // 显示前3个账户的详情
    for (let i = 0; i < Math.min(3, tokenAccounts.length); i++) {
      const account = tokenAccounts[i];
      const tokenData = AccountLayout.decode(account.account.data);
      
      // 转换为实际的 USDC 数量 (除以 10^6)
      const actualAmount = Number(tokenData.amount) / Math.pow(10, 6);
      
      console.log(`👤 Token 账户 #${i + 1}: ${account.pubkey.toBase58()}`);
      console.log(`   🪙 代币类型: ${tokenData.mint.toBase58()} (USDC)`);
      console.log(`   👨‍💼 所有者: ${tokenData.owner.toBase58()}`);
      console.log(`   💰 余额: ${actualAmount.toLocaleString()} USDC`);
      console.log(`   📊 原始数量: ${tokenData.amount}`);
      console.log(`   🏷️  账户状态: ${getAccountStateText(tokenData.state)}`);
      console.log(`   💾 数据大小: ${account.account.data.length} 字节\n`);
    }

  } catch (error) {
    console.error("获取 Token 账户失败:", error);
  }

  console.log("=== 总结 ===");
  console.log("🏦 Mint 账户 (82字节):");
  console.log("   - 定义代币的基本属性");
  console.log("   - 每种代币只有一个");
  console.log("   - 控制总供应量和权限");
  console.log("");
  console.log("👤 Token 账户 (165字节):");
  console.log("   - 存储用户的代币余额");
  console.log("   - 每个用户每种代币都需要一个");
  console.log("   - 记录实际持有数量");
}

function getAccountStateText(state: number): string {
  switch (state) {
    case 0: return "未初始化";
    case 1: return "已初始化";
    case 2: return "已冻结";
    default: return `未知状态 (${state})`;
  }
}

// 运行示例
explainAccounts().catch(console.error); 