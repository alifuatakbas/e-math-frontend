"use client"
import React, { useState, useEffect } from 'react'
import styles from '../styles/Hero.module.css'
import { FiSun, FiMoon } from 'react-icons/fi'
import Link from 'next/link'

interface Exam {
  id: number;
  title: string;
  registration_start_date: string;
  registration_end_date: string;
  exam_start_date: string;
  exam_end_date: string;
  status: string;
  can_register: boolean;
  is_registered: boolean;
  registration_status: string;
}


const Hero = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  const [showExams, setShowExams] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  const token = localStorage.getItem('token'); // veya kullandığınız auth yöntemine göre
  setIsLoggedIn(!!token);
}, []);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark';
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.body.style.backgroundColor = '#0F172A';
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#F8FAFC';
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

const fetchExams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/exams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Sınavlar yüklenemedi');
      }

      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Sınavlar yüklenirken hata:', error);
      alert('Sınavlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
};

  const handleShowExams = () => {
    setShowExams(true);
    fetchExams();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className={`${styles.hero} ${darkMode ? styles.darkMode : ''}`}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOverlay}></div>
      </div>

      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.sloganBox}>
            <h1 className={styles.slogan}>
              <div>MATEMATİK VE BİLGİSAYAR YARIŞMALARINA</div>
              <div><span className={styles.titleAccent}>ONLİNE</span></div>
              <div> HAZIRLIK</div>
            </h1>
          </div>
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              Yüksek potansiyelli öğrencilerin özel ihtiyaçlarını fark edip destekleyerek, onların yeteneklerini en iyi
              şekilde geliştirmelerine yardımcı oluyoruz.
            </p>
          </div>

          <div className={styles.buttonWrapper}>
            <a href="https://forms.gle/twShthRm6ys9JeaV7" className={styles.demoButton}>
              YETERLİLİK SINAVI KAYIT FORMU
            </a>
            <button onClick={handleShowExams} className={styles.examButton}>
              AKTİF SINAVLARI GÖRÜNTÜLE
            </button>
          </div>

         {showExams && (
  <div className={styles.examsModal}>
    <div className={styles.examsContent}>
      <h2>Mevcut Sınavlar</h2>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : exams.length === 0 ? (
        <p>Şu anda aktif sınav bulunmamaktadır.</p>
      ) : (
        <div className={styles.examsList}>
{exams.map((exam) => (
  <div key={exam.id} className={styles.examCard}>
    <h3>{exam.title}</h3>
    <div className={styles.examDetails}>
      <p>Başvuru Başlangıç: {formatDate(exam.registration_start_date)}</p>
      <p>Başvuru Bitiş: {formatDate(exam.registration_end_date)}</p>
      <p>Sınav Tarihi: {formatDate(exam.exam_start_date)}</p>
      <p>Durum: {exam.status === 'registration_open' ? 'Başvuru Açık' : 'Başvuru Beklemede'}</p>
    </div>
    {isLoggedIn ? (
      <a href="https://www.eolimpiyat.com/sinav-coz" className={styles.applyButton}>
        Sınava Git
      </a>
    ) : (
      <Link href="/login" className={styles.applyButton}>
        Başvuru Yapmak İçin Giriş Yapın
      </Link>
    )}
  </div>
))}
        </div>
      )}
      <button
        onClick={() => setShowExams(false)}
        className={styles.closeButton}
      >
        Kapat
      </button>
    </div>
  </div>
)}
                 </div>
      </div>
    </section>
  )
}

export default Hero