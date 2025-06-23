import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const TARGET_WALLET_ADDRESS = process.env.TARGET_WALLET_ADDRESS;

// 连接主网
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function main() {
  // 从本地导入发送者私钥（请确保保密）
  if (!TARGET_WALLET_ADDRESS) {
    throw new Error("TARGET_WALLET_ADDRESS is not set");
  }
  const secretKeyBase58 = fs.readFileSync("generated_wallet_001.txt", "utf-8");
  if (!secretKeyBase58) {
    throw new Error("secretKeyBase58 is not set");
  }
  const sender = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
  console.log("Sender:", sender.publicKey.toBase58());

  // 接收者地址（可以改为你的另一个钱包）
  const receiver = new PublicKey(process.env.TARGET_WALLET_ADDRESS as string);
  const amount = LAMPORTS_PER_SOL * 0.0001;
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  console.log("Recent blockhash:", blockhash);
  console.log(
    "Last valid block height (current height + 150):",
    lastValidBlockHeight
  );

  // 2. 构建转账指令（0.001 SOL）
  const instruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: amount,
  });

  const tx = new Transaction({
    blockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
    feePayer: sender.publicKey,
  });

  tx.add(instruction);

  // - 实际应用场景
  // 1. 使用 sendAndConfirmTransaction 当：
  // 简单的脚本或测试
  // 不需要复杂的用户交互
  // 希望确保交易完成后再继续
  // 2. 使用手动控制当：
  // 构建用户界面应用
  // 需要实时状态更新
  // 需要自定义超时和重试逻辑
  // 希望更好的用户体验

  // 3. 发送交易
  //   console.log("Sending transaction...");
  //   const signature = await sendAndConfirmTransaction(connection, tx, [sender]);
  //   console.log("Transaction sent and confirmed:", signature);

  // 4. 发送交易
  try {
  console.log("正在发送交易...");
  tx.sign(sender);

  const signature = await connection.sendRawTransaction(tx.serialize());
  console.log("Transaction sent:", signature);

  // 4. 验证交易是否成功
  console.log("Verifying transaction...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const txStatus = await connection.confirmTransaction({
    signature: signature,
    blockhash: blockhash,
      lastValidBlockHeight: lastValidBlockHeight,
    });

    if (txStatus.value.err) {
      console.error("Transaction failed:", txStatus.value.err);
    } else {
      console.log("Transaction successful:", txStatus);
    }
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

main();
