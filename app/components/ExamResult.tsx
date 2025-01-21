"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/ExamResult.module.css";

interface ExamResultProps {
  examId?: number;
}

interface Exam {
  id: number;
  title: string;
}

interface ExamResult {
  correct_answers: number;
  incorrect_answers: number;
  total_questions: number;
  score_percentage: number; // Yüzdelik skoru da ekleyelim
}

const ExamResult: React.FC<ExamResultProps> = ({ examId: propExamId }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(propExamId || null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Sınavları getirme
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Oturum bulunamadı");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Sınavlar alınırken bir hata oluştu");
        }

        const data = await response.json();
        setExams(data);
      } catch (error: any) {
        console.error("Sınavlar alınırken hata:", error);
        setError(error.message || "Sınavlar alınırken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Sınav sonucunu getirme
  useEffect(() => {
    const fetchExamResult = async () => {
      if (!selectedExamId) return;

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Oturum bulunamadı");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exam-results/${selectedExamId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Sonuç alınırken bir hata oluştu");
        }

        setExamResult(data);
      } catch (error: any) {
        console.error("Sonuç alınırken hata:", error);
        setError(error.message || "Sonuç alınırken bir hata oluştu");
        setExamResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [selectedExamId]);

  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);
    setExamResult(null);
    setError("");
  };

  if (loading) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }

  return (
    <div className={styles.examResultContainer}>
      <h1 className={styles.title}>Sınav Sonucu</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {!propExamId && (
        <div className={styles.selectContainer}>
          <select
            className={styles.select}
            onChange={(e) => handleExamSelect(Number(e.target.value))}
            value={selectedExamId || ""}
          >
            <option value="">Sınav Seçin</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {examResult && (
        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Doğru</span>
              <span className={styles.statValue}>{examResult.correct_answers}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Yanlış</span>
              <span className={styles.statValue}>{examResult.incorrect_answers}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Toplam</span>
              <span className={styles.statValue}>{examResult.total_questions}</span>
            </div>
            <div className={styles.scorePercentage}>
              Başarı: %{((examResult.correct_answers / examResult.total_questions) * 100).toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResult;