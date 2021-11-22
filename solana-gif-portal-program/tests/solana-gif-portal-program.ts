import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaGifPortalProgram } from '../target/types/solana_gif_portal_program';

describe('solana-gif-portal-program', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.SolanaGifPortalProgram as Program<SolanaGifPortalProgram>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
