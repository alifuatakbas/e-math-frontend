"use client";
import styles from '../styles/Features.module.css'
import { FiTarget, FiShield, FiUsers, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <FiTarget className={styles.icon} />,
    title: "Olay matematik değil",
    description: "Olay matematik değil düşünme sanatı."
  },
  {
    icon: <FiShield className={styles.icon} />,
    title: "Sınavlar",
    description: "Öğrencilerimize düzenli sınavlar yaparak gidişatını gözlemliyoruz."
  },
  {
    icon: <FiUsers className={styles.icon} />,
    title: "Uzman Kadro",
    description: "Olimpiyat alanında deneyimli hocalar."
  },
  {
    icon: <FiClock className={styles.icon} />,
    title: "Koçluk",
    description: "Sadece matematik öğretmiyoruz. Aynı zamanda öğrencilerimizi LGS/YKS için yönlendiriyoruz."
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
  )
}

export default Features
