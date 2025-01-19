"use client"
import React, { useState, useEffect } from 'react';
import { Target, Award, Sun, Moon } from 'lucide-react';
import styles from '../styles/About.module.css';

const AboutUs = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark';
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  const companyInfo = {
    name: "Şirket Adı",
    founded: "2020",
    vision: "Teknoloji dünyasında yenilikçi çözümlerle öncü olmak ve müşterilerimize en yüksek değeri sunmak.",
    mission: "Sürdürülebilir teknoloji çözümleri ile işletmelerin dijital dönüşümüne öncülük etmek ve topluma değer katmak.",
    values: [
      {
        title: "Yenilikçilik",
        description: "Sürekli gelişim ve inovasyonu destekleyerek, sektörde öncü çözümler üretiyoruz."
      },
      {
        title: "Müşteri Odaklılık",
        description: "Müşterilerimizin ihtiyaçlarını en iyi şekilde anlayarak, beklentilerinin ötesinde hizmet sunuyoruz."
      },
      {
        title: "Kalite",
        description: "Her projemizde en yüksek kalite standartlarını benimseyerek mükemmelliği hedefliyoruz."
      }
    ],
    achievements: [
      { number: "500+", text: "Mutlu Müşteri" },
      { number: "100+", text: "Tamamlanan Proje" },
      { number: "50+", text: "Uzman Ekip" },
      { number: "15+", text: "Ödül" }
    ]
  };

  return (
    <div className={`${styles.aboutContainer} ${darkMode ? styles.darkMode : ''}`}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className={styles.themeIcon} /> : <Moon className={styles.themeIcon} />}
      </button>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Hakkımızda</h1>
          <p className={styles.heroText}>
            {companyInfo.founded} yılından bu yana teknoloji sektöründe hizmet vermekteyiz.
          </p>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        {/* Vizyon & Misyon */}
        <div className={styles.gridContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Target className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Vizyonumuz</h2>
            </div>
            <p className={styles.cardText}>{companyInfo.vision}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Award className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Misyonumuz</h2>
            </div>
            <p className={styles.cardText}>{companyInfo.mission}</p>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div className={styles.valuesSection}>
          <h2 className={styles.sectionTitle}>Değerlerimiz</h2>
          <div className={styles.gridContainer}>
            {companyInfo.values.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.cardText}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Başarılarımız */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Başarılarımız</h2>
          <div className={styles.statsGrid}>
            {companyInfo.achievements.map((achievement, index) => (
              <div key={index}>
                <p className={styles.statNumber}>{achievement.number}</p>
                <p className={styles.statText}>{achievement.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;