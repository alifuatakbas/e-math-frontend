"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/Basvuru.module.css';
import Navbar from '../components/Navbar';

const BasvuruPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // Başvuru durumu için state
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

    const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      school: '',
      grade: '',
      message: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('pending'); // Başvuru gönderilirken

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        resetForm(); // Formu temizle
        setTimeout(() => {
          setSubmitStatus(''); // 5 saniye sonra mesajı kaldır
        }, 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => {
          setSubmitStatus(''); // 5 saniye sonra mesajı kaldır
        }, 5000);
      }
    } catch (error) {
      console.error('Başvuru hatası:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus(''); // 5 saniye sonra mesajı kaldır
      }, 5000);
    }
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Başvuru Formu</h1>
          <p className={styles.description}>
            Matematik eğitimi için başvurunuzu aşağıdaki formu doldurarak yapabilirsiniz.
          </p>

          {/* Durum mesajları */}
          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              Başvurunuz başarıyla alındı! Size en kısa sürede dönüş yapacağız.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
            </div>
          )}
          {submitStatus === 'pending' && (
            <div className={styles.pendingMessage}>
              Başvurunuz gönderiliyor...
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ... form alanları aynı kalacak ... */}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitStatus === 'pending'}
            >
              {submitStatus === 'pending' ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BasvuruPage;