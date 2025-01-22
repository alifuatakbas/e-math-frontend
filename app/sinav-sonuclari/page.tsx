'use client';

import React, { Suspense } from "react";
import ExamResult from "../components/ExamResult";
import Navbar from "../components/Navbar";
import { useSearchParams } from 'next/navigation';

// Sınav sonuçlarını gösteren ana bileşen
function ExamResultContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  if (!examId) {
    return <ExamResult />; // examId olmadan çağır, böylece completed exams listelenecek
  }

  return <ExamResult examId={parseInt(examId)} />;
}

// Ana sayfa bileşeni
const ExamResultsPage = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Suspense fallback={
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666'
          }}>
            Yükleniyor...
          </div>
        }>
          <ExamResultContent />
        </Suspense>
      </main>
    </div>
  );
};

export default ExamResultsPage;