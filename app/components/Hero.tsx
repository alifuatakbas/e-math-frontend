"use client"
import React, { useState, useEffect } from 'react'
import styles from '../styles/Hero.module.css'
import { FiSun, FiMoon } from 'react-icons/fi'

const Hero = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Başlangıçta light mode'u zorla
    document.documentElement.classList.remove('dark-theme');
    document.body.style.backgroundColor = '#F8FAFC';
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
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
                DÜŞÜN
                <span className={styles.titleAccent}>TASARLA</span>
                BAŞAR
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
          <div className={styles.cornerText}>EST 2024</div>
          <div className={styles.cornerLine}></div>
          <div className={styles.cornerText}>ISTANBUL</div>
        </div>
      </div>
    </section>
  )
}

export default Hero