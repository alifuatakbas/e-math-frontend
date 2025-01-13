import React from 'react'
import styles from '../styles/Contact.module.css'

export default function Contact() {
  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        <h1>İletişim</h1>

        <div className={styles.contactInfo}>
          <div className={styles.infoBox}>
            <h3>Adres</h3>
            <p>Atatürk Caddesi No:123</p>
            <p>Kadıköy, İstanbul</p>
          </div>

          <div className={styles.infoBox}>
            <h3>İletişim Bilgileri</h3>
            <p>Email: info@sirketiniz.com</p>
            <p>Tel: +90 (212) 123 45 67</p>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2>Bize Ulaşın</h2>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="name">Ad Soyad</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Konu</label>
              <input type="text" id="subject" name="subject" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Mesajınız</label>
              <textarea id="message" name="message" rows={5} required></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}