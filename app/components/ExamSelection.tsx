"use client"; // İstemci bileşeni olarak tanımlamak için

import React, { useEffect, useState } from 'react';
import styles from '../styles/ExamSelection.module.css'; // CSS modülünü içe aktar
import { ExamSCH } from '../schemas/schemas';  // Pydantic şemasını içe aktar

const ExamSelection: React.FC<{ onSelect: (examId: number) => void }> = ({ onSelect }) => {
  const [exams, setExams] = useState<ExamSCH[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token ile yetkilendirme
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

  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);
    onSelect(examId); // Seçilen sınavı üst bileşene ilet
  };

  return (
    <div className={styles.examSelectionContainer}>
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
        disabled={!selectedExamId} // Seçim yapılmadıysa butonu devre dışı bırak
      >
        Sınava Başla
      </button>
    </div>
  );
};

export default ExamSelection;