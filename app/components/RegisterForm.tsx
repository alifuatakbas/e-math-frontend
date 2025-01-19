"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Register.module.css';
import { FiSun, FiMoon } from 'react-icons/fi';

const Register: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
   const theme = localStorage.getItem('theme');
  const isDark = theme === 'dark';
  setDarkMode(isDark);

  // Tema durumunu HTML'e yansıt
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
    document.body.style.backgroundColor = '#0F172A';
  } else {
    document.documentElement.classList.remove('dark-theme');
    document.body.style.backgroundColor = '#F8FAFC';
  }
}, []);

const toggleTheme = () => {
  setDarkMode(!darkMode);
  document.documentElement.classList.toggle('dark-theme');
  document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
  // Tema tercihini localStorage'a kaydet
  localStorage.setItem('theme', darkMode ? 'light' : 'dark');
};

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        setMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Kayıt başarısız.');
      }
    } catch (error) {
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.registerBox}>
        <h2 className={styles.title}>Kayıt Ol</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="ornek@email.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Şifre:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Kayıt Ol
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;