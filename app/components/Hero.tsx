"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
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