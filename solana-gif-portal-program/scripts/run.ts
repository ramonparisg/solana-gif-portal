import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaGifPortalProgram } from "../target/types/solana_gif_portal_program";

const main = async () => {
  console.log("🚀 Starting test...");

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace
    .SolanaGifPortalProgram as Program<SolanaGifPortalProgram>;
  let tx = await program.rpc.initialize({});
  console.log("📝 Your transaction signature", tx);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain().then(() => console.log("Done!"));
