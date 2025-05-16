"use client";
import React from 'react';
import styles from '../styles/Program.module.css';

const SummerProgram2025 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>2025 Yaz Dönemi Eğitim Programı</h1>
        <p className={styles.subtitle}>Geleceğinizi Şekillendirin</p>
      </div>

      <div className={styles.programSection}>
        <div className={styles.programCard}>
          <h2>Haziran Programı</h2>
          <div className={styles.timeline}>
            <div className={styles.event}>
              <div className={styles.date}>1-15 Haziran</div>
              <div className={styles.content}>
                <h3>Matematik Kampı</h3>
                <p>• Temel matematik kavramları</p>
                <p>• Problem çözme teknikleri</p>
                <p>• Olimpiyat soruları çözümleri</p>
              </div>
            </div>
            <div className={styles.event}>
              <div className={styles.date}>16-30 Haziran</div>
              <div className={styles.content}>
                <h3>Fen Bilimleri Atölyesi</h3>
                <p>• Fizik deneyleri</p>
                <p>• Kimya laboratuvarı</p>
                <p>• Biyoloji projeleri</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.programCard}>
          <h2>Temmuz Programı</h2>
          <div className={styles.timeline}>
            <div className={styles.event}>
              <div className={styles.date}>1-15 Temmuz</div>
              <div className={styles.content}>
                <h3>Robotik ve Kodlama</h3>
                <p>• Temel programlama</p>
                <p>• Arduino projeleri</p>
                <p>• Yapay zeka giriş</p>
              </div>
            </div>
            <div className={styles.event}>
              <div className={styles.date}>16-31 Temmuz</div>
              <div className={styles.content}>
                <h3>Akıl Oyunları</h3>
                <p>• Strateji oyunları</p>
                <p>• Mantık bulmacaları</p>
                <p>• Zeka geliştirme aktiviteleri</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.programCard}>
          <h2>Ağustos Programı</h2>
          <div className={styles.timeline}>
            <div className={styles.event}>
              <div className={styles.date}>1-15 Ağustos</div>
              <div className={styles.content}>
                <h3>İngilizce Dil Kampı</h3>
                <p>• Konuşma pratiği</p>
                <p>• Gramer dersleri</p>
                <p>• Kültürel aktiviteler</p>
              </div>
            </div>
            <div className={styles.event}>
              <div className={styles.date}>16-31 Ağustos</div>
              <div className={styles.content}>
                <h3>Yaz Okulu Finali</h3>
                <p>• Proje sunumları</p>
                <p>• Sertifika töreni</p>
                <p>• Kapanış etkinlikleri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h2>Program Detayları</h2>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <h3>Eğitim Saatleri</h3>
            <p>Hafta içi: 09:00 - 16:00</p>
            <p>Hafta sonu: 10:00 - 15:00</p>
          </div>
          <div className={styles.detailItem}>
            <h3>Yaş Grupları</h3>
            <p>7-12 yaş</p>
            <p>13-17 yaş</p>
          </div>
          <div className={styles.detailItem}>
            <h3>Ücretlendirme</h3>
            <p>Aylık program: 2500 TL</p>
            <p>Tam yaz programı: 6500 TL</p>
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h2>Hemen Kayıt Olun</h2>
        <p>Erken kayıt avantajlarından yararlanmak için hemen başvurun!</p>
        <button className={styles.ctaButton}>Başvuru Yap</button>
      </div>
    </div>
  );
};

export default SummerProgram2025;