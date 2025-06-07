"use client";
import React, { useState } from 'react';
import styles from '../../styles/Program.module.css';
import Navbar from '../../components/Navbar';

const dersIcerikleri: Record<number, string[]> = {
  4: [
    "Sayı doğrusu - Sayı Sınıflandırılması",
    "Negatif Sayılar ile İşlemler",
    "Parantez İşareti",
    "İşlem Önceliği",
    "Kesirli Sayılar - Oran",
    "Eş Oranlar - Aynı Kesirli Sayılar",
    "Kesirli Sayılar ile İşlemler"
  ],
  5: [
    "Sayı doğrusu - Negatif Sayılar",
    "Parantez İşareti ve İşlem Önceliği",
    "Kesirli Sayılar ve Sınıflandırılması",
    "Oran - Eş Oranlar",
      "Kesirli Sayılarla İşlemler",
      "Bilinemyen Sayılarla İşlemler",
      "Denklem Çözmek - (Bilinmeyeni Bulmak"
  ],
  6: [
    "Sayı doğrusu - Negatif Sayılar",
    "Parantez İşareti ve İşlem Önceliği",
    "Kesirli Sayılar - Oran - Eş Oranlar",
    "Kesirli Sayılarla İşlemler",
    "Bilinmeyen Sayılarla İşlemler",
    "Denklem Çözmek - (Bilinmeyeni Bulmak)",
    "Bilinmeyen Sayıların Oranı"
  ],
  7: [
    "Sayı doğrusu - Negatif Sayılar",
    "Parantez İşareti ve İşlem Önceliği",
    "Kesirli Sayılar - Oran - Eş Oranlar,işlemler",
    "Bilinmeyen Sayılarla İşlemler",
    "Denklem Çözmek - (Bilinmeyeni Bulmak)",
    "Bilinmeyen Sayıların Oranı",
    "Üslü Sayılar ile İşlemler, Denklem Çözme"
  ]
};

const SinifProgrami: React.FC = () => {
  const [seciliSinif, setSeciliSinif] = useState<number>(4);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>2025-2026 Yaz Dönemi</h1>
          <p className={styles.subtitle}>Hangi sınıfa geçiyorsan, sana özel içerik burada!</p>
        </div>

        <div className={styles.programSection}>
          <div className={styles.programCard}>
            <h2>Sınıf Seçimi</h2>
            <div className={styles.sinifKutulari}>
              {[4, 5, 6, 7].map((sinif: number) => (
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
                {dersIcerikleri[seciliSinif].map((icerik: string, idx: number) => (
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