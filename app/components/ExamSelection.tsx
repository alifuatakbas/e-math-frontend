"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/ExamSelection.module.css';
import { ExamSCH,ExamStatusType } from '../schemas/schemas';
import { FiSun, FiMoon } from 'react-icons/fi';
import { formatDateForDisplay } from '../utils/dateUtils';



interface Exam extends ExamSCH {
  registration_start_date: string;
  registration_end_date: string;
  exam_start_date: string;
  exam_end_date: string;
  is_registered: boolean;
  requires_registration: boolean;  // Yeni eklenen alan
  status: 'registration_pending' | 'registration_open' | 'exam_active' | 'completed';
  can_register: boolean;         // Eklendi
  registration_status: string;   // Eklendi
}


const ExamSelection: React.FC<{ onSelect: (examId: number) => void }> = ({ onSelect }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  // Başvuru işlemi
  // Başvuru işlemi
  const handleRegister = async (examId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Başvuru yapılırken bir hata oluştu');
      }

      // Başarılı mesajını göster
      setSuccessMessage('Sınava başarıyla kayıt oldunuz!');
      setTimeout(() => setSuccessMessage(''), 3000); // 3 saniye sonra mesajı kaldır

      // Başvuru başarılı olduğunda sınavları yeniden getir
      await fetchExams();
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };
  const fetchExams = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Sınavlar alınırken bir hata oluştu');
      }

      const data = await response.json();

      setExams(data);
    } catch (error: any) {
      console.error('Hata:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    // Tema kontrolü
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

    fetchExams();
  }, []);
useEffect(() => {
  const fixScroll = () => {
    const container = document.querySelector('.examSelectionContainer') as HTMLElement;
    if (container) {
      // CSS stillerini object olarak tanımla
      const scrollStyles = {
        overflow: 'visible',
        overflowY: 'auto',
        overflowX: 'hidden',
        webkitOverflowScrolling: 'touch',
        touchAction: 'auto',
        height: 'auto',
        minHeight: 'auto',
        maxHeight: 'none',
        position: 'relative',
        webkitTransform: 'translateZ(0)'
      };

      // Object'i style'a uygula
      Object.assign(container.style, scrollStyles);
    }

    // Body için
    const bodyStyles = {
      overflow: 'visible',
      overflowY: 'auto',
      overflowX: 'hidden',
      webkitOverflowScrolling: 'touch',
      touchAction: 'auto'
    };

    Object.assign(document.body.style, bodyStyles);
  };

  fixScroll();

  if (exams.length > 0) {
    setTimeout(fixScroll, 100);
    setTimeout(fixScroll, 500);
  }

  window.addEventListener('resize', fixScroll);
  window.addEventListener('orientationchange', fixScroll);

  return () => {
    window.removeEventListener('resize', fixScroll);
    window.removeEventListener('orientationchange', fixScroll);
  };
}, [exams]);

  // Debug için
  useEffect(() => {
    console.log('Container height:', document.querySelector('.examSelectionContainer')?.scrollHeight);
    console.log('Window height:', window.innerHeight);
    console.log('Scroll working:', document.querySelector('.examSelectionContainer')?.scrollTop);
  }, [exams]);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  // Sınav durumuna göre buton metni
  const getButtonText = (exam: Exam) => {
  if (exam.is_registered) return 'Başvuru Yapıldı';

  const statusTexts: Record<ExamStatusType, string> = {
    'registration_pending': 'Başvurular Henüz Başlamadı',
    'registration_open': 'Başvur',
    'exam_active': 'Sınav Aktif',
    'completed': 'Sınav Tamamlandı'
  };

  return statusTexts[exam.status] || 'Başvur';
};

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

return (
  <div className={`${styles.examSelectionContainer} ${darkMode ? styles.darkMode : ''}`}>
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
      aria-label="Toggle theme"
    >
      {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
    </button>

    <h1 className={styles.title}>Sınavlar</h1>
    {error && <div className={styles.errorMessage}>{error}</div>}
    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

    <div className={styles.examList}>
      {exams.map((exam) => (
          <div key={exam.id} className={styles.examCard}>
            <h2>{exam.title}</h2>
            <div className={styles.examInfo}>
              {exam.requires_registration ? (
                <>
                  <p>Başvuru Başlangıç: {formatDateForDisplay(exam.registration_start_date)}</p>
                  <p>Başvuru Bitiş: {formatDateForDisplay(exam.registration_end_date)}</p>
                </>
              ) : (
                <p className={styles.noRegistration}>Başvuru Gerekmez - Tüm kullanıcılar katılabilir</p>
              )}
              <p>Sınav Başlangıç: {formatDateForDisplay(exam.exam_start_date)}</p>
              <p>Sınav Bitiş: {formatDateForDisplay(exam.exam_end_date)}</p>
            </div>
            <div className={styles.examActions}>
              {/* Başvurulu sınavlar için başvuru butonu */}
              {exam.requires_registration && (exam.status === 'registration_open' || exam.status === 'registration_pending') && (
                  <button
                      onClick={() => handleRegister(exam.id)}
                      className={`${styles.registerButton} ${exam.is_registered ? styles.disabled : ''}`}
                      disabled={exam.is_registered || exam.status === 'registration_pending'}
                  >
                    {exam.is_registered
                        ? 'Başvuru Yapıldı'
                        : exam.status === 'registration_pending'
                            ? 'Başvurular Henüz Başlamadı'
                            : 'Başvur'
                    }
                  </button>
              )}

              {/* Sınava başla butonu - hem başvurulu hem başvurusuz sınavlar için */}
              {exam.status === 'exam_active' && (exam.is_registered || !exam.requires_registration) && (
                  <button
                      onClick={() => onSelect(exam.id)}
                      className={styles.startButton}
                  >
                    Sınava Başla
                  </button>
              )}
            </div>
          </div>
      ))}
    </div>
  </div>
);
}
export default ExamSelection;