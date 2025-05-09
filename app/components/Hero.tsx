"use client"
import React, { useState, useEffect } from 'react'
import styles from '../styles/Hero.module.css'
import { FiSun, FiMoon } from 'react-icons/fi'
import Link from 'next/link'

interface Exam {
  id: number;
  title: string;
  registration_start_date: string;
  exam_start_date: string;
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/active`);
      if (!response.ok) throw new Error('Sınavlar yüklenemedi');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Sınavlar yüklenirken hata:', error);
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
              <div>BİZE EMANET EDİN</div>
              <div><span className={styles.titleAccent}>GELECEĞİNİ</span></div>
              <div>GARANTİLEYİN</div>
            </h1>
          </div>
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              Yüksek potansiyelli öğrencilerin özel ihtiyaçlarını fark edip destekleyerek, onların yeteneklerini en iyi
              şekilde geliştirmelerine yardımcı oluyoruz.
            </p>
          </div>

          <div className={styles.buttonWrapper}>
            <a href="https://eolimpiyat.com/basvuru" className={styles.demoButton}>
              DENEME DERSİ ALMAK İSTİYORUM
            </a>
            <button onClick={handleShowExams} className={styles.examButton}>
              AKTİF SINAVLARI GÖRÜNTÜLE
            </button>
          </div>

          {showExams && (
            <div className={styles.examsModal}>
              <div className={styles.examsContent}>
                <h2>Aktif Sınavlar</h2>
                {isLoading ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <div className={styles.examsList}>
                    {exams.map((exam) => (
                      <div key={exam.id} className={styles.examCard}>
                        <h3>{exam.title}</h3>
                        <div className={styles.examDetails}>
                          <p>Başvuru Tarihi: {formatDate(exam.registration_start_date)}</p>
                          <p>Sınav Tarihi: {formatDate(exam.exam_start_date)}</p>
                        </div>
                        <Link href="/login" className={styles.applyButton}>
                          Başvuru Yap
                        </Link>
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