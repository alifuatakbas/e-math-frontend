// Features.tsx
import styles from '../styles/Features.module.css'
import { FiClock, FiShield, FiUsers } from 'react-icons/fi' // react-icons ekleyin

const Features = () => {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Neden Bizi Seçmelisiniz?</h2>
        <p className={styles.subtitle}>Kaliteli eğitim için doğru adres</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <FiClock className={styles.icon} />
            </div>
            <h3>Hızlı Teslimat</h3>
            <p>7/24 kesintisiz hizmet ile yanınızdayız. Eğitim materyallerinize anında erişim sağlayın.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <FiShield className={styles.icon} />
            </div>
            <h3>Güvenli Altyapı</h3>
            <p>En son teknoloji ile güçlendirilmiş altyapımız sayesinde kesintisiz eğitim deneyimi.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <FiUsers className={styles.icon} />
            </div>
            <h3>Uzman Ekip</h3>
            <p>Alanında uzman eğitmenlerimiz ile profesyonel eğitim kadrosu sizlerle.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features