"use client";

import React from 'react';
import AddQuestion from '../components/AddQuestion';

const Home = () => {
  const examId = 1; // Örnek sınav ID'si

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10">Sınav Yönetim Sistemi</h1>
      <AddQuestion examId={examId} />
    </div>
  );
};

export default Home;