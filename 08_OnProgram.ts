import { AccountLayout, TOKEN_PROGRAM_ID, MintLayout } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const subscriptionId1 = connection.onProgramAccountChange(
    TOKEN_PROGRAM_ID,
    (keyedAccountInfo) => {
      const accountPubkey = keyedAccountInfo.accountId.toBase58();
      const dataLength = keyedAccountInfo.accountInfo.data.length;
      
      console.log(`账户 ${accountPubkey} 更新！数据长度: ${dataLength} 字节`);
      
      try {
        // 标准 Token 账户是 165 字节
        if (dataLength === AccountLayout.span) {
          console.log("这是一个 Token 账户:");
          const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
          console.log(`  mint: ${accountInfo.mint.toBase58()}`);
          console.log(`  owner: ${accountInfo.owner.toBase58()}`);
          console.log(`  amount: ${accountInfo.amount}`);
          console.log(`  delegate: ${accountInfo.delegateOption ? accountInfo.delegate.toBase58() : 'None'}`);
          console.log(`  state: ${accountInfo.state}`);
        }
        // Mint 账户是 82 字节  
        else if (dataLength === MintLayout.span) {
          console.log("这是一个 Mint 账户:");
          const mintInfo = MintLayout.decode(keyedAccountInfo.accountInfo.data);
          console.log(`  supply: ${mintInfo.supply}`);
          console.log(`  decimals: ${mintInfo.decimals}`);
          console.log(`  mintAuthority: ${mintInfo.mintAuthorityOption ? mintInfo.mintAuthority.toBase58() : 'None'}`);
          console.log(`  freezeAuthority: ${mintInfo.freezeAuthorityOption ? mintInfo.freezeAuthority.toBase58() : 'None'}`);
        }
        else {
          console.log(`未知账户类型，数据长度: ${dataLength} 字节`);
          console.log(`前16字节数据: ${keyedAccountInfo.accountInfo.data.slice(0, 16).toString('hex')}`);
        }
      } catch (error) {
        console.error(`解析账户 ${accountPubkey} 时出错:`, error instanceof Error ? error.message : String(error));
        console.log(`数据长度: ${dataLength}, 前16字节: ${keyedAccountInfo.accountInfo.data.slice(0, 16).toString('hex')}`);
      }
      
      console.log("---");
    },
    "confirmed"
  );
  
  console.log("开始监听所有 TOKEN_PROGRAM_ID 相关账户变化...");
  console.log("订阅ID:", subscriptionId1);
  console.log("AccountLayout.span (Token账户大小):", AccountLayout.span);
  console.log("MintLayout.span (Mint账户大小):", MintLayout.span);
  
  // 添加优雅关闭
  process.on('SIGINT', () => {
    console.log('\n正在关闭监听...');
    connection.removeProgramAccountChangeListener(subscriptionId1);
    process.exit(0);
  });
  