import { Connection, clusterApiUrl, VersionedBlockResponse } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

(async () => {
  // 读取区块
  // 获取最新 slot
  const slot = await connection.getSlot();

  // 获取对应区块
  const block = await connection.getBlock(slot, {
    maxSupportedTransactionVersion: 0,
  });

  if (!block || block.transactions.length === 0) {
    console.log("该区块为空");
  } else {
    console.log(`区块 Slot: ${slot}`);
    console.log(JSON.stringify(block, null, 1));
  }
})();
