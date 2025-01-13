// pages/login.tsx
import Head from 'next/head';
import LoginForm from '../components/LoginForm';
import Navbar from "@/app/components/Navbar";

const LoginPage = () => {
    return (

        <div>
            <Head>
                <title>Giriş Yap</title>
                <meta name="description" content="Giriş yap sayfası" />
            </Head>
            <Navbar />
            <LoginForm />
        </div>
    );
};

export default LoginPage;