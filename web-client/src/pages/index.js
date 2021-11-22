import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

const TEST_GIFS = [
  "https://media.giphy.com/media/ynRrAHj5SWAu8RA002/giphy.gif",
  "https://media.giphy.com/media/SZQBPO4NqHkh6wmdXk/giphy.gif",
  "https://media.giphy.com/media/UVah1k9VydwNC4RdOT/giphy.gif",
  "https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifs, setGifs] = useState([]);
  const [inputText, setInputText] = useState(null);

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
      console.log("Yeeesh you have phantom!");
      const walletConnection = await solana.connect({ onlyIfTrusted: true });
      const publicKey = walletConnection.publicKey.toString();
      setWalletAddress(publicKey);
      console.log("Public key: ", publicKey);
    } else {
      console.log("Get phantom, folk!");
    }
  };

  useEffect(() => {
    isWalletConnected().then(() => setGifs(TEST_GIFS));
  }, [walletAddress]);

  function sendGif() {
    if (inputText?.length > 0) {
      setGifs([inputText, ...gifs]);
    } else {
      console.log("No gif there!");
    }
  }

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
                onSubmit={(event) => {
                  event.preventDefault();
                  sendGif();
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
                {gifs.map((gif) => (
                  <div className={styles.gifItem} key={gif}>
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
