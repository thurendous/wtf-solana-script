import { Keypair, Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from "@solana/web3.js";

async function main() {
    try {
        // Generate a new keypair
        // const keypair = Keypair.generate();
        // console.log(`Public Key: ${keypair.publicKey.toString()}`);

        // Connect to local Solana node
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Request airdrop
        // console.log("Requesting airdrop...");
        // const signature = await connection.requestAirdrop(
        //     keypair.publicKey,
        //     LAMPORTS_PER_SOL
        // );

        // Wait for confirmation
        // console.log("Waiting for confirmation...");
        // await connection.confirmTransaction(signature, "confirmed");

        // Get account info
        const somePublicKey = new PublicKey("8BseXT9EtoEhBTKFFYkwTnjKSUZwhtmdKY2Jrj8j45Rt");
        const accountInfo = await connection.getAccountInfo(somePublicKey);
        console.log("Account Info:", JSON.stringify(accountInfo, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the main function
main().then(
    () => process.exit(0),
    (error) => {
        console.error(error);
        process.exit(1);
    }
);

