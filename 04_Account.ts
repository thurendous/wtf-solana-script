// solana中，一切都是账户
// 你可以将solana看成一个公共的数据库，其中包含一个账户表，表中的每一个条目都是一个“账户”
// Solana上的每个账户都有一个唯一的32字节的地址，通常显示为base58编码的字符串
// e.g. 6fuivRGE5Fr9bwkW2Wu1E2wTMQ8RnoNgtZb8tievLVmb
// 账户和其地址之间类似是一个键值对
// 每个账户都应该有以下的字段：
// 1. lamports：账户余额，1 SOL = 10^9 lamports
// 2. owner：账户所有者的程序ID
// 3. data：账户数据区
// 4. executable：是否为可执行账户
// 5. rentEpoch：租金相关字段，已废弃

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { clusterApiUrl } from "@solana/web3.js";

import { Connection } from "@solana/web3.js";

async function main() {
  // 连接主网
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 获取账户信息
  const pubkey = new PublicKey("A96uYqwSzntaGzpyGHQSqX6xUi3wqGm7CvQ9Rwu2Junv");
  const accountInfo = await connection.getAccountInfo(pubkey);
  console.log(JSON.stringify(accountInfo, null, 2));
  // print the balance of the account
  if (accountInfo?.lamports) {
    console.log(`Balance: ${accountInfo.lamports / LAMPORTS_PER_SOL} SOL`);

    // print the owner of the account
    console.log(`Owner: ${accountInfo.owner.toBase58()}`);

    // print the executable of the account
    console.log(`Executable: ${accountInfo.executable}`);

    // print the rentEpoch of the account
    console.log(`RentEpoch: ${accountInfo.rentEpoch}`);

    // print the data of the account
    console.log(`Data: ${accountInfo.data ? accountInfo.data.length : 0} bytes`);
  } else {
    console.log("Account not found");
  }
}

main();
