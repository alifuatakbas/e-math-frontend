"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.textContent}>
            <h1>
              Matematiği
              <span className={styles.highlight}> Sevdiren </span>
              Platform
            </h1>
            <p>
              Kişiselleştirilmiş öğrenme deneyimi ve interaktif içeriklerle
              matematik öğrenmenin en keyifli hali
            </p>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Öğrenci</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Video Ders</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>%98</span>
              <span className={styles.statLabel}>Başarı</span>
            </div>
          </div>
          <div className={styles.ctaContainer}>
            <button className={styles.primaryBtn}>Hemen Başla</button>
            <button className={styles.secondaryBtn}>
              <span className={styles.playIcon}>▶</span>
              Tanıtım İzle
            </button>
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.cardStack}>
            <div className={`${styles.card} ${styles.card1}`}></div>
            <div className={`${styles.card} ${styles.card2}`}></div>
            <div className={`${styles.card} ${styles.card3}`}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero