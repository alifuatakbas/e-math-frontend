"use client";
import React, { useState } from 'react';
import styles from '../../styles/Program.module.css';
import Navbar from '../../components/Navbar';

const dersIcerikleri = {
  4: [
    "Doğal sayılar ve işlemler",
    "Kesirler ve ondalık gösterimler",
    "Geometriye giriş",
    "Problem çözme teknikleri"
  ],
  5: [
    "Üslü ve köklü sayılar",
    "Oran-orantı ve yüzde hesapları",
    "Temel cebirsel ifadeler",
    "Geometrik şekiller ve alan-hacim hesapları"
  ],
  6: [
    "Denklemler ve eşitsizlikler",
    "Veri analizi ve olasılık",
    "Çokgenler ve çember",
    "Matematiksel modelleme"
  ],
  7: [
    "Cebirsel ifadeler ve polinomlar",
    "Fonksiyonlar ve grafikler",
    "Üçgenler ve dörtgenler",
    "Gerçek hayat problemleri"
  ]
};

const SinifProgrami = () => {
  const [seciliSinif, setSeciliSinif] = useState(4);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>2025-2026 Sınıf Programları</h1>
          <p className={styles.subtitle}>Hangi sınıfa geçiyorsan, sana özel içerik burada!</p>
        </div>

        <div className={styles.programSection}>
          <div className={styles.programCard}>
            <h2>Sınıf Seçimi</h2>
            <div className={styles.sinifKutulari}>
              {[4, 5, 6, 7].map((sinif) => (
                <button
                  key={sinif}
                  className={`${styles.sinifKutu} ${seciliSinif === sinif ? styles.secili : ''}`}
                  onClick={() => setSeciliSinif(sinif)}
                >
                  {sinif}. Sınıf
                </button>
              ))}
            </div>
          </div>

          <div className={styles.programCard}>
            <h2>{seciliSinif}. Sınıf Ders İçeriği</h2>
            <div className={styles.content}>
              <ul>
                {dersIcerikleri[seciliSinif].map((icerik, idx) => (
                  <li key={idx}>{icerik}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinifProgrami;