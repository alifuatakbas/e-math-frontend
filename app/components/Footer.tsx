// components/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import { FiMail, FiPhone, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>E-MATH</h3>
          <p>Matematik öğrenmeyi kolaylaştırıyoruz.</p>
          <div className={styles.socialLinks}>
            <a href="mailto:contact@emath.com" aria-label="Email">
              <FiMail />
            </a>
            <a href="tel:+901234567890" aria-label="Phone">
              <FiPhone />
            </a>
            <a href="https://instagram.com/emath" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="https://youtube.com/emath" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FiYoutube />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><Link href="/">Ana Sayfa</Link></li>
            <li><Link href="/sinav-coz">Sınav Çöz</Link></li>
            <li><Link href="/sinav-sonuclari">Sınav Sonuçları</Link></li>
            <li><Link href="/hakkimizda">Hakkımızda</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Sınıflar</h4>
          <ul>
            <li><Link href="/sinif/5">5. Sınıf</Link></li>
            <li><Link href="/sinif/6">6. Sınıf</Link></li>
            <li><Link href="/sinif/7">7. Sınıf</Link></li>
            <li><Link href="/sinif/8">8. Sınıf</Link></li>
            <li><Link href="/sinif/9">9. Sınıf</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>İletişim</h4>
          <ul>
            <li><Link href="/basvuru">Başvuru Yap</Link></li>
            <li><Link href="/iletisim">İletişim</Link></li>
            <li><Link href="/sss">Sık Sorulan Sorular</Link></li>
            <li><Link href="/gizlilik">Gizlilik Politikası</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} E-MATH. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;