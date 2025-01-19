"use client"
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from '../styles/About.module.css';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sayfa yüklendiğinde localStorage'dan tema tercihini al
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark-theme', savedTheme === 'dark');
      document.body.style.backgroundColor = savedTheme === 'dark' ? '#0F172A' : '#F8FAFC';
    }
  }, []);

  // Tema değiştiğinde localStorage'a kaydet
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark-theme', newDarkMode);
    document.body.style.backgroundColor = newDarkMode ? '#0F172A' : '#F8FAFC';
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
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
            <p>2020&apos;den beri teknoloji çözümleri sunuyoruz</p>
          </div>
        </section>

        <div className={styles.mainContent}>
          <section className={styles.introSection}>
            <div className={styles.introText}>
              <h2>Biz Kimiz?</h2>
              <p>Teknoloji dünyasında yenilikçi çözümler üreten bir ekibiz. Müşterilerimizin ihtiyaçlarını en iyi şekilde anlayarak, onlara özel çözümler sunuyoruz.</p>
            </div>
            <div className={styles.introImage}>
              <div className={styles.imagePlaceholder}></div>
            </div>
          </section>

          <section className={styles.numbersSection}>
            <div className={styles.numberBox}>
              <span className={styles.number}>500+</span>
              <span className={styles.label}>Mutlu Müşteri</span>
            </div>
            <div className={styles.numberBox}>
              <span className={styles.number}>100+</span>
              <span className={styles.label}>Tamamlanan Proje</span>
            </div>
            <div className={styles.numberBox}>
              <span className={styles.number}>50+</span>
              <span className={styles.label}>Uzman Ekip</span>
            </div>
            <div className={styles.numberBox}>
              <span className={styles.number}>15+</span>
              <span className={styles.label}>Ödül</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;