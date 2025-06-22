// This is a simple script to generate a new Solana wallet

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const main = async () => {
    // 生成一个新钥匙
    const wallet = Keypair.generate();

    // 输出公钥匙
    console.log(`Public Key: ${wallet.publicKey.toBase58()}`);
    // 获取私钥
    console.log(`private key: ${wallet.secretKey}`);
    // 输出私钥，使用bs58编码
    console.log(`Private Key: ${bs58.encode(wallet.secretKey)}`);

    const privateKey58 = bs58.encode(wallet.secretKey)
    fs.writeFileSync("generated_wallet.txt", privateKey58)
    console.log("Wallet saved to generated_wallet.txt")


    // recover the wallet from the file
    const savedKey58 = fs.readFileSync("generated_wallet.txt", "utf-8");
    const recoveredSecretKey = bs58.decode(savedKey58);
    const recoveredWallet = Keypair.fromSecretKey(recoveredSecretKey);

    console.log("Wallet recovered successfully!");
    console.log("Recovered Public Key:", recoveredWallet.publicKey.toBase58());
}

main();
