import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const TARGET_WALLET_ADDRESS = process.env.TARGET_WALLET_ADDRESS;

async function main() {
  if (!TARGET_WALLET_ADDRESS) {
    throw new Error("TARGET_WALLET_ADDRESS is not set");
  }

  // 1. 加载发送者钱包
  const secretKeyBase58 = fs.readFileSync("generated_wallet_001.txt", "utf-8");
  const sender = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
  const receiver = new PublicKey(TARGET_WALLET_ADDRESS);
  
  console.log("🚀 开始测试过期 blockhash");
  console.log("Sender:", sender.publicKey.toBase58());
  console.log("Receiver:", receiver.toBase58());

  // 2. 获取当前的 blockhash 和 slot
  const currentSlot = await connection.getSlot();
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  
  console.log("\n📊 当前状态:");
  console.log("Current slot:", currentSlot);
  console.log("Blockhash:", blockhash);
  console.log("Last valid block height:", lastValidBlockHeight);
  console.log("当前高度与最后有效高度差:", lastValidBlockHeight - await connection.getBlockHeight());

  // 3. 构建交易（使用当前的 blockhash）
  const amount = LAMPORTS_PER_SOL * 0.0001; // 0.0001 SOL
  
  const tx = new Transaction({
    blockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
    feePayer: sender.publicKey,
  });

  tx.add(SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: amount,
  }));

  // 4. 签名交易（但不发送）
  tx.sign(sender);
  
  console.log("\n⏱️  等待 150 个 slot（约 60 秒）让 blockhash 过期...");
  
  // 5. 等待 150 个 slot = 150 * 400ms = 60 秒
  const waitTime = 150 * 400; // 60 秒
  let countdown = waitTime / 1000;
  
  const countdownInterval = setInterval(() => {
    process.stdout.write(`\r还剩 ${countdown} 秒...`);
    countdown--;
    
    if (countdown < 0) {
      clearInterval(countdownInterval);
      console.log("\n");
    }
  }, 1000);
  
  await new Promise(resolve => setTimeout(resolve, waitTime));

  // 6. 检查当前状态
  const newSlot = await connection.getSlot();
  const newBlockHeight = await connection.getBlockHeight();
  
  console.log("\n📊 等待后状态:");
  console.log("New slot:", newSlot);
  console.log("Slot difference:", newSlot - currentSlot);
  console.log("New block height:", newBlockHeight);
  console.log("是否超过最后有效高度:", newBlockHeight > lastValidBlockHeight);

  // 7. 尝试发送过期的交易
  console.log("\n🧪 尝试发送使用过期 blockhash 的交易...");
  
  try {
    console.log("📤 正在发送交易到网络...");
    const signature = await connection.sendRawTransaction(tx.serialize());
    
    console.log("📨 交易已发送到网络！Signature:", signature);
    console.log("⚠️  注意：发送成功不等于执行成功，需要等待确认...");
    
    // 尝试确认交易
    console.log("🕐 等待交易确认...");
    try {
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });
      
      if (confirmation.value.err) {
        console.log("✅ 交易执行失败（预期行为）:", confirmation.value.err);
        console.log("🎯 原因：blockhash 已过期，交易被网络拒绝执行");
      } else {
        console.log("❌ 交易确认成功（不应该发生）:", confirmation);
      }
    } catch (confirmError) {
      const err = confirmError as Error;
      console.log("✅ 交易确认失败（预期行为）:", err.message);
      console.log("🎯 原因：blockhash 过期导致确认超时或失败");
    }
    
  } catch (error) {
    const err = error as Error;
    console.log("✅ 交易在发送阶段就被拒绝（另一种预期行为）:");
    console.log("Error type:", err.constructor.name);
    console.log("Error message:", err.message);
    
    // 检查是否是 blockhash 过期错误
    if (err.message.includes("blockhash") || err.message.includes("expired") || 
        err.message.includes("Invalid") || err.message.includes("height")) {
      console.log("🎯 确认：这是 blockhash 过期导致的发送失败！");
    }
  }

  // 8. 对比：使用新的 blockhash 发送成功的交易
  console.log("\n🔄 使用新的 blockhash 重新发送交易...");
  
  const { blockhash: newBlockhash, lastValidBlockHeight: newLastValidBlockHeight } = 
    await connection.getLatestBlockhash();
  
  const newTx = new Transaction({
    blockhash: newBlockhash,
    lastValidBlockHeight: newLastValidBlockHeight,
    feePayer: sender.publicKey,
  });

  newTx.add(SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: amount,
  }));

  newTx.sign(sender);

  try {
    const signature = await connection.sendRawTransaction(newTx.serialize());
    console.log("✅ 使用新 blockhash 交易成功:", signature);
    
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: newBlockhash,
      lastValidBlockHeight: newLastValidBlockHeight
    });
    
    if (confirmation.value.err === null) {
      console.log("✅ 交易确认成功！");
    }
  } catch (error) {
    const err = error as Error;
    console.log("❌ 新交易也失败了:", err.message);
  }
}

main().catch(console.error); 