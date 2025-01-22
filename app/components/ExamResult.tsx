"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/ExamResult.module.css";
import { FiCheckCircle, FiXCircle, FiSun, FiMoon, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exam-results/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Sonuç yüklenirken bir hata oluştu");

      const data = await response.json();
      setExamResult(data);
      setSelectedExamId(examId);
      setCurrentQuestionIndex(0); // Yeni sınav seçildiğinde ilk sorudan başla

    } catch (error) {
      setError("Sonuç yüklenemedi");
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
    return <div className={styles.loading}>Yükleniyor...</div>;
  }

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <h1 className={styles.title}>Sınav Sonuçlarım</h1>

      {error && <div className={styles.error}>{error}</div>}

      {!loading && completedExams.length === 0 && (
        <div className={styles.noExams}>
          Henüz çözülmüş sınav bulunmamaktadır.
        </div>
      )}

      {completedExams.length > 0 && (
        <div className={styles.examList}>
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className={`${styles.examCard} ${
                selectedExamId === exam.id ? styles.selected : ""
              }`}
              onClick={() => fetchExamResult(exam.id)}
            >
              <h3>{exam.title}</h3>
              {selectedExamId === exam.id && examResult && (
                <div className={styles.miniScore}>
                  %{examResult.score_percentage.toFixed(0)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {examResult && (
        <>
          <div className={styles.resultDetails}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <FiCheckCircle className={styles.statIcon} />
                <div className={styles.statValue}>{examResult.correct_answers}</div>
                <div className={styles.statLabel}>Doğru</div>
              </div>
              <div className={styles.statCard}>
                <FiXCircle className={styles.statIcon} />
                <div className={styles.statValue}>{examResult.incorrect_answers}</div>
                <div className={styles.statLabel}>Yanlış</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{examResult.total_questions}</div>
                <div className={styles.statLabel}>Toplam Soru</div>
              </div>
            </div>

            <div className={styles.scoreCircle}>
              <div className={styles.scoreValue}>
                %{examResult.score_percentage.toFixed(0)}
              </div>
              <div className={styles.scoreLabel}>Başarı</div>
            </div>
          </div>

          <div className={styles.questionsReview}>
            <h2>Soru Detayları</h2>

            <div className={styles.questionNavigation}>
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={styles.navButton}
              >
                <FiArrowLeft /> Önceki
              </button>
              <span className={styles.questionCounter}>
                Soru {currentQuestionIndex + 1} / {examResult.questions.length}
              </span>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === examResult.questions.length - 1}
                className={styles.navButton}
              >
                Sonraki <FiArrowRight />
              </button>
            </div>

            <div className={styles.questionCard}>
              <div className={`${styles.questionContent} ${
                examResult.questions[currentQuestionIndex].is_correct 
                  ? styles.correctAnswer 
                  : styles.incorrectAnswer
              }`}>
                <h3>Soru {currentQuestionIndex + 1}</h3>
                <p className={styles.questionText}>
                  {examResult.questions[currentQuestionIndex].question_text}
                </p>

                {examResult.questions[currentQuestionIndex].question_image && (
                  <div className={styles.imageContainer}>
                    <img
                      src={examResult.questions[currentQuestionIndex].question_image}
                      alt="Soru görseli"
                      className={styles.questionImage}
                    />
                  </div>
                )}

                <div className={styles.options}>
                  {examResult.questions[currentQuestionIndex].options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`${styles.option} 
                        ${optIndex === examResult.questions[currentQuestionIndex].correct_option ? styles.correctOption : ''}
                        ${optIndex === examResult.questions[currentQuestionIndex].student_answer ? styles.studentAnswer : ''}
                        ${optIndex === examResult.questions[currentQuestionIndex].student_answer && 
                          !examResult.questions[currentQuestionIndex].is_correct ? styles.wrongAnswer : ''}
                      `}
                    >
                      <span className={styles.optionIndex}>
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <span className={styles.optionText}>{option}</span>
                      {optIndex === examResult.questions[currentQuestionIndex].correct_option && (
                        <span className={styles.correctMark}>✓</span>
                      )}
                      {optIndex === examResult.questions[currentQuestionIndex].student_answer &&
                        !examResult.questions[currentQuestionIndex].is_correct && (
                        <span className={styles.wrongMark}>✗</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.answerStatus}>
                  {examResult.questions[currentQuestionIndex].is_correct ? (
                    <span className={styles.correct}>
                      <FiCheckCircle /> Doğru Cevap
                    </span>
                  ) : (
                    <span className={styles.incorrect}>
                      <FiXCircle /> Yanlış Cevap
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExamResult;