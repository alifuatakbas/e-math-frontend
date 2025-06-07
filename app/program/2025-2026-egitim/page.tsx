"use client";
import React from 'react';
import styles from '../../styles/Program.module.css';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const SummerProgram2025 = () => {
  const router = useRouter();

  const handleApply = () => {
    router.push('/basvuru');
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>2025-2026 Eğitim Dönemi</h1>
          <p className={styles.subtitle}>Geleceğinizi Şekillendirin</p>
        </div>

        <div className={styles.programSection}>
          <div className={styles.programCard}>
            <h2>Hedef Kitle</h2>
            <div className={styles.content}>
              <p>Önümüzdeki yıl 4, 5, 6 veya 7.sınıf&apos;a geçecek matematik alanında yetenekli ve ilgili olan olan
                öğrencileri hızlı bir şekilde hedeflerine ulaştırıyoruz.</p>
            </div>
          </div>

          <div className={styles.programCard}>
            <h2>Ders İçeriği</h2>
            <div className={styles.content}>
              <p>Hedef 7 ayda 6 yıllık matematik müfredatı.</p>
              <p>Zeki öğrencilerin katıldığı diğer programların eksiklerini gidermek için hazırlanmış bir proje.</p>
            </div>
          </div>

          <div className={styles.programCard}>
            <h2>Ders Programı</h2>
            <div className={styles.content}>
              <p>Öğrencilerin müsait zamanları göz önünde bulundurularak;</p>
              <ul>
                <li>Haftada 3 günü online ders</li>
                <li>Pazar günü online mini sınav</li>
                <li>Pazar akşamı sınav çözümü</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <button className={styles.ctaButton} onClick={handleApply}>Başvuru Yap</button>
          <div className={styles.contactInfo}>
            <div className={styles.contactIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className={styles.contactText}>
              <h3>Detaylı bilgi için:</h3>
              <p>+90 501 087 12 13</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummerProgram2025;