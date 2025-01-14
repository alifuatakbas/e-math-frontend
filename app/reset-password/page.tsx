'use client';

import dynamic from 'next/dynamic';

// ResetPassword component'ini dynamic import ile yükle
const ResetPassword = dynamic(() => import('../components/Reset-password'), {
    ssr: false // Server-side rendering'i devre dışı bırak
});

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ResetPassword />
        </main>
    );
}