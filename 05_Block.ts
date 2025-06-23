// slot is the unit of time in Solana
// Block is the generated block data in Solana
// every slot has one block only.
// not all slots have a block, some slots are empty. 6% of blocks are empty.
// Solana 中的 Slot 编号（slot number）、Block 编号（block number）、和 Block 高度（block height）容易混淆。我们以上图为例，解释他们的区别：
// Slot Number	1	2	3	4	5
// Block Number	1	2		4	5
// Block Height	1	2		3	4
// - Slot Number：每 400ms 自增，无论是否产块；
// - Block Number：与 Slot 一一对应，但空块位置为空；
// - Block Height：只计算成功产出的区块，高度连续递增。

// 以太坊和Solana的区块机制有很大不同：

// 以太坊每12秒一个块，并且区块总是被产出。而Solana每400ms一个Slot，每个 Slot 有 0 或 1 个区块 。

// 在 Solana 中，Slot 编号（slot number）、Block 编号（block number）、和 Block 高度（block height）是三个不同的概念，它们在区块链的结构和时间维度上有所区别：

// block都有一个blockhash，每一个block都得引用一个最近的blockhash。最近的blockhash指的是，150个slot之中的某个区块的哈希值。也就是说60秒以内的某一个slot的哈希值。
// 以太坊的世界是使用的nonce来防止的重放攻击的。而solana没有采用这个机制。nonce机制的话，如果有多个tx都有一个nonce，那么只有一个能够上链。别的tx都会失败。
// 而solana就没有采用这个机制。为了实现高并发性和低延迟，solana才用了基于blockhash的交易唯一性的机制。
// 每个交易都得有一个blockhash

// 每个交易都要包涵一个 blockhash:
// ```
// const tx = new Transaction({
//   blockhash, // 这是 recent blockhash
//   feePayer,
// }).add(instruction);
// ```
// 如果交易使用的 blockhash 超过150个区块，过期了，那么交易会失败。
// 如果两个交易内容相同，并且用了同样的 blockhash，那么其中只有一笔交易会上链，这样就可以防止重放攻击。


import {
    Connection, 
    clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function main() {
    const slot = await connection.getSlot();
    console.log("Current slot:", slot);

    const latestBlockhash = await connection.getLatestBlockhash();
    console.log("Latest blockhash:", latestBlockhash.blockhash);
    console.log("Last valid block height (current height + 150):", latestBlockhash.lastValidBlockHeight);

    // 3. 获取该 Slot 的 Block
    const block = await connection.getBlock(slot, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
        rewards: false,
        transactionDetails: "full"
    });

    // console.log("Block:", JSON.stringify(block, null, 2));
    console.log("Block:", block);

    const blockhash = block?.blockhash;
    console.log("Blockhash:", blockhash);

    const blockTime = block?.blockTime;
    console.log("Block time:", blockTime);
    // turn this block time into JCT time
    if (blockTime) {
        const jctTime = new Date(blockTime * 1000).toLocaleString();
        console.log("JCT time:", jctTime);
    }
}

main();


