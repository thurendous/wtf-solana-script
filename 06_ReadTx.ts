import {
  Connection,
  clusterApiUrl,
  VersionedBlockResponse,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// 替换为你想查询的交易哈希
const txSig =
  "2V9ZcE2K6F9iddTzQ53eEe1gXqTzuXNviJ5BkmyTAafiayFKgqzS5zrFQj9Z8iwJRWzqjekPVmv97XTV72GqWRRJ";

(async () => {
  // 读取单笔交易
  const tx = await connection.getTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(JSON.stringify(tx, null, 2));

  // 读取单笔交易详情（交易指令解析）
  const parsedTx = await connection.getParsedTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(
    JSON.stringify(parsedTx?.transaction?.message?.instructions, null, 2)
  );
})();
