import styles from '../styles/Features.module.css'
import React from 'react'
const Features = ()  => {
  return (
    <section className={styles.features}>
      <h2>Özelliklerimiz</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Hızlı Teslimat</h3>
          <p>7/24 kesintisiz hizmet</p>
        </div>
        <div className={styles.card}>
          <h3>Güvenli Altyapı</h3>
          <p>En son teknoloji</p>
        </div>
        <div className={styles.card}>
          <h3>Uzman Ekip</h3>
          <p>Profesyonel kadro</p>
        </div>
      </div>
    </section>
  )
}

export default Features