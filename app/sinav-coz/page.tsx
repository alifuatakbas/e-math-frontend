"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import ExamSelection from '../components/ExamSelection';
import SubmitExam from '../components/SubmitExam';

const HomePage: React.FC = () => {
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);
  };

  return (
    <div>
      <Head>
        <title>Sınav Gönder</title>
        <meta name="description" content="Sınav gönderme sayfası" />
      </Head>

      <main>
        {!selectedExamId ? (
          <ExamSelection onSelect={handleExamSelect} />
        ) : (
          <SubmitExam examId={selectedExamId} />
        )}
      </main>
    </div>
  );
};

export default HomePage;