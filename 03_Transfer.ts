// This is a simple script to transfer SOL from one wallet to another

import { Cluster, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

const NETWORK = process.env.NETWORK as Cluster;
const GENERATED_WALLET_001_PK = process.env.GENERATED_WALLET_001_PK as string;

const connection = new Connection(clusterApiUrl(NETWORK));

const sentToAddress = "4xMFjGAGcXetiB3tfzmy3p4kBW2AoYGgG5AVcEpZpMiC";
// const privateKey = fs.readFileSync("generated_wallet001.txt", "utf-8");

const wallet = Keypair.fromSecretKey(bs58.decode(GENERATED_WALLET_001_PK));

// get the public address of the wallet
const publicAddress = wallet.publicKey.toBase58();
console.log("Public Address:", publicAddress);

const main = async () => {
    const balance = await connection.getBalance(wallet.publicKey);
    console.log("SOL Balance:", balance / LAMPORTS_PER_SOL);

    // transfer 0.000000001 SOL from my wallet to the public key
    // 2. 构建转账指令（0.001 SOL）
   const instruction = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: new PublicKey(sentToAddress),
    lamports: 0.001 * LAMPORTS_PER_SOL,
    });

    // 3. 创建交易
   const transaction = new Transaction().add(instruction);

   // Set fee payer and recent blockhash
   transaction.feePayer = wallet.publicKey;
   transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

   // 4. 模拟交易
   const simulateResult = await connection.simulateTransaction(transaction);
   console.log("模拟交易结果: ", simulateResult);

    // 5. 发送交易
   console.log("正在发送交易...");
   const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);

   console.log("交易成功！交易哈希:", signature);
   console.log(`查看交易: https://solscan.io/tx/${signature}?cluster=${NETWORK}`);

    // // 3. 创建交易
    // const transaction = new Transaction().add(instruction);
    // // 4. 模拟交易
    // const simulateResult = await connection.simulateTransaction(transaction, [sender]);
    // console.log("模拟交易结果: ", simulateResult);
    // // 5. 发送交易
    // console.log("正在发送交易...");
    // const signature = await sendAndConfirmTransaction(connection, transaction, [sender]); 
    // console.log("交易成功！交易哈希:", signature);
    // console.log(`查看交易：https://solscan.io/tx/${signature}?cluster=mainnet-beta`);
}

main();
