// components/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Footer.module.css';
import { FiMail, FiPhone, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const router = useRouter();

  // Korumalı sayfalara erişim kontrolü
  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>E-MATH</h3>
          <p>Matematik öğrenmeyi kolaylaştırıyoruz.</p>
          <div className={styles.socialLinks}>
            <a href="huseyin.yildiz@eolimpiyat.com" aria-label="Email">
              <FiMail />
            </a>
            <a href="tel:+905010871213" aria-label="Phone">
              <FiPhone />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FiYoutube />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><Link href="/">Ana Sayfa</Link></li>
            <li>
              <a
                href="/sinav-coz"
                onClick={(e) => handleProtectedLink(e, '/sinav-coz')}
              >
                Sınav Çöz
              </a>
            </li>
            <li>
              <a
                href="/sinav-sonuclari"
                onClick={(e) => handleProtectedLink(e, '/sinav-sonuclari')}
              >
                Sınav Sonuçları
              </a>
            </li>
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