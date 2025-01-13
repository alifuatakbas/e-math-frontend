"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>MATEMATİĞİ sad</h1>
        <p>MATEMATİK UZMANI OLUN</p>
        <button className={styles.cta}>Hemen Başlayın</button>
      </div>
    </section>
  )
}

export default Hero