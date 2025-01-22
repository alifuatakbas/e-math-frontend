'use client';

import React from "react";
import ExamResult from "../components/ExamResult";
import Navbar from "../components/Navbar";
import { useSearchParams } from 'next/navigation';

const ExamResultsPage = () => {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  if (!examId) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main className="container">
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666'
          }}>
            Sınav sonucu bulunamadı.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <ExamResult examId={parseInt(examId)} />
      </main>
    </div>
  );
};

export default ExamResultsPage;