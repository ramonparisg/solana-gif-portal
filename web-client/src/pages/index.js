import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "../app/infrastructure/config/idl_solana_program.json";
import kp from "../app/infrastructure/config/keypair.json";

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  return new Provider(connection, window.solana, opts.preflightCommitment);
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifs, setGifs] = useState([]);
  const [inputText, setInputText] = useState("");

  const connectWallet = async () => {
    const { solana } = window;
    if (solana?.isPhantom) {
      console.log("Yeeesh you have phantom!");
      const walletConnection = await solana.connect();
      setWalletAddress(walletConnection.publicKey.toString());
    } else {
      console.log("Get phantom, folk!");
    }
  };

  const isWalletConnected = async () => {
    const { solana } = window;
    if (solana?.isPhantom) {
      const walletConnection = await solana.connect({ onlyIfTrusted: true });
      const publicKey = walletConnection.publicKey.toString();
      setWalletAddress(publicKey);
    } else {
      console.log("Get phantom, folk!");
    }
  };

  useEffect(() => {
    isWalletConnected().then(() => {
      if (walletAddress) {
        return getGifList();
      }
    });
  }, [walletAddress]);

  const sendGif = async () => {
    if (inputText?.length > 0) {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addGif(inputText, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputText);

      await getGifList();
    } else {
      console.log("No gif there!");
    }
  };

  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setGifs(account?.gifList?.map((gif) => gif.gifLink));
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifs(null);
    }
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  return (
    <div className={styles.App}>
      <div
        className={walletAddress ? styles.authedContainer : styles.container}
      >
        <div>
          <p className={styles.header}>🖼 The office GIF Portal</p>
          <p className={styles.subText}>
            Excuse me. Could you please gift me the best FUCKING GIF THAT YOU
            HAVE EVER SEEN OF THE OFFICE? 👀
          </p>
          {!walletAddress && (
            <button
              className={`${styles.connectWalletButton} ${styles.ctaButton}`}
              onClick={connectWallet}
            >
              Connect wallet
            </button>
          )}

          {walletAddress && (
            <div className={styles.connectedContainer}>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  await sendGif();
                }}
              >
                <input
                  type="text"
                  value={inputText}
                  placeholder="Enter gif link!"
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className={`${styles.ctaButton} ${styles.submitGifButton}`}
                >
                  Submit
                </button>
              </form>
              <div className={styles.gifGrid}>
                {gifs?.map((gif, i) => (
                  <div className={styles.gifItem} key={i}>
                    <img src={gif} alt={gif} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.footerContainer}>
          <p className={styles.footerText}>Built with 🫀</p>
        </div>
      </div>
    </div>
  );
};

export default App;
