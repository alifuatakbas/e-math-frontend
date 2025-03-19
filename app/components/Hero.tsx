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
    // Sayfa yüklendiğinde mevcut tema durumunu kontrol et
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark';
    setDarkMode(isDark);

    // Tema durumunu HTML'e yansıt
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
    // Tema tercihini localStorage'a kaydet
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

      <div className={styles.heroBackground}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.headingWrapper}>
              <h1 className={styles.title}>
                BİZİ EMANET EDİN
                <span className={styles.titleAccent}>GELECEĞİNİZİN</span>
                GARANTİSİYİZ
              </h1>
            </div>

            <div className={styles.subtitleWrapper}>
              <p className={styles.subtitle}>
                Matematik düşünme sanatıdır.
              </p>
            </div>

            <div className={styles.ctaWrapper}>
              <button className={styles.mainCta}>
                KEŞFET
              </button>
            </div>
          </div>

          <div className={styles.scrollIndicator}>
            <div className={styles.mouse}>
              <div className={styles.wheel}></div>
            </div>
            <div className={styles.scrollText}>AŞAĞI KAYDIR</div>
          </div>
        </div>

        <div className={styles.sideNav}>
          <div className={styles.navDot}></div>
          <div className={styles.navDot}></div>
          <div className={styles.navDot}></div>
        </div>

        <div className={styles.cornerInfo}>
        </div>
      </div>
    </section>
  )
}

export default Hero
