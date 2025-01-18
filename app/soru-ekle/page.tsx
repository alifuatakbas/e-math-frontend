"use client";

import React, { useState, useEffect } from 'react';
import AddQuestion from '../components/AddQuestion';

const Home = () => {
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [exams, setExams] = useState<Array<{ id: number; title: string }>>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setExams(data);
        }
      } catch (error) {
        console.error('Sınavlar yüklenirken hata:', error);
      }
    };

    fetchExams();
  }, []);

  const handleQuestionAdded = () => {
    alert('Soru başarıyla eklendi!');
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mt-10">Sınav Yönetim Sistemi</h1>
      
      {/* Sınav seçme dropdown'ı */}
      <div className="my-6">
        <select 
          className="w-full p-2 border rounded-md"
          value={selectedExamId || ''}
          onChange={(e) => setSelectedExamId(Number(e.target.value))}
        >
          <option value="">Sınav Seçin</option>
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      {selectedExamId ? (
        <AddQuestion 
          examId={selectedExamId} 
          onQuestionAdded={handleQuestionAdded}
        />
      ) : (
        <div className="text-center text-gray-600 mt-4 p-4 bg-gray-100 rounded-md">
          Lütfen soru eklemek için bir sınav seçin
        </div>
      )}
    </div>
  );
};

export default Home;