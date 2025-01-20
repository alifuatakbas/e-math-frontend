import React, { useEffect, useState } from 'react';
import styles from '../styles/SubmitExam.module.css';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  options: string[];
  image?: string;
}

interface Exam {
  id: number;
  title: string;
  questions: Question[];
  has_been_taken: boolean;
}

interface QuestionAnswerSubmission {
  question_id: number;
  selected_option_id: number;
}

interface ExamSubmission {
  answers: QuestionAnswerSubmission[];
}

interface ExamTimeResponse {
  is_started: boolean;
  remaining_minutes: number | null;
  message: string;
  start_time?: string;
  end_time?: string;
}

const ExamCompletionScreen: React.FC<{
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  scorePercentage: number;
}> = ({ correctAnswers, incorrectAnswers, totalQuestions, scorePercentage }) => {
  return (
    <div className={styles.completionContainer}>
      <div className={styles.completionCard}>
        <div className={styles.completionHeader}>
          <h2>Tebrikler! 🎉</h2>
          <p>Sınavı başarıyla tamamladınız</p>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{correctAnswers}</div>
            <div className={styles.statLabel}>Doğru</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{incorrectAnswers}</div>
            <div className={styles.statLabel}>Yanlış</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{totalQuestions}</div>
            <div className={styles.statLabel}>Toplam Soru</div>
          </div>
        </div>

        <div className={styles.scoreCircle}>
          <div className={styles.scoreValue}>
            %{scorePercentage.toFixed(1)}
          </div>
          <div className={styles.scoreLabel}>Başarı</div>
        </div>

        <Link href="/" className={styles.returnButton}>
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

const WarningModal: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <button onClick={onClose}>Tamam</button>
      </div>
    </div>
  );
};

const SubmitExam: React.FC<{ examId: number }> = ({ examId }) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState(0);
  const [isExamTerminated, setIsExamTerminated] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [pendingViolation, setPendingViolation] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState<{
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;
    scorePercentage: number;
  } | null>(null);

  const checkExamStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exam-time/${examId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Sınav durumu kontrol edilemedi');

      const data: ExamTimeResponse = await response.json();

      if (data.is_started) {
        setExamStarted(true);
        if (data.remaining_minutes !== null) {
          setTimeLeft(data.remaining_minutes * 60);
        }
        if (data.remaining_minutes === 0) {
          handleSubmit();
        }
      }

      return data;
    } catch (error) {
      console.error('Error checking exam status:', error);
      setError('Sınav durumu kontrol edilirken bir hata oluştu');
      return null;
    }
  };

  useEffect(() => {
    if (examStarted && !isExamTerminated) {
      const handleFocusChange = async () => {
        if (isExamTerminated) return;

        if (!document.hasFocus()) {
          if (Date.now() - lastSwitchTime < 1000) return;

          if (showWarning) {
            setPendingViolation(true);
            return;
          }

          const newCount = tabSwitchCount + 1;
          setTabSwitchCount(newCount);
          setLastSwitchTime(Date.now());

          if (newCount === 1) {
            setWarningMessage('İlk Uyarı: Lütfen sınav sırasında başka sekme veya uygulamaya geçmeyiniz.');
            setShowWarning(true);
          } else if (newCount < 3) {
            setWarningMessage(`Uyarı: Sınav sayfasından ayrıldınız! (${newCount}/3)\nBaşka sekme veya uygulamaya geçmek yasaktır.`);
            setShowWarning(true);
          } else {
            setWarningMessage('Maksimum ihlal sayısına ulaştınız. Sınavınız sonlandırılıyor.');
            setShowWarning(true);
            setIsExamTerminated(true);
            await handleSubmit();
          }
        }
      };

      window.addEventListener('blur', handleFocusChange);
      document.addEventListener('visibilitychange', handleFocusChange);

      return () => {
        window.removeEventListener('blur', handleFocusChange);
        document.removeEventListener('visibilitychange', handleFocusChange);
      };
    }
  }, [examStarted, tabSwitchCount, lastSwitchTime, isExamTerminated, showWarning]);

  useEffect(() => {
    if (examStarted && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === null || prevTime <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      const statusCheck = setInterval(async () => {
        const status = await checkExamStatus();
        if (status?.remaining_minutes === 0) {
          clearInterval(timer);
          clearInterval(statusCheck);
          handleSubmit();
        }
      }, 30000);

      return () => {
        clearInterval(timer);
        clearInterval(statusCheck);
      };
    }
  }, [examStarted, timeLeft]);

   useEffect(() => {
  const initializeExam = async () => {
    try {
      const statusData = await checkExamStatus();

      const examResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!examResponse.ok) throw new Error('Sınav verileri alınamadı');

      const examData = await examResponse.json();

      // Debug için ekleyin
      console.log('Sınav verileri:', examData);
      console.log('İlk sorunun resmi:', examData.questions[0]?.image);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

        if (examData.has_been_taken && !statusData?.is_started) {
          setError('Bu sınav zaten tamamlanmış.');
          return;
        }

        setExam(examData);

        if (statusData?.is_started) {
          setExamStarted(true);
          if (statusData.remaining_minutes !== null) {
            setTimeLeft(statusData.remaining_minutes * 60);
          }
          const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }
        }

      } catch (error) {
        console.error('Error initializing exam:', error);
        setError('Sınav yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    initializeExam();
  }, [examId]);

  const handleStartExam = async () => {
    const confirmed = window.confirm(
      'Önemli Uyarı:\n\n' +
      '1. Sınav sırasında başka sekmeye veya uygulamaya geçmek yasaktır.\n' +
      '2. 3 kez ihlal durumunda sınavınız otomatik olarak sonlandırılacaktır.\n' +
      '3. Lütfen sınav süresince bu sekmede kalın.\n\n' +
      'Sınavı başlatmak istiyor musunuz?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/start-exam/${examId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Sınav başlatılamadı');

      const data = await response.json();
      setTimeLeft(data.remaining_minutes * 60);
      setExamStarted(true);
      setTabSwitchCount(0);
      setLastSwitchTime(0);
      setIsExamTerminated(false);
      setShowWarning(false);
      setPendingViolation(false);

      const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      setError('Sınav başlatılırken bir hata oluştu');
    }
  };
    const handleWarningClose = () => {
    setShowWarning(false);
    if (pendingViolation) {
      setPendingViolation(false);
      const newCount = tabSwitchCount + 1;
      setTabSwitchCount(newCount);

      if (newCount >= 3) {
        setWarningMessage('Maksimum ihlal sayısına ulaştınız. Sınavınız sonlandırılıyor.');
        setShowWarning(true);
        setIsExamTerminated(true);
        handleSubmit();
      } else {
        setWarningMessage(`Uyarı: Sınav sayfasından ayrıldınız! (${newCount}/3)\nBaşka sekme veya uygulamaya geçmek yasaktır.`);
        setShowWarning(true);
      }
    }
  };

  const handleOptionChange = (questionId: number, optionIndex: number) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: optionIndex };
      localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      const submission: ExamSubmission = {
        answers: Object.entries(answers).map(([question_id, selected_option_id]) => ({
          question_id: Number(question_id),
          selected_option_id,
        })),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit-exam/${examId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(submission),
        }
      );

      const data = await response.json();

      if (!response.ok && !data.correct_answers) {
        throw new Error(data.detail || 'Sınav gönderilemedi');
      }

      setExamResults({
        correctAnswers: data.correct_answers,
        incorrectAnswers: data.incorrect_answers,
        totalQuestions: data.total_questions,
        scorePercentage: data.score_percentage
      });

      setExamCompleted(true);
      setExamStarted(false);
      setIsExamTerminated(true);

      localStorage.removeItem(`exam_${examId}_answers`);
      setAnswers({});
      setShowWarning(false);
      setPendingViolation(false);
      setTabSwitchCount(0);
      setLastSwitchTime(0);
    } catch (error) {
      setError('Sınav gönderilirken bir hata oluştu');
    }
  };

    if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!exam) return <div>Sınav bulunamadı</div>;

  if (examCompleted && examResults) {
    return <ExamCompletionScreen {...examResults} />;
  }

  return (
    <div className={styles.submitExamContainer}>
      <h1>{exam.title}</h1>

    {!examStarted ? (
  <div className={styles.examStartContainer}>
    <h1 className={styles.examTitle}>{exam.title}</h1>
    <div className={styles.examInfo}>
      <div className={styles.examInfoItem}>
        <span>Toplam Soru</span>
        <span>{exam.questions.length}</span>
      </div>
      <div className={styles.examInfoItem}>
        <span>Sınav Süresi</span>
        <span>90 Dakika</span>
      </div>
    </div>
    <div className={styles.examWarning}>
      <p>⚠️ Sınav başladıktan sonra:</p>
      <ul>
        <li>Başka sekmeye geçiş yapılamaz</li>
        <li>3 ihlal sonrası sınav sonlandırılır</li>
        <li>Süre bitiminde otomatik gönderilir</li>
      </ul>
    </div>
    <button onClick={handleStartExam} className={styles.startButton}>
      Sınava Başla
    </button>
  </div>
) : (
        <>
          <div className={styles.timer}>
            Kalan Süre: {Math.floor(timeLeft! / 60)}:{String(timeLeft! % 60).padStart(2, '0')}
          </div>

          <div className={styles.progress}>
            Soru {currentQuestionIndex + 1} / {exam.questions.length}
          </div>

          <div className={styles.questionContainer}>
            <h3>{exam.questions[currentQuestionIndex].text}</h3>

            {/* Soru resmi varsa göster */}
        {exam.questions[currentQuestionIndex].image && (
  <div className={styles.questionImage}>
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL}/static${exam.questions[currentQuestionIndex].image}`}
      alt="Soru görseli"
      className={styles.questionImg}
      onError={(e) => {
        console.error('Resim yükleme hatası:', e);
        console.log('Denenen URL:', `${process.env.NEXT_PUBLIC_API_URL}/static${exam.questions[currentQuestionIndex].image}`);
      }}
    />
  </div>
)}

            {exam.questions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className={styles.optionContainer}>
                <input
                  type="radio"
                  id={`question-${currentQuestionIndex}-option-${index}`}
                  name={`question-${currentQuestionIndex}`}
                  value={index}
                  onChange={() => handleOptionChange(exam.questions[currentQuestionIndex].id, index)}
                  checked={answers[exam.questions[currentQuestionIndex].id] === index}
                />
                <label htmlFor={`question-${currentQuestionIndex}-option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Önceki Soru
            </button>
            <button
              onClick={() => {
                if (currentQuestionIndex === exam.questions.length - 1) {
                  handleSubmit();
                } else {
                  setCurrentQuestionIndex(prev => prev + 1);
                }
              }}
            >
              {currentQuestionIndex === exam.questions.length - 1 ? 'Sınavı Bitir' : 'Sonraki Soru'}
            </button>
          </div>
        </>
      )}

      {showWarning && (
        <WarningModal
          message={warningMessage}
          onClose={handleWarningClose}
        />
      )}

      {message && <div className={styles.successMessage}>{message}</div>}
    </div>
  );
};

export default SubmitExam;