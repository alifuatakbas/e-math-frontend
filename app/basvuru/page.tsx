"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/Basvuru.module.css';
import Navbar from '../components/Navbar';  // Navbar'ı import ediyoruz

const BasvuruPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    message: ''
  });

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.nodeName === 'HTML') {
          const isDark = document.documentElement.classList.contains('dark-theme');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Başvurunuz başarıyla alındı!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          school: '',
          grade: '',
          message: ''
        });
      } else {
        alert('Başvuru gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Başvuru hatası:', error);
      alert('Başvuru gönderilirken bir hata oluştu.');
    }
  };

  return (
    <>
      <Navbar />  {/* Navbar'ı ekliyoruz */}
      <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.formContainer}>
        <h1 className={styles.title}>Başvuru Formu</h1>
        <p className={styles.description}>
          Matematik eğitimi için başvurunuzu aşağıdaki formu doldurarak yapabilirsiniz.
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.required} htmlFor="fullName">Ad Soyad</label>
            <input
              type="text"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Adınız ve soyadınız"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.required} htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="ornek@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="5XX XXX XX XX"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.required} htmlFor="school">Okul</label>
            <input
              type="text"
              id="school"
              required
              value={formData.school}
              onChange={(e) => setFormData({...formData, school: e.target.value})}
              placeholder="Okulunuzun adı"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.required} htmlFor="grade">Sınıf</label>
            <select
                id="grade"
                required
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
            >
              <option value="">Sınıfınızı seçin</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8">8. Sınıf</option>
              <option value="9">9. Sınıf</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Mesaj</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Eklemek istediğiniz notlar..."
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Başvuruyu Gönder
          </button>
        </form>
      </div>
    </div>
      </>
  );
};

export default BasvuruPage;