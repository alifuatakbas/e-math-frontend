'use client';

import React from "react";
import ExamResult from "../components/ExamResult";

// Page component'i için props tipini kaldırıyoruz
const ExamResultsPage = () => {
  const examId = 1; // Sabit değer veya başka bir şekilde alınan ID

  return (
    <div className="exam-results-page">
      <ExamResult examId={examId} />
    </div>
  );
};

export default ExamResultsPage;