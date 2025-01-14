import React, { useState, useEffect } from 'react';
import styles from '../styles/Reset-password.module.css';

interface ResetPasswordProps {
    token: string | null;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Geçersiz veya eksik token');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                        new_password: newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            setMessage('Şifreniz başarıyla güncellendi');
            setError('');

            // 3 saniye sonra login sayfasına yönlendir
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } catch (err: any) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Şifre Sıfırlama</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifre"
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifre (tekrar)"
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>
                    Şifreyi Güncelle
                </button>
            </form>
            {message && <p className={styles.success}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default ResetPassword;