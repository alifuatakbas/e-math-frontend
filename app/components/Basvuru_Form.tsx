"use client";
import React, { useState } from 'react';
import styles from '../styles/BasvuruForm.module.css';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    message: ''
  });

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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Başvuru Formu</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Ad Soyad *</label>
            <input
              type="text"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-posta *</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="school">Okul *</label>
            <input
              type="text"
              id="school"
              required
              value={formData.school}
              onChange={(e) => setFormData({...formData, school: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="grade">Sınıf *</label>
            <select
              id="grade"
              required
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
            >
              <option value="">Seçiniz</option>
              <option value="9">9. Sınıf</option>
              <option value="10">10. Sınıf</option>
              <option value="11">11. Sınıf</option>
              <option value="12">12. Sınıf</option>
              <option value="mezun">Mezun</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Mesaj</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
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