"use client";
import React from 'react';
import styles from '../styles/Program.module.css';
import Navbar from '../../components/Navbar';

const SummerProgram2025 = () => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.underConstruction}>
          <div className={styles.constructionIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1>Sayfa Güncelleniyor</h1>
          <p>2025 Yaz Dönemi programı yakında yayında olacaktır.</p>
          <p className={styles.subText}>Lütfen daha sonra tekrar kontrol ediniz.</p>
        </div>
      </div>
    </>
  );
};

export default SummerProgram2025;