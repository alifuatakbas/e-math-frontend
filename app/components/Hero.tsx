"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>
            <span className={styles.gradientText}>Matematik</span>
            <br />
            Artık Daha Kolay
          </h1>
          <p>Yapay zeka destekli özel ders deneyimiyle matematiği keşfet</p>
          <div className={styles.buttonGroup}>
            <button className={styles.cta}>Ücretsiz Başla</button>
            <button className={styles.secondaryCta}>Nasıl Çalışır?</button>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.floatingImage}></div>
          <div className={styles.glowEffect}></div>
        </div>
      </div>
    </section>
  )
}

export default Hero