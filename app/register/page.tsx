// pages/register.tsx
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm'; // RegisterForm bileşenini ekledik

const Register = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Kayıt Ol</title>
        <meta name="description" content="Kayıt ol sayfası" />
        <link rel="icon" href="/app/favicon.ico" />
      </Head>



      <main className={styles.main}>
        <Navbar />
        <RegisterForm /> {/* Kayıt formunu buraya ekledik */}
      </main>

      <Footer />
    </div>
  );
};

export default Register;