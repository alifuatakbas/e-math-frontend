"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.dot}></span>
            AI Powered Learning
          </div>

          <h1 className={styles.title}>
            Matematik
            <span className={styles.gradient}> Yolculuğunuz </span>
            Başlıyor
          </h1>

          <p className={styles.description}>
            Yapay zeka destekli kişiselleştirilmiş öğrenme deneyimi ile
            matematiği yeniden keşfedin.
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>98%</div>
              <div className={styles.statLabel}>Başarı Oranı</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>20K+</div>
              <div className={styles.statLabel}>Aktif Öğrenci</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>500+</div>
              <div className={styles.statLabel}>Video Ders</div>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <button className={styles.primaryBtn}>
              Hemen Başla
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={styles.secondaryBtn}>
              <div className={styles.playIcon}></div>
              Tanıtım İzle
            </div>
          </div>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <div className={styles.glowEffect}></div>
            <div className={styles.gridPattern}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero