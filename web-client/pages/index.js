import styles from '../styles/Home.module.css';


const App = () => {
  return (
      <div className={styles.App}>
        <div className={styles.container}>
          <div>
            <p className={styles.header}>🖼 GIF Portal</p>
            <p className={styles.subText}>
              View your GIF collection in the metaverse ✨
            </p>
          </div>
          <div className={styles.footerContainer}>
              <p className={styles.footerText}>Built with 🫀</p>
          </div>
        </div>
      </div>
  );
};

export default App;
