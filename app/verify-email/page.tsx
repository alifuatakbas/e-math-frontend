"use client"
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/VerifyEmail.module.css';

// Verification component
const VerificationComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = React.useState<string>('Email adresiniz doğrulanıyor...');

  React.useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Geçersiz doğrulama linki.');
        return;
      }

      try {
        const response = await fetch(`https://api.eolimpiyat.com/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email adresiniz başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');

          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
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
  );
};

// Loading component
const LoadingComponent = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Yükleniyor...</p>
    </div>
  );
};

// Ana component
const VerifyEmail = () => {
  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyBox}>
        <h2 className={styles.title}>Email Doğrulama</h2>
        <Suspense fallback={<LoadingComponent />}>
          <VerificationComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default VerifyEmail;