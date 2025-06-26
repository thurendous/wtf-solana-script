import { MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 存储之前的 Mint 状态，用于比较变化
const mintStateCache = new Map<string, {
  supply: bigint;
  mintAuthority: string | null;
  freezeAuthority: string | null;
}>();

const subscriptionId = connection.onProgramAccountChange(
  TOKEN_PROGRAM_ID,
  (keyedAccountInfo) => {
    const mintPubkey = keyedAccountInfo.accountId.toBase58();
    const dataLength = keyedAccountInfo.accountInfo.data.length;
    
    // 只处理 Mint 账户 (82 字节)
    if (dataLength === MintLayout.span) {
      try {
        const mintInfo = MintLayout.decode(keyedAccountInfo.accountInfo.data);
        
        console.log(`🏦 Mint 账户更新: ${mintPubkey}`);
        console.log(`⏰ 时间: ${new Date().toLocaleString()}`);
        
        // 获取之前的状态
        const previousState = mintStateCache.get(mintPubkey);
        
        // 当前状态
        const currentSupply = mintInfo.supply;
        const currentMintAuth = mintInfo.mintAuthorityOption ? mintInfo.mintAuthority.toBase58() : null;
        const currentFreezeAuth = mintInfo.freezeAuthorityOption ? mintInfo.freezeAuthority.toBase58() : null;
        
        console.log(`📊 当前总供应量: ${currentSupply}`);
        console.log(`🔢 小数位数: ${mintInfo.decimals}`);
        console.log(`🔑 铸币权限: ${currentMintAuth || '无'}`);
        console.log(`❄️  冻结权限: ${currentFreezeAuth || '无'}`);
        
        // 检测变化
        if (previousState) {
          // 供应量变化
          if (previousState.supply !== currentSupply) {
            const supplyChange = currentSupply - previousState.supply;
            if (supplyChange > 0n) {
              console.log(`🚀 代币铸造！新增供应量: ${supplyChange}`);
              console.log(`📈 供应量变化: ${previousState.supply} → ${currentSupply}`);
            } else {
              console.log(`🔥 代币销毁！减少供应量: ${-supplyChange}`);
              console.log(`📉 供应量变化: ${previousState.supply} → ${currentSupply}`);
            }
          }
          
          // 铸币权限变化
          if (previousState.mintAuthority !== currentMintAuth) {
            console.log(`🔄 铸币权限变化:`);
            console.log(`   之前: ${previousState.mintAuthority || '无'}`);
            console.log(`   现在: ${currentMintAuth || '无'}`);
            
            if (previousState.mintAuthority && !currentMintAuth) {
              console.log(`🔒 铸币权限已永久撤销！这个代币变为固定供应量`);
            }
          }
          
          // 冻结权限变化
          if (previousState.freezeAuthority !== currentFreezeAuth) {
            console.log(`🧊 冻结权限变化:`);
            console.log(`   之前: ${previousState.freezeAuthority || '无'}`);
            console.log(`   现在: ${currentFreezeAuth || '无'}`);
          }
        } else {
          console.log(`🆕 新发现的 Mint 账户！`);
          
          // 检查是否是新创建的代币（供应量为0）
          if (currentSupply === 0n) {
            console.log(`✨ 全新代币！供应量为 0，可能即将开始铸造`);
          }
          
          // 检查权限配置
          if (!currentMintAuth) {
            console.log(`🔒 固定供应量代币（无铸币权限）`);
          }
          
          if (!currentFreezeAuth) {
            console.log(`🔓 不可冻结代币（无冻结权限）`);
          }
        }
        
        // 更新缓存
        mintStateCache.set(mintPubkey, {
          supply: currentSupply,
          mintAuthority: currentMintAuth,
          freezeAuthority: currentFreezeAuth
        });
        
        console.log("---");
        
      } catch (error) {
        console.error(`❌ 解析 Mint 账户 ${mintPubkey} 失败:`, 
          error instanceof Error ? error.message : String(error));
      }
    }
  },
  "confirmed",
  [
    {
      dataSize: MintLayout.span, // 只监听 82 字节的 Mint 账户
    },
  ]
);

console.log("🚀 开始监听所有 Mint 账户变化...");
console.log("🎯 监听内容:");
console.log("   📊 代币供应量变化（铸造/销毁）");
console.log("   🔑 铸币权限转移");
console.log("   ❄️  冻结权限变化");
console.log("   🆕 新代币创建");
console.log(`🔗 订阅ID: ${subscriptionId}`);
console.log(`📏 Mint 账户大小: ${MintLayout.span} 字节`);
console.log("💡 按 Ctrl+C 退出监听\n");

// 定期清理缓存（避免内存泄露）
setInterval(() => {
  const cacheSize = mintStateCache.size;
  if (cacheSize > 10000) { // 如果缓存超过1万个，清理一半
    const entries = Array.from(mintStateCache.entries());
    mintStateCache.clear();
    // 保留最近的一半
    for (let i = Math.floor(entries.length / 2); i < entries.length; i++) {
      mintStateCache.set(entries[i][0], entries[i][1]);
    }
    console.log(`🧹 缓存清理完成，从 ${cacheSize} 减少到 ${mintStateCache.size}`);
  }
}, 300000); // 每5分钟检查一次

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭 Mint 监听器...');
  connection.removeProgramAccountChangeListener(subscriptionId);
  console.log(`📊 监听期间发现了 ${mintStateCache.size} 个 Mint 账户`);
  console.log('✅ 监听器已关闭');
  process.exit(0);
}); 