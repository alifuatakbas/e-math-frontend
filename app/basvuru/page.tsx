// pages/basvuru.tsx
"use client";
import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';

const Apply: React.FC = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    studentPhone: '',
    parentName: '',
    parentPhone: '',
  });

  // Form verilerini güncelleyen fonksiyon
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Form gönderme işlemi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form verilerini işleyebilir ve backend'e gönderebilirsiniz
    console.log(formData);
    alert('Başvurunuz alınmıştır!');
  };

  return (
    <div className={styles.formContainer}>
      <h2>Başvuru Formu</h2>
      <form onSubmit={handleSubmit} className={styles.applicationForm}>
        <div className={styles.studentSection}>
          <h3>Öğrenci Bilgileri</h3>
          <label htmlFor="studentName">Öğrencinin Adı ve Soyadı:</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />

          <label htmlFor="studentClass">Sınıfı:</label>
          <input
            type="text"
            id="studentClass"
            name="studentClass"
            value={formData.studentClass}
            onChange={handleChange}
            required
          />

          <label htmlFor="studentPhone">Öğrencinin Telefon Numarası (Opsiyonel):</label>
          <input
            type="text"
            id="studentPhone"
            name="studentPhone"
            value={formData.studentPhone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.parentSection}>
          <h3>Veli Bilgileri</h3>
          <label htmlFor="parentName">Veli Adı ve Soyadı:</label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            required
          />

          <label htmlFor="parentPhone">Veli Telefon Numarası:</label>
          <input
            type="text"
            id="parentPhone"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Başvuruyu Gönder
        </button>
      </form>
    </div>
  );
};

export default Apply;
