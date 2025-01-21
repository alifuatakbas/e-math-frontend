"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/BasvuruForm.module.css';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ isOpen, onClose }) => {
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
        <div
            className={`${styles.modalContent} ${isDarkMode ? styles.darkMode : ''}`}
            onClick={e => e.stopPropagation()}
        >
            <button className={styles.closeButton} onClick={onClose}>×</button>
            <h2 className={styles.formTitle}>Başvuru Formu</h2>
            <form onSubmit={handleSubmit}>
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
  );
};

export default ApplicationForm;