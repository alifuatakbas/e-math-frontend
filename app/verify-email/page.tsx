"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/VerifyEmail.module.css';  // Stil dosyasını oluşturacağız

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('Email adresiniz doğrulanıyor...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Geçersiz doğrulama linki.');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-email?token=${token}`, {
          method: 'GET',
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email adresiniz başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');

          // 3 saniye sonra login sayfasına yönlendir
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(data.detail || 'Doğrulama işlemi başarısız oldu.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyBox}>
        <h2 className={styles.title}>Email Doğrulama</h2>

        <div className={styles.statusContainer}>
          {status === 'verifying' && (
            <div className={styles.loadingSpinner}></div>
          )}

          {status === 'success' && (
            <div className={styles.successIcon}>✓</div>
          )}

          {status === 'error' && (
            <div className={styles.errorIcon}>✗</div>
          )}

          <p className={`${styles.message} ${styles[status]}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;