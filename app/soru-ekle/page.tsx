"use client";

import React from 'react';
import AddQuestion from '../components/AddQuestion';

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10">Sınav Yönetim Sistemi</h1>
      {/* Buradaki examId'yı kaldırdık çünkü AddQuestion bileşeninde sınav seçmek zorunlu olacak */}
      <AddQuestion />
    </div>
  );
};

export default Home;
