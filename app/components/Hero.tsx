"use client"
import React, { useState, useEffect } from 'react'
import styles from '../styles/Hero.module.css'
import { FiSun, FiMoon } from 'react-icons/fi'

const Hero = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark';
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.body.style.backgroundColor = '#0F172A';
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#F8FAFC';
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  return (
    <section className={`${styles.hero} ${darkMode ? styles.darkMode : ''}`}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOverlay}></div>
      </div>

      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Slogan */}
          <div className={styles.sloganBox}>
            <h1 className={styles.slogan}>
              <div>BİZE EMANET EDİN</div>
              <div><span className={styles.titleAccent}>GELECEĞİNİ</span></div>
              <div>GARANTİLEYİN</div>
            </h1>
          </div>
          {/* Bilgi Metni */}
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              Yüksek potansiyelli öğrencilerin özel ihtiyaçlarını fark edip destekleyerek, onların yeteneklerini en iyi
              şekilde geliştirmelerine yardımcı oluyoruz.
            </p>
          </div>

          {/* Demo Butonu */}
          <div className={styles.buttonWrapper}>
            <a href="https://eolimpiyat.com/basvuru" className={styles.demoButton}>
              DENEME DERSİ ALMAK İSTİYORUM
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero