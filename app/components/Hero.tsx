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

  const [message, setMessage] = useState('');

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

  const handleSubmit = () => {
    // Buton işlevselliği buraya
    console.log('Gönderilen mesaj:', message);
    setMessage(''); // Mesajı gönderdikten sonra input'u temizle
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

            <div className={styles.messageBox}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı buraya yazın..."
                className={styles.messageInput}
              />
            </div>

            <div className={styles.buttonWrapper}>
              <button
                onClick={handleSubmit}
                className={styles.submitButton}
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero