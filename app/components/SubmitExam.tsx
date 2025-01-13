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
  ends_at: string; // Add this field to get the end time of the exam
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
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

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

        // Calculate remaining time
        const endTime = new Date(data.ends_at).getTime();
        const now = new Date().getTime();
        setRemainingTime(Math.max(0, endTime - now));
      } catch (error) {
        console.error('Error fetching exam:', error);
        setError('Error fetching exam.');
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (remainingTime !== null) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => (prev !== null ? prev - 1000 : null));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

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

  if (error) return <div className={styles.errorMessage}>{error}</div>;

  if (!exam) return <div>Loading...</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.submitExamContainer}>
      <h1>{exam.title}</h1>
      <div className={styles.timerContainer}>
        <h2>Kalan Süre: {remainingTime !== null ? formatTime(remainingTime) : '00:00'}</h2>
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