'use client';

import React from "react";
import ExamResult from "../components/ExamResult";
import Navbar from "../components/Navbar";  // Navbar'ı import ediyoruz

const ExamResultsPage = () => {
  const examId = 1;

  return (
    <>
      <Navbar />
      <div className="exam-results-page">
        <ExamResult examId={examId} />
      </div>
    </>
  );
};

export default ExamResultsPage;