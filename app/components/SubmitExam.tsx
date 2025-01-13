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
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number;
}

interface QuestionAnswerSubmission {
  question_id: number;
  selected_option_id: number;
}

interface ExamSubmission {
  answers: QuestionAnswerSubmission[];
}

interface TimeCheckResponse {
  remaining_minutes: number;
  can_start: boolean;
  message: string;
}

const SubmitExam: React.FC<{ examId: number }> = ({ examId }) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [canStart, setCanStart] = useState<boolean>(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching exam');
        }
        const data = await response.json();
        setExam(data);
      } catch (error) {
        console.error('Error fetching exam:', error);
        setError('Error fetching exam.');
      }
    };

    const checkTime = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/${examId}/time-check`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data: TimeCheckResponse = await response.json();
        setRemainingTime(data.remaining_minutes);
        setCanStart(data.can_start);
        setMessage(data.message);
      } catch (error) {
        console.error('Error checking time:', error);
      }
    };

    fetchExam();
    checkTime();
    const timer = setInterval(checkTime, 60000); // Her dakika başı kalan süreyi kontrol et

    return () => clearInterval(timer); // Temizleme
  }, [examId]);

  const handleOptionChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const submission: ExamSubmission = {
      answers: Object.entries(answers).map(([question_id, selected_option_id]) => ({
        question_id: Number(question_id),
        selected_option_id,
      })),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-exam/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(submission),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error submitting exam');
      }

      setMessage(`Sınav başarıyla tamamlandı. Doğru Cevaplar: ${data.correct_answers}, Yanlış cevaplar: ${data.incorrect_answers}`);
      setAnswers({});
    } catch (error) {
      setError('Error submitting exam');
    }
  };

  const handleStartExam = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/start-exam/${examId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setExam((prevExam) => ({
          ...prevExam!,
          start_time: data.start_time,
          end_time: data.end_time,
        }));
        setMessage('Sınav başarıyla başlatıldı');
      } else {
        throw new Error(data.detail || 'Error starting exam');
      }
    } catch (error) {
      setError('Error starting exam');
    }
  };

  if (error) return <div className={styles.errorMessage}>{error}</div>;

  if (!exam) return <div>Loading...</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className={styles.submitExamContainer}>
      <h1>{exam.title}</h1>
      <div className={styles.timeContainer}>
        {canStart ? (
          <div>
            <button onClick={handleStartExam}>Sınavı Başlat</button>
            <div>{message}</div>
          </div>
        ) : (
          <div>Kalan Süre: {remainingTime} dakika</div>
        )}
      </div>
      <div className={styles.questionContainer}>
        <h3>{currentQuestion.text}</h3>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`question-${currentQuestion.id}-option-${index}`}
              name={`question-${currentQuestion.id}`}
              value={index}
              onChange={() => handleOptionChange(currentQuestion.id, index)}
              checked={answers[currentQuestion.id] === index}
            />
            <label htmlFor={`question-${currentQuestion.id}-option-${index}`}>{option}</label>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Önceki Soru
        </button>
        <button
          onClick={handleNextQuestion}
          className={currentQuestionIndex < (exam.questions.length - 1) ? '' : styles.submitButton}
        >
          {currentQuestionIndex < (exam.questions.length - 1) ? 'Sonraki Soru' : 'Sınavı Bitir'}
        </button>
      </div>
      {message && <div className={styles.successMessage}>{message}</div>}
    </div>
  );
};

export default SubmitExam;
