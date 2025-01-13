"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/ExamResult.module.css";

interface ExamResultProps {
  examId?: number; // Optional yaptık çünkü select ile de seçilebilir
}

interface Exam {
  id: number;
  title: string;
}

interface ExamResult {
  correct_answers: number;
  incorrect_answers: number;
  total_questions: number;
}

const ExamResult: React.FC<ExamResultProps> = ({ examId: propExamId }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(propExamId || null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [error, setError] = useState<string>("");

  // Sınav başlıklarını getirme
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Sınavlar alınırken bir hata oluştu");
        }

        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Hata:", error);
        setError("Sınavlar alınırken bir hata oluştu.");
      }
    };

    fetchExams();
  }, []);

  // Seçilen sınavın sonucunu getirme
  useEffect(() => {
    if (selectedExamId === null) return;

    const fetchExamResult = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exam-results/${selectedExamId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          console.log("Hata Detayı: ", data);
          throw new Error("Sonuç alınırken bir hata oluştu");
        }

        setExamResult(data);
      } catch (error) {
        console.error("Sonuç alınırken bir hata oluştu:", error);
        setError("Sonuç alınırken bir hata oluştu.");
      }
    };

    fetchExamResult();
  }, [selectedExamId]);

  // Props'tan gelen examId değiştiğinde selectedExamId'yi güncelle
  useEffect(() => {
    if (propExamId) {
      setSelectedExamId(propExamId);
    }
  }, [propExamId]);

  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);
    setExamResult(null);
  };

  return (
    <div className={styles.examResultContainer}>
      <h1 className={styles.title}>Sınav Sonucu Görüntüle</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {!propExamId && ( // Eğer props'tan examId gelmemişse select göster
        <select
          className={styles.select}
          onChange={(e) => handleExamSelect(Number(e.target.value))}
          value={selectedExamId || ""}
        >
          <option value="" disabled>
            Bir sınav seçin
          </option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      )}

      {examResult ? (
        <div className={styles.resultContainer}>
          <h3>Sonuçlar</h3>
          <p>Doğru Cevaplar: {examResult.correct_answers}</p>
          <p>Yanlış Cevaplar: {examResult.incorrect_answers}</p>
          <p>Toplam Sorular: {examResult.total_questions}</p>
        </div>
      ) : (
        selectedExamId && (
          <div className={styles.errorMessage}>
            Sınav sonucu bulunamadı. Lütfen tekrar deneyin.
          </div>
        )
      )}
    </div>
  );
};

export default ExamResult;