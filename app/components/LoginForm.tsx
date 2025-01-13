// components/Login.tsx
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setMessage('Login successful!');

        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.loginContainer}>
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
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>Login</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;