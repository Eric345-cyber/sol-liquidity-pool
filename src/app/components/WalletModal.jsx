"use client";

import styles from './WalletModal.module.css';

const WalletModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Select Wallet</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.walletOptions}>
          <button 
            className={styles.walletOption}
            onClick={() => onSelect('phantom')}
          >
            <div className={styles.walletIcon}>
              <img src="/phantom-logo.svg" alt="Phantom" />
            </div>
            <div className={styles.walletInfo}>
              <span className={styles.walletName}>Phantom Wallet</span>
              <span className={styles.walletDescription}>Solana & Ethereum</span>
            </div>
          </button>
          
          <button 
            className={styles.walletOption}
            onClick={() => onSelect('metamask')}
          >
            <div className={styles.walletIcon}>
              <img src="/metamask-logo.svg" alt="MetaMask" />
            </div>
            <div className={styles.walletInfo}>
              <span className={styles.walletName}>MetaMask</span>
              <span className={styles.walletDescription}>Ethereum & EVM chains</span>
            </div>
          </button>
          
          <button 
            className={styles.walletOption}
            onClick={() => onSelect('walletconnect')}
            disabled
          >
            <div className={styles.walletIcon}>
              <img src="/walletconnect-logo.svg" alt="WalletConnect" />
            </div>
            <div className={styles.walletInfo}>
              <span className={styles.walletName}>WalletConnect</span>
              <span className={styles.walletDescription}>Multi-chain</span>
            </div>
            <span className={styles.comingSoon}>Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
