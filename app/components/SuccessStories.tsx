"use client";
import React from 'react';
import styles from '../styles/SuccessStories.module.css';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiUsers } from 'react-icons/fi';

const SuccessStories = () => {
  return (
    <section className={styles.successStories}>
      <div className={styles.backgroundPattern}></div>

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>Başarılarımız</h2>
        <p className={styles.subtitle}>Öğrencilerimizin elde ettiği başarılar</p>

        <div className={styles.content}>
          <div className={styles.achievements}>
            <motion.div
              className={styles.achievementCard}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.iconWrapper}>
                <FiAward className={styles.icon} />
              </div>
              <h3>TÜBİTAK Bilim Olimpiyatları</h3>
              <p>2. aşama sınavı başarıları</p>
            </motion.div>

            <motion.div
              className={styles.achievementCard}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.iconWrapper}>
                <FiStar className={styles.icon} />
              </div>
              <h3>Antalya Matematik Olimpiyatları</h3>
              <p>Altın ve Gümüş madalyalar</p>
            </motion.div>

            <motion.div
              className={styles.achievementCard}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.iconWrapper}>
                <FiAward className={styles.icon} />
              </div>
              <h3>Boğaziçi Matematik Yarışması</h3>
              <p>Türkiye 1.si ve 3.sü</p>
            </motion.div>
          </div>

          <div className={styles.testimonials}>
            <h2 className={styles.title}>Öğrenci Yorumları</h2>
            <div className={styles.testimonialGrid}>
              <motion.div
                className={styles.testimonialCard}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FiUsers className={styles.icon} />
                <p className={styles.quote}>
                  &ldquo;İleri düzey matematik eğitimleri sayesinde, matematiğin sadece okul ile sınırlı olmadığını ve ne kadar çalışırsam o kadar öğrenebileceğimi fark ettim.&rdquo;
                </p>
                <p className={styles.author}>- Sena Ö.</p>
              </motion.div>

              <motion.div
                className={styles.testimonialCard}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FiUsers className={styles.icon} />
                <p className={styles.quote}>
                  &ldquo;Girdiğim yarışmalarda artık bilgi seviyem yeterli mi diye endişelenmiyorum.&rdquo;
                </p>
                <p className={styles.author}>- Batuhan Ç.</p>
              </motion.div>

              <motion.div
                className={styles.testimonialCard}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FiUsers className={styles.icon} />
                <p className={styles.quote}>
                  &ldquo;İleri düzey matematik eğitimi sayesinde Boğaziçi Matematik Yarışması&apos;nda Türkiye 1.si oldum.&rdquo;
                </p>
                <p className={styles.author}>- Nisa A.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SuccessStories;