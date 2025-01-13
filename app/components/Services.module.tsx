import React from 'react'
import styles from '../styles/Services.module.css'

const Services = () => {
  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <h2>Hizmetlerimiz</h2>
        <p className={styles.subtitle}>Size özel çözümler sunuyoruz</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>🚀</div>
            <h3>Web Tasarım</h3>
            <p>Modern ve kullanıcı dostu web siteleri tasarlıyoruz.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>💻</div>
            <h3>Web Geliştirme</h3>
            <p>En son teknolojilerle web uygulamaları geliştiriyoruz.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>📱</div>
            <h3>Mobil Uygulama</h3>
            <p>iOS ve Android için native uygulamalar geliştiriyoruz.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🎨</div>
            <h3>UI/UX Tasarım</h3>
            <p>Kullanıcı deneyimini en üst düzeye çıkarıyoruz.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>📊</div>
            <h3>SEO Optimizasyonu</h3>
            <p>Sitenizin arama motorlarında üst sıralarda yer almasını sağlıyoruz.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🛡️</div>
            <h3>Siber Güvenlik</h3>
            <p>Verilerinizi güvende tutuyoruz.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services