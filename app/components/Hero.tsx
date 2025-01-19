"use client"
import React from 'react'
import styles from '../styles/Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>MATEMATİK YOLCULUĞU</h1>
        <p>Geleceğin Matematiğini Bugün Keşfet</p>
        <button className={styles.cta}>
          Yolculuğa Başla
        </button>
      </div>
    </section>
  )
}

export default Hero