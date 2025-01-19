"use client";
import styles from '../styles/Features.module.css'
import { FiTarget, FiShield, FiUsers, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <FiTarget className={styles.icon} />,
    title: "Hedef Odaklı Eğitim",
    description: "Kişiselleştirilmiş eğitim programları ile hedeflerinize ulaşmanızı sağlıyoruz."
  },
  {
    icon: <FiShield className={styles.icon} />,
    title: "Güvenli Altyapı",
    description: "En son teknoloji ile güçlendirilmiş altyapımız ile kesintisiz eğitim deneyimi."
  },
  {
    icon: <FiUsers className={styles.icon} />,
    title: "Uzman Kadro",
    description: "Alanında uzman eğitmenlerimiz ile profesyonel eğitim kadrosu."
  },
  {
    icon: <FiClock className={styles.icon} />,
    title: "7/24 Destek",
    description: "Kesintisiz müşteri desteği ile her an yanınızdayız."
  }
];

const Features = () => {
  return (
    <div className={styles.featuresWrapper}>
      <section className={styles.features}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>Neden Bizi Seçmelisiniz?</h2>
          <p className={styles.subtitle}>Eğitimde mükemmelliği hedefliyoruz</p>

          <div className={styles.grid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className={styles.iconWrapper}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Features