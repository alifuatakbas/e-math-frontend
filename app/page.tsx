// pages/index.js
import Head from 'next/head';
import styles from './styles/Home.module.css';  // styles path'i düzeltildi
import Navbar from './components/Navbar';       // component path'leri düzeltildi
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import SuccessStories from './components/SuccessStories';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Modern Website</title>
        <meta name="description" content="Modern ve şık bir website" />
        <link rel="icon" href="/app/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <Hero />
        <Features />
             <SuccessStories />
      </main>

      <Footer />
    </div>
  );
}