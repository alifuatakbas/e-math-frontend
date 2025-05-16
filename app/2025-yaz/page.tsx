"use client";
import React from 'react';
import styles from '../styles/Program.module.css';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

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
          <h1>2025 Yaz Dönemi Eğitim Programı</h1>
          <p className={styles.subtitle}>Geleceğinizi Şekillendirin</p>
        </div>

        <div className={styles.programSection}>
          <div className={styles.programCard}>
            <h2>Hedef Kitle</h2>
            <div className={styles.content}>
              <p>Önümüzdeki yıl 4, 5, 6 veya 7.sınıf&apos;a geçecek matematik alanında yetenekli ve ilgili olan olan öğrencileri hızlı bir şekilde hedeflerine ulaştırıyoruz.</p>
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
          <h2>İletişim için: +90 501 087 12 13</h2>
          <button className={styles.ctaButton} onClick={handleApply}>Başvuru Yap</button>
        </div>
      </div>
    </>
  );
};

export default SummerProgram2025;