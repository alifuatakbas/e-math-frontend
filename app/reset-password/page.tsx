"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import ResetPassword from './../components/Reset-password';

const ResetPasswordPage: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tokenParam = searchParams.get('token');
        setToken(tokenParam);
    }, []);

    return (
        <div>
            <Head>
                <title>Şifre Sıfırlama</title>
                <meta name="description" content="Şifre sıfırlama sayfası" />
            </Head>

            <main>
                <ResetPassword token={token} />
            </main>
        </div>
    );
};

export default ResetPasswordPage;