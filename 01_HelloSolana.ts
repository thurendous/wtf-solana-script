// This is a simple script to check the balance of a Solana wallet

import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import bs58 from "bs58";

dotenv.config();

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// 输出API URL
console.log(`API URL: ${clusterApiUrl("devnet")}`);

// get the public key from .env file using private key
const privateKey = process.env.GENERATED_WALLET_001_PK;
if (!privateKey) {
    throw new Error("GENERATED_WALLET_001_PK is not set");
}
// turn this private key to public key
const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
console.log(`Public Key: ${keypair.publicKey.toString()}`);


// 输出LAMPORTS_PER_SOL
// 1 SOL = 10^9 LAMPORTS
console.log(`LAMPORTS PER SOL: ${LAMPORTS_PER_SOL}`);

const main = async () => {
    const balance = await connection.getBalance(keypair.publicKey);
    // 输出SOL余额
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`); // it is like ETH on EVM
    console.log(`SOL Balance: ${balance } LAMPORTS`); // it is like wei on EVM
}

main();
