import React, { useEffect, useState } from 'react';
import styles from '../styles/SubmitExam.module.css';

interface Question {
  id: number;
  text: string;
  options: string[];
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
  const [isShowingAlert, setIsShowingAlert] = useState(false);

  // Sınav durumunu kontrol et
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

  // Sekme değişimi ve pencere odak kontrolü için useEffect
  useEffect(() => {
    if (examStarted) {
      const handleFocusChange = async () => {
        // Eğer zaten alert gösteriliyorsa veya son uyarıdan bu yana 1 saniye geçmediyse işlem yapma
        if (isShowingAlert || Date.now() - lastSwitchTime < 1000) {
          return;
        }

        // Sayfa odağını kaybettiğinde
        if (!document.hasFocus()) {
          const newCount = tabSwitchCount + 1;

          // İlk ihlal değilse devam et
          if (newCount > 1) {
            setIsShowingAlert(true);
            setTabSwitchCount(newCount);
            setLastSwitchTime(Date.now());

            alert(`Uyarı: Sınav sayfasından ayrıldınız! (${newCount}/3)\nBaşka sekme veya uygulamaya geçmek yasaktır.`);
            setIsShowingAlert(false);

            if (newCount >= 3) {
              alert('Maksimum ihlal sayısına ulaştınız. Sınavınız sonlandırılıyor.');
              await handleSubmit();
            }
          } else {
            // İlk ihlalde sadece sayacı artır ve uyarı ver
            setTabSwitchCount(newCount);
            setLastSwitchTime(Date.now());
            setIsShowingAlert(true);
            alert('İlk Uyarı: Lütfen sınav sırasında başka sekme veya uygulamaya geçmeyiniz.');
            setIsShowingAlert(false);
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
  }, [examStarted, tabSwitchCount, lastSwitchTime, isShowingAlert]);

  // Initial load
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

        if (examData.has_been_taken && !statusData?.is_started) {
          setError('Bu sınav zaten tamamlanmış.');
          return;
        }

        setExam(examData);
      } catch (error) {
        console.error('Error initializing exam:', error);
        setError('Sınav yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    initializeExam();
  }, [examId]);

  // Timer and status check
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

  const handleOptionChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    localStorage.setItem(`exam_${examId}_answers`, JSON.stringify({
      ...answers,
      [questionId]: optionId
    }));
  };

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
      setIsShowingAlert(false);

      const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      setError('Sınav başlatılırken bir hata oluştu');
    }
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

      if (!response.ok) {
        if (data.correct_answers !== undefined) {
          setMessage(
            `Sınav sonlandırıldı. Sonuçlar: Doğru: ${data.correct_answers}, Yanlış: ${data.incorrect_answers}, 
             Başarı Yüzdesi: %${data.score_percentage.toFixed(2)}`
          );
        } else {
          throw new Error(data.detail || 'Sınav gönderilemedi');
        }
      } else {
        setMessage(
          `Sınav tamamlandı. Doğru: ${data.correct_answers}, Yanlış: ${data.incorrect_answers}, 
           Başarı Yüzdesi: %${data.score_percentage.toFixed(2)}`
        );
      }

      setExamStarted(false);
      localStorage.removeItem(`exam_${examId}_answers`);
      setAnswers({});
    } catch (error) {
      setError('Sınav gönderilirken bir hata oluştu');
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!exam) return <div>Sınav bulunamadı</div>;

  return (
    <div className={styles.submitExamContainer}>
      <h1>{exam.title}</h1>

      {!examStarted ? (
        <button onClick={handleStartExam} className={styles.startButton}>
          Sınava Başla
        </button>
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

      {message && <div className={styles.successMessage}>{message}</div>}
    </div>
  );
};

export default SubmitExam;