"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span>🎮</span> Oyunlaştırılmış Matematik
          </div>

          <h1 className={styles.title}>
            Matematik Artık
            <div className={styles.animatedText}>
              <span>Çok Eğlenceli! 🎨</span>
              <span>Bir Oyun! 🎮</span>
              <span>Çok Kolay! ⭐</span>
            </div>
          </h1>

          <p className={styles.description}>
            Seviye seviye ilerle, puanlar kazan, arkadaşlarınla yarış ve
            matematiği eğlenerek öğren!
          </p>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🏆</span>
              <span className={styles.featureText}>Günlük Görevler</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🎯</span>
              <span className={styles.featureText}>Kişisel Hedefler</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🌟</span>
              <span className={styles.featureText}>Rozetler</span>
            </div>
          </div>

          <div className={styles.ctaGroup}>
            <button className={styles.mainCta}>
              <span>Hemen Başla</span>
              <span className={styles.ctaEmoji}>🚀</span>
            </button>
            <button className={styles.secondaryCta}>
              Nasıl Çalışır? 🤔
            </button>
          </div>

          <div className={styles.achievementBadge}>
            <div className={styles.achievementIcon}>👨‍🎓</div>
            <div className={styles.achievementText}>
              <span>Bugün</span>
              <strong>1,234 öğrenci</strong>
              <span>matematik öğrendi!</span>
            </div>
          </div>
        </div>

        <div className={styles.visualSection}>
          <div className={styles.characterContainer}>
            <div className={styles.mathBubble}>2 × 2 = 4</div>
            <div className={styles.mathBubble}>π ≈ 3.14</div>
            <div className={styles.mathBubble}>√16 = 4</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero