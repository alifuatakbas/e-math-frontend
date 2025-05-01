"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/ExamSelection.module.css';
import { ExamSCH } from '../schemas/schemas';
import { FiSun, FiMoon } from 'react-icons/fi';

interface Exam extends ExamSCH {
  registration_start_date: string;
  registration_end_date: string;
  exam_start_date: string;
  exam_end_date: string;
  is_registered: boolean;
  status: 'registration_pending' | 'registration_open' | 'exam_active' | 'completed';
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
      console.log('Sınavlar:',data);
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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  // Sınav durumuna göre buton metni
  const getButtonText = (exam: Exam) => {
    if (exam.is_registered) return 'Başvuru Yapıldı';
    switch (exam.status) {
      case 'registration_pending':
        return 'Başvurular Henüz Başlamadı';
      case 'registration_open':
        return 'Başvur';
      case 'exam_active':
        return 'Sınav Aktif';
      case 'completed':
        return 'Sınav Tamamlandı';
      default:
        return 'Başvur';
    }
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
              <p>Başvuru Başlangıç: {formatDate(exam.registration_start_date)}</p>
              <p>Başvuru Bitiş: {formatDate(exam.registration_end_date)}</p>
              <p>Sınav Başlangıç: {formatDate(exam.exam_start_date)}</p>
              <p>Sınav Bitiş: {formatDate(exam.exam_end_date)}</p>
            </div>
            <div className={styles.examActions}>
              {/* Başvur butonu için koşulu düzenleyelim */}
              {(exam.status === 'registration_open' || exam.status === 'registration_pending') && (
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
              {exam.status === 'exam_active' && exam.is_registered && (
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