'use client';

import React from "react";
import ExamResult from "../components/ExamResult";
import Navbar from "../components/Navbar";

const ExamResultsPage = () => {
  const examId = 1;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <ExamResult examId={examId} />
      </main>
    </div>
  );
};

export default ExamResultsPage;