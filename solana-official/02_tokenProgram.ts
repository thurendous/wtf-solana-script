// Token Program 是 Solana 上的一个可执行程序账户。与钱包账户类似，程序账户具有相同的基础 账户 数据结构，但其字段存在关键差异：
// 字段	描述
// executable	设置为 true，表示该账户包含可执行的程序代码。
// data	对于程序账户，此字段存储程序的可执行代码。相比之下，钱包账户的数据字段为空。
// owner	该账户由 Loader 程序拥有，Loader 程序是 Solana 上拥有可执行程序账户的一类内置程序。（BPFLoader2111111111111111111111111111111111）

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

async function main() {

const connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);
const address = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const accountInfo = await connection.getAccountInfo(address);

console.log(
  JSON.stringify(
    accountInfo,
    (key, value) => {
      if (key === "data" && value && value.length > 1) {
        return [
          value[0],
          "...truncated, total bytes: " + value.length + "...",
          value[value.length - 1]
        ];
      }
      return value;
    },
    2
  )
);
}

main();