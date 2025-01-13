// pages/index.js
import Head from 'next/head';
import styles from './styles/Home.module.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Modern Website</title>
        <meta name="description" content="Modern ve şık bir website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}