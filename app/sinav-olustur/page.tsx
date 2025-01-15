// sinav-olustur/page.tsx
import Head from 'next/head';
import CreateExam from '../components/CreateExam';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Sınav Oluştur</title>
        <meta name="description" content="Sınav oluşturma sayfası" />
      </Head>

      <main>
        <CreateExam />
      </main>
    </div>
  );
};

export default Home;