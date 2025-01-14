'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Reset-password.module.css';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // URL'den token'ı al
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');
        setToken(tokenParam);
    }, []);

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

    if (!token) {
        return <div className={styles.container}>Token bulunamadı</div>;
    }

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
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifre (tekrar)"
                    required
                />
                <button type="submit">Şifreyi Güncelle</button>
            </form>
            {message && <p className={styles.success}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}