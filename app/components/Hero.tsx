"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span>✨ YENİ</span> Yapay Zeka Destekli Öğrenme
          </div>

          <h1>
            Matematik Öğrenmenin
            <div className={styles.animatedText}>
              <span>Eğlenceli</span>
              <span>Kolay</span>
              <span>Akıllı</span>
            </div>
            Yolu
          </h1>

          <p>
            Kişiselleştirilmiş öğrenme yolculuğu ve gerçek zamanlı geri bildirimlerle
            matematiği keşfedin.
          </p>

          <div className={styles.ctaGroup}>
            <button className={styles.mainCta}>
              <span>Ücretsiz Dene</span>
              <span className={styles.ctaArrow}>→</span>
            </button>
            <button className={styles.secondaryCta}>
              <span className={styles.playIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
              </span>
              Demo İzle
            </button>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.trustItem}>
              <span className={styles.rating}>⭐ 4.9/5</span>
              <span>Öğrenci Memnuniyeti</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.trustItem}>
              <span className={styles.users}>👥 15K+</span>
              <span>Aktif Öğrenci</span>
            </div>
          </div>
        </div>

        <div className={styles.visualSection}>
          <div className={styles.glowCircle}></div>
          <div className={styles.floatingElements}>
            <div className={styles.element1}>∑</div>
            <div className={styles.element2}>π</div>
            <div className={styles.element3}>∞</div>
            <div className={styles.element4}>√</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero