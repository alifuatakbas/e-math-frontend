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
    <section
      className={`${styles.hero} ${darkMode ? styles.darkMode : ''}`}
      style={{
        backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
        color: darkMode ? '#F1F5F9' : '#1E293B'
      }}
    >
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Slogan Kutusu */}
          <div className={styles.sloganBox}>
            <h1 className={styles.slogan}>
              BİZİ EMANET EDİN
              <span className={styles.titleAccent}> GELECEĞİNİZİN </span>
              GARANTİSİYİZ
            </h1>
          </div>

          {/* Bilgi Kutusu */}
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              E-Olimpiyat, öğrencilerin matematik becerilerini geliştirmek ve
              olimpiyatlara hazırlanmalarını sağlamak için tasarlanmış online bir
              eğitim platformudur. Uzman eğitmenler eşliğinde, interaktif içerikler
              ve özel hazırlanmış sorularla matematik yolculuğunuzda size rehberlik
              ediyoruz.
            </p>
          </div>

          {/* Deneme Butonu */}
          <div className={styles.buttonWrapper}>
            <button className={styles.demoButton}>
              DENEME SÜRÜMÜNÜ DENE
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero