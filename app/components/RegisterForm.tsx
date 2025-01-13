"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Register.module.css';

const Register: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMessage('');

    // FormData yerine JSON kullanıyoruz
    const userData = {
      full_name: fullName,
      email: email,
      password: password
    };

    try {
      const response = await fetch(`https://backend-emath-production.up.railway.app/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Kayıt başarılı!');

        // Yönlendirme öncesi kısa bir bekleme
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(data.detail || 'Kayıt başarısız.');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h2 className={styles.title}>Kaydol</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName" className={styles.label}>Adınız:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={styles.input}
              placeholder="Adınızı girin"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Email adresinizi girin"
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
              placeholder="Şifrenizi girin"
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Kaydol
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;