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
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'Başvurular Açık';
      case 'exam_active':
        return 'Sınav Aktif';
      default:
        return status;
    }
  };

  return (
    <section className={`${styles.hero} ${darkMode ? styles.darkMode : ''}`}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Tema değiştir"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.sloganBox}>
            <h1 className={styles.slogan}>
              <div>Online Sınav</div>
              <div>Platformuna <span className={styles.titleAccent}>Hoş Geldiniz</span></div>
            </h1>
          </div>

          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              Güvenli ve kolay online sınav deneyimi için doğru adrestesiniz.
              Hemen sınavlarımıza göz atın ve başvurunuzu yapın.
            </p>
          </div>

          <div className={styles.buttonWrapper}>
            <button
              onClick={() => {
                setShowExams(true);
                fetchExams();
              }}
              className={styles.examButton}
            >
              Aktif Sınavları Gör
            </button>
            <Link href="/demo" className={styles.demoButton}>
              Demo Sınav
            </Link>
          </div>
        </div>
      </div>

      {showExams && (
        <div className={styles.examsModal}>
          <div className={styles.examsContent}>
            <h2>Aktif Sınavlar</h2>
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
                      <p>Başvuru Tarihi: {formatDate(exam.registration_start_date)} - {formatDate(exam.registration_end_date)}</p>
                      <p>Sınav Tarihi: {formatDate(exam.exam_start_date)}</p>
                      <p>Durum: {getStatusText(exam.status)}</p>
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
    </section>
  )
}

export default Hero