import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";


async function main() {
const connection = new Connection(clusterApiUrl("devnet"));

// recover the wallet from the file
const savedKey58 = fs.readFileSync("generated_wallet001.txt", "utf-8");
const recoveredSecretKey = bs58.decode(savedKey58);
const recoveredWallet = Keypair.fromSecretKey(recoveredSecretKey);
console.log("Recovered Public Key:", recoveredWallet.publicKey.toBase58());

// check the balance of the wallet
    const balance = await connection.getBalance(recoveredWallet.publicKey);
    // turn the number to string with 9 decimal places
    const balanceString = (balance / LAMPORTS_PER_SOL).toFixed(9);
    console.log("SOL Balance:", balanceString);
}

main();
