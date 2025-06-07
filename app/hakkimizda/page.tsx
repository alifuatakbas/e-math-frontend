"use client"
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from '../styles/About.module.css';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Başlangıç değerini localStorage'dan al
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark-theme', isDark);
      document.body.style.backgroundColor = isDark ? '#0F172A' : '#F8FAFC';
    }
  }, []);

  useEffect(() => {
    // darkMode değiştiğinde localStorage'ı güncelle
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-theme', darkMode);
    document.body.style.backgroundColor = darkMode ? '#0F172A' : '#F8FAFC';
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.aboutContainer} ${darkMode ? styles.darkMode : ''}`}>
        <button
          onClick={toggleTheme}
          className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className={styles.themeIcon} /> : <Moon className={styles.themeIcon} />}
        </button>

        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1>Hakkımızda</h1>
            <p>2020&apos;den beri olimpiyat alanında eğitim veriyoruz.</p>
          </div>
        </section>

        <div className={styles.mainContent}>
          <section className={styles.introSection}>
            <div className={styles.introText}>
              <h2>Biz Kimiz?</h2>
              <p> Matematik olimpiyatlarında edindiğimiz 12 yılı aşkın deneyimi, erken yaşta matematik eğitiminin değerini bizzat yaşamış Boğaziçili Odtü'lü Bilkentli uzman kadromuzla yeni nesillere aktarıyoruz. Beş yıldır, öğrencilerimizin matematiksel düşünme becerilerini geliştiriyor, onları uluslararası başarılara hazırlıyoruz</p>
            </div>
            <div className={styles.introImage}>
              <div className={styles.imagePlaceholder}></div>
            </div>
          </section>

          <section className={styles.numbersSection}>
            <div className={styles.numberBox}>
              <span className={styles.number}>200+</span>
              <span className={styles.label}>Öğrenci</span>
            </div>
            <div className={styles.numberBox}>
              <span className={styles.number}>1000+</span>
              <span className={styles.label}>Verilen Ders</span>
            </div>
            <div className={styles.numberBox}>
              <span className={styles.number}>10+</span>
              <span className={styles.label}>Uzman Hoca</span>
            </div>
            <div className={styles.numberBox}>
              <span className={styles.number}>5+</span>
              <span className={styles.label}>Uluslararası Başarı</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
