// 1. 监听账户 例如余额变化

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// 要监听的账户地址（例如 pumpfun 费用地址）
const pubkey = new PublicKey("62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV");

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 注册订阅，感受一下什么叫躺着赚钱
const subscriptionId = connection.onAccountChange(pubkey, (updatedAccountInfo, context) => {
  console.log("账户发生变化！");
  console.log("最新账户信息:", updatedAccountInfo);
  console.log("上下文信息:", context);
  console.log("最新SOL余额:", updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
});

console.log("开始监听pumpfun账户变化...");
console.log("订阅ID:", subscriptionId);

