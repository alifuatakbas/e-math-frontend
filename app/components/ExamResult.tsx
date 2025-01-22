"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/ExamResult.module.css";
import { FiCheckCircle, FiXCircle, FiSun, FiMoon, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from "framer-motion";

interface ExamResultProps {
  examId?: number;
}

interface Exam {
  id: number;
  title: string;
  has_been_taken: boolean;
}

interface QuestionResult {
  question_text: string;
  question_image?: string;
  options: string[];
  correct_option: number;
  student_answer: number | null;
  is_correct: boolean;
}

interface ExamResult {
  correct_answers: number;
  incorrect_answers: number;
  total_questions: number;
  score_percentage: number;
  questions: QuestionResult[];
}

const ExamResult: React.FC<ExamResultProps> = ({ examId: propExamId }) => {
  const [completedExams, setCompletedExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(propExamId || null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      document.body.style.backgroundColor = '#0F172A';
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#F8FAFC';
    }
  }, [darkMode]);
  useEffect(() => {
    if (propExamId) {
      fetchExamResult(propExamId);
    }
  }, [propExamId]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  useEffect(() => {
    const fetchCompletedExams = async () => {
      try {
        setLoading(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/completed-exams`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
        );

        if (!response.ok) throw new Error("Sınavlar yüklenirken bir hata oluştu");

        const data = await response.json();
        setCompletedExams(data);
      } catch (error) {
        setError("Sınavlar yüklenemedi");
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedExams();
  }, []);

  const fetchExamResult = async (examId: number) => {
  try {
    setLoading(true);
    setError(""); // Yeni request'te error'u temizle

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/exam-results/${examId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Sonuç yüklenirken bir hata oluştu");
    }

    const data = await response.json();
    setExamResult(data);
    setSelectedExamId(examId);
    setCurrentQuestionIndex(0);

  } catch (error) {
    setError(error instanceof Error ? error.message : "Sonuç yüklenemedi");
    console.error("Hata:", error);
  } finally {
    setLoading(false);
  }
};

  const handleNextQuestion = () => {
    if (examResult && currentQuestionIndex < examResult.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

if (loading) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Yükleniyor...
      </div>
    </div>
  );
}

 return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      <button
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>

      <div className={styles.header}>
      <h1>Sınav Sonuçlarım</h1>

      {!selectedExamId && completedExams.length > 0 && (
        <div className={styles.examList}>
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className={styles.examCard}
              onClick={() => fetchExamResult(exam.id)}
            >
              <h3>{exam.title}</h3>
            </div>
          ))}
        </div>
      )}
        {examResult && (
          <div className={styles.overallScore}>
            <div className={styles.scoreRing}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={examResult.score_percentage >= 50 ? "#4CAF50" : "#FF5252"}
                  strokeWidth="3"
                  strokeDasharray={`${examResult.score_percentage}, 100`}
                />
                <text x="18" y="20.35" className={styles.percentage}>
                  {examResult.score_percentage.toFixed(0)}%
                </text>
              </svg>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <FiCheckCircle className={styles.correctIcon} />
                <span>{examResult.correct_answers} Doğru</span>
              </div>
              <div className={styles.stat}>
                <FiXCircle className={styles.wrongIcon} />
                <span>{examResult.incorrect_answers} Yanlış</span>
              </div>
              <div className={styles.stat}>
                <span>{examResult.total_questions} Toplam Soru</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.examContent}>
        {examResult && (
          <motion.div
            className={styles.questionContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className={styles.navigation}>
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={styles.navButton}
              >
                <FiArrowLeft /> Önceki
              </button>
              <span>Soru {currentQuestionIndex + 1} / {examResult.questions.length}</span>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === examResult.questions.length - 1}
                className={styles.navButton}
              >
                Sonraki <FiArrowRight />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={styles.questionCard}
              >
                <div className={styles.questionHeader}>
                  <h3>Soru {currentQuestionIndex + 1}</h3>
                  {renderQuestionStatus(examResult.questions[currentQuestionIndex])}
                </div>

                <p className={styles.questionText}>
                  {examResult.questions[currentQuestionIndex].question_text}
                </p>

                {examResult.questions[currentQuestionIndex].question_image && (
                  <img
                    src={examResult.questions[currentQuestionIndex].question_image}
                    alt="Soru görseli"
                    className={styles.questionImage}
                  />
                )}

                <div className={styles.options}>
                  {renderOptions(examResult.questions[currentQuestionIndex])}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Yardımcı fonksiyonlar
const renderQuestionStatus = (question: QuestionResult) => {
  if (question.is_correct) {
    return (
      <div className={styles.statusCorrect}>
        <FiCheckCircle /> Doğru Cevap
      </div>
    );
  } else if (question.student_answer === null) {
    return (
      <div className={styles.statusUnanswered}>
        <FiXCircle /> Cevaplanmamış
      </div>
    );
  } else {
    return (
      <div className={styles.statusWrong}>
        <FiXCircle /> Yanlış Cevap
      </div>
    );
  }
};

const renderOptions = (question: QuestionResult) => {
  return question.options.map((option, index) => {
     const isCorrectOption = index === question.correct_option + 1;
    const isStudentAnswer = index === (question.student_answer ? question.student_answer + 1 : null);

    let optionClass = styles.option;
    if (isCorrectOption) {
      // Doğru cevap her zaman yeşil olmalı
      optionClass += ` ${styles.correctOption}`;
    }
    if (isStudentAnswer && !isCorrectOption) {
      // Öğrencinin yanlış cevabı kırmızı olmalı
      optionClass += ` ${styles.wrongOption}`;
    }

    return (
      <div key={index} className={optionClass}>
        <span className={styles.optionLetter}>
          {String.fromCharCode(65 + index)}
        </span>
        <span className={styles.optionText}>{option}</span>
        {isCorrectOption && <FiCheckCircle className={styles.optionIcon} />}
        {isStudentAnswer && !isCorrectOption && <FiXCircle className={styles.optionIcon} />}
      </div>
    );
  });
};

export default ExamResult;