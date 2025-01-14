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

const SubmitExam: React.FC<{ examId: number }> = ({ examId }) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);

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

        if (data.has_been_taken) {
          setError('Bu sınav zaten çözülmüş.');
          return;
        }

        setExam(data);
      } catch (error) {
        console.error('Error fetching exam:', error);
        setError('Sınav verisi yüklenirken bir hata oluştu.');
      }
    };

    fetchExam();
  }, [examId]);

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

      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft]);

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
      setError('Sınav gönderilirken bir hata oluştu.');
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

      if (!response.ok) {
        throw new Error('Error starting exam');
      }

      const data = await response.json();
      const endTime = new Date(data.end_time).getTime();
      const currentTime = new Date().getTime();
      const timeLeftInSeconds = Math.floor((endTime - currentTime) / 1000);

      setTimeLeft(timeLeftInSeconds);
      setExamStarted(true);
    } catch (error) {
      console.error('Error starting exam:', error);
      setError('Sınav başlatılırken bir hata oluştu.');
    }
  };

  if (error) return <div className={styles.errorMessage}>{error}</div>;

  if (!exam) return <div>Loading...</div>;

  if (!examStarted) {
    return (
      <div className={styles.submitExamContainer}>
        <h1>{exam.title}</h1>
        <button onClick={handleStartExam} className={styles.startButton}>
          Sınava Başla
        </button>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className={styles.submitExamContainer}>
      <h1>{exam.title}</h1>
      <div className={styles.timer}>
        Kalan Süre: {Math.floor(timeLeft! / 60)}:{timeLeft! % 60}
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