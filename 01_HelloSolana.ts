// This is a simple script to check the balance of a Solana wallet

import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
// 输出API URL
console.log(`API URL: ${clusterApiUrl("mainnet-beta")}`);

// 输出LAMPORTS_PER_SOL
// 1 SOL = 10^9 LAMPORTS
console.log(`LAMPORTS PER SOL: ${LAMPORTS_PER_SOL}`);

const main = async () => {
    const publicKey = new PublicKey("8BseXT9EtoEhBTKFFYkwTnjKSUZwhtmdKY2Jrj8j45Rt");
    const balance = await connection.getBalance(publicKey);
    // 输出SOL余额
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`); // it is like ETH on EVM
    console.log(`SOL Balance: ${balance } LAMPORTS`); // it is like wei on EVM
}

main();
