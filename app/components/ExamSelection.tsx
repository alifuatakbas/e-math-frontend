"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/ExamSelection.module.css';
import { ExamSCH } from '../schemas/schemas';
import { FiSun, FiMoon } from 'react-icons/fi';

const ExamSelection: React.FC<{ onSelect: (examId: number) => void }> = ({ onSelect }) => {
  const [exams, setExams] = useState<ExamSCH[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

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

    // Sınavları getir
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
      } catch (error) {
        console.error('Hata:', error);
        setError('Sınavlar alınırken bir hata oluştu.');
      }
    };

    fetchExams();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-theme');
    document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);
    onSelect(examId);
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

      <h1 className={styles.title}>Sınav Seçin</h1>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <select
        className={styles.select}
        onChange={(e) => handleExamSelect(Number(e.target.value))}
        value={selectedExamId || ''}
      >
        <option value="" disabled>Bir sınav seçin</option>
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>{exam.title}</option>
        ))}
      </select>
      <button
        className={styles.startButton}
        onClick={() => selectedExamId && onSelect(selectedExamId)}
        disabled={!selectedExamId}
      >
        Sınava Başla
      </button>
    </div>
  );
};

export default ExamSelection;