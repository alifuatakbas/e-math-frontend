"use client";
import styles from '../styles/Features.module.css'
import { FiTarget, FiShield, FiUsers, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <FiTarget className={styles.icon} />,
    title: "Müfredat",
    description: "Gelişmekte sınır tanımayan müfredat."
  },
  {
    icon: <FiShield className={styles.icon} />,
    title: "Sınavlar",
    description: "Düzenli sınavlar ile yarışma ortamı."
  },
  {
    icon: <FiUsers className={styles.icon} />,
    title: "Uzman Kadro",
    description: "Olimpiyat alanında başarılı olmuş Boğaziçi'li Odtü'lü Bilkent'li tecrübeli hocalar."
  },
  {
    icon: <FiClock className={styles.icon} />,
    title: "Online Eğitim",
    description: "Online eğitimin ayrıcalıklarıyla ev ortamından tatile her yerde derslere kesintisiz erişim."
  }
];

const Features = () => {
  return (
    <section className={styles.features}>
      <div className={styles.featuresBackground}></div>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>Özel Öğrenciye Özel İlgi</h2>

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
  )
}

export default Features
