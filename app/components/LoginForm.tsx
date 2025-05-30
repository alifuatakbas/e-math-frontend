"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';
import { FiSun, FiMoon } from 'react-icons/fi';
import Footer from '../components/Footer';

const Login: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // Yeni eklendi

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut tema durumunu kontrol et
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true); // Loading durumunu ekleyin
  setError('');
  setMessage('');

  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      // Başarılı giriş
      localStorage.setItem('token', data.access_token);
      setMessage('Giriş başarılı! Yönlendiriliyorsunuz...');

      // Kullanıcı bilgilerini al
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);

    } else {
      // Hata durumları
      if (data.detail === "Lütfen email adresinizi doğrulayın") {
        setError(
          'Lütfen giriş yapmadan önce email adresinizi doğrulayın. ' +
          'Doğrulama linkini kontrol edin veya spam klasörünüze bakın.'
        );
      } else if (data.detail === "Email veya şifre hatalı") {
        setError('Email veya şifre hatalı. Lütfen tekrar deneyin.');
      } else {
        setError(data.detail || 'Giriş başarısız.');
      }
    }
  } catch (error) {
    setError('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    setIsLoading(false); // Loading durumunu kapat
  }
};

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Lütfen email adresinizi girin');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçersiz email formatı');
      return;
    }

    try {
      console.log('Sending request to:', `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`);
      console.log('With email:', email);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        setMessage('Şifre sıfırlama linki email adresinize gönderildi');
        setError('');
      } else {
        setError(data.detail || 'Bu email adresi sistemde kayıtlı değil');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Bir hata oluştu, lütfen tekrar deneyin');
    }
  };

  return (
  <>
    <div className={styles.loginContainer}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.loginBox}>
        <h2 className={styles.title}>Giriş yap</h2>
        <form onSubmit={handleLogin} className={styles.form}>
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
          <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className={styles.forgotPasswordContainer}>
          <button
              onClick={handleForgotPassword}
              className={styles.forgotPasswordButton}
            type="button"
          >
            Şifremi Unuttum
          </button>
        </div>

       {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
          </div>
      <Footer />
    </>
  );
}; // Component'in kapanış süslü parantezi

export default Login; // Son satır