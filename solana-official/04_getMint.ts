import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

async function main() {
  const connection = new Connection(
    clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  const address = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const mintData = await getMint(connection, address, "confirmed");

  console.log(
    JSON.stringify(
      mintData,
      (key, value) => {
        // Convert BigInt to String
        if (typeof value === "bigint") {
          return value.toString();
        }
        // Handle Buffer objects
        if (Buffer.isBuffer(value)) {
          return `<Buffer ${value.toString("hex")}>`;
        }
        return value;
      },
      2
    )
  );
}

main();
