"use client";
import React, { useState, useEffect } from 'react';

const AddQuestion: React.FC = () => {
  const [exams, setExams] = useState<{ id: number; title: string }[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Sınavlar alınırken bir hata oluştu');
        }
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error('Sınavlar alınırken bir hata oluştu:', error);
        setError('Sınavlar alınırken bir hata oluştu.');
      }
    };

    fetchExams();
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (selectedExamId === null) {
      setError('Lütfen bir sınav seçin.');
      return;
    }

    try {
      // Query parametrelerini hazırla
      const queryParams = new URLSearchParams({
        text,
        correct_option_index: correctOptionIndex.toString()
      });

      // Her bir option için query parametresi ekle
      options.forEach(option => {
        queryParams.append('options', option);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-question/${selectedExamId}?${queryParams.toString()}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Soru eklenirken bir hata oluştu');
      }

      setMessage('Soru başarıyla eklendi');
      setText('');
      setOptions(['', '', '', '', '']);
      setCorrectOptionIndex(0);
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
      console.error('Hata detayı:', error);
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Soru Ekle</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="exam-select" className="block mb-2 text-sm font-medium">Sınav Seçin</label>
          <select
            id="exam-select"
            value={selectedExamId || ''}
            onChange={(e) => setSelectedExamId(Number(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Bir sınav seçin</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="question-text" className="block mb-2 text-sm font-medium">Soru Metni</label>
          <input
            id="question-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Soru metnini girin"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`option-${index}`} className="block mb-2 text-sm font-medium">Seçenek {index + 1}</label>
            <input
              id={`option-${index}`}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Seçenek ${index + 1} girin`}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label htmlFor="correct-option" className="block mb-2 text-sm font-medium">Doğru Seçenek</label>
          <select
            id="correct-option"
            value={correctOptionIndex}
            onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((_, index) => (
              <option key={index} value={index}>Seçenek {index + 1}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Soru Ekle
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;