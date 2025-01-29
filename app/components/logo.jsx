"use client";
import React from 'react';

const Logo = () => {
  return (
    <svg
      width="150"
      height="50"
      viewBox="0 0 400 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50"
        y="80"
        fontFamily="Arial Black, sans-serif"
        fontSize="48"
        fontWeight="900"
        fill="currentColor"
      >
        E-OLİMPİYAT
      </text>
      <line
        x1="50"
        y1="100"
        x2="350"
        y2="100"
        stroke="currentColor"
        strokeWidth="3"
      />
      <text
        x="50"
        y="130"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fill="currentColor"
      >
        DERSHANE
      </text>
    </svg>
  );
};

export default Logo;