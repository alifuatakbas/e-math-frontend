"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiEye } from 'react-icons/fi';
import styles from '../styles/AdminPanel.module.css';
import Navbar from '../components/Navbar';

interface User {
  id: number;
  full_name: string;
  email: string;
  school_name: string;
  branch: string;
  role: string;
}

interface ExamResult {
  id: number;
  user_id: number;
  exam_id: number;
  correct_answers: number;
  incorrect_answers: number;
  completed: boolean;
  start_time: string;
  end_time: string;
  user: User;
  exam: {
    id: number;
    title: string;
  };
}

interface Answer {
  id: number;
  question_id: number;
  selected_option: number;
  is_correct: boolean;
  question: {
    id: number;
    text: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    option_5: string;
    correct_option_id: number;
  };
}

const AdminPanel = () => {
  const router = useRouter();
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [exams, setExams] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [answerDetails, setAnswerDetails] = useState<Answer[]>([]);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  useEffect(() => {
    filterResults();
  }, [examResults, selectedGrade, searchTerm, selectedExam]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        if (user.role !== 'admin') {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Mevcut' : 'Yok');

      // Sınavları getir
      console.log('Sınavlar getiriliyor...');
      const examsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Sınavlar response status:', examsResponse.status);
      if (examsResponse.ok) {
        const examsData = await examsResponse.json();
        console.log('Sınavlar data:', examsData);
        setExams(examsData);
      } else {
        console.error('Sınavlar getirilemedi:', examsResponse.statusText);
      }

      // Sınav sonuçlarını getir (admin endpoint'i oluşturulmalı)
      console.log('Sınav sonuçları getiriliyor...');
      const resultsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exam-results`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Sonuçlar response status:', resultsResponse.status);
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        console.log('Sonuçlar data:', resultsData);
        setExamResults(resultsData);
      } else {
        console.error('Sonuçlar getirilemedi:', resultsResponse.statusText);
        const errorText = await resultsResponse.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    let filtered = examResults;
    console.log('Filtreleme başlıyor. Toplam sonuç:', examResults.length);

    // Tüm sınıf değerlerini göster
    const allGrades = new Set(examResults.map(result => result.user.branch));
    console.log('Veritabanındaki tüm sınıf değerleri:', Array.from(allGrades));

    // Sınıf filtresi - Önce seçilen sınıftaki öğrencilerin user_id'lerini bul
    if (selectedGrade !== 'all') {
      console.log('Sınıf filtresi uygulanıyor. Seçilen sınıf:', selectedGrade, 'Türü:', typeof selectedGrade);

      // Seçilen sınıftaki öğrencilerin user_id'lerini topla
      const gradeUserIds = new Set();
      examResults.forEach(result => {
        console.log(`Kontrol edilen öğrenci: ${result.user.full_name}, Sınıf: "${result.user.branch}" (Türü: ${typeof result.user.branch})`);
        if (result.user.branch === selectedGrade) {
          gradeUserIds.add(result.user_id);
          console.log(`✅ Eşleşme bulundu! User ID: ${result.user_id} eklendi.`);
        } else {
          console.log(`❌ Eşleşme yok. Beklenen: "${selectedGrade}", Gerçek: "${result.user.branch}"`);
        }
      });

      console.log('Bu sınıftaki user_id\'ler:', Array.from(gradeUserIds));

      // Sadece bu user_id'lere sahip sonuçları filtrele
      filtered = filtered.filter(result => {
        const isInSelectedGrade = gradeUserIds.has(result.user_id);
        console.log(`User ID: ${result.user_id}, Sınıf: ${result.user.branch}, Seçilen sınıfta mı: ${isInSelectedGrade}`);
        return isInSelectedGrade;
      });

      console.log('Sınıf filtresi sonrası sonuç:', filtered.length);
    }

    // Sınav filtresi
    if (selectedExam !== 'all') {
      console.log('Sınav filtresi uygulanıyor:', selectedExam);
      filtered = filtered.filter(result => {
        console.log('Sınav ID:', result.exam.id, 'Seçilen sınav:', selectedExam);
        return result.exam.id.toString() === selectedExam;
      });
      console.log('Sınav filtresi sonrası sonuç:', filtered.length);
    }

    // Arama filtresi
    if (searchTerm) {
      console.log('Arama filtresi uygulanıyor:', searchTerm);
      filtered = filtered.filter(result =>
        result.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.user.school_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('Arama filtresi sonrası sonuç:', filtered.length);
    }

    console.log('Final filtrelenmiş sonuç:', filtered.length);
    setFilteredResults(filtered);
  };

  const getAnswerDetails = async (examResultId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exam-results/${examResultId}/answers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnswerDetails(data);
      }
    } catch (error) {
      console.error('Cevap detayları alınırken hata:', error);
    }
  };

  const toggleDetails = (examResultId: number) => {
    if (showDetails === examResultId) {
      setShowDetails(null);
      setAnswerDetails([]);
    } else {
      setShowDetails(examResultId);
      getAnswerDetails(examResultId);
    }
  };

  const getGradeLabel = (grade: string) => {
    const gradeMap: { [key: string]: string } = {
      '3': '3. Sınıf',
      '4': '4. Sınıf',
      '5': '5. Sınıf',
      '6': '6. Sınıf',
      '7': '7. Sınıf'
    };
    return gradeMap[grade] || grade;
  };

  const getOptionLabel = (optionNumber: number) => {
    const options = ['A', 'B', 'C', 'D', 'E'];
    return options[optionNumber - 1] || optionNumber.toString();
  };

  const calculateScore = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Admin Paneli - Sınav Sonuçları</h1>
          <p>Tüm öğrencilerin sınav sonuçlarını görüntüleyin ve analiz edin</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Sınıf Filtresi:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className={styles.select}
            >
              <option value="all">Tüm Sınıflar</option>
              <option value="3">3. Sınıf</option>
              <option value="4">4. Sınıf</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sınav Filtresi:</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className={styles.select}
            >
              <option value="all">Tüm Sınavlar</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id.toString()}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.searchGroup}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Öğrenci adı, email veya okul ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Toplam Sonuç</h3>
            <span>{filteredResults.length}</span>
          </div>
          <div className={styles.statCard}>
            <h3>Ortalama Başarı</h3>
            <span>
              {filteredResults.length > 0
                ? Math.round(filteredResults.reduce((acc, result) =>
                    acc + calculateScore(result.correct_answers, result.incorrect_answers), 0) / filteredResults.length)
                : 0}%
            </span>
          </div>
          <div className={styles.statCard}>
            <h3>Tamamlanan Sınav</h3>
            <span>{filteredResults.filter(r => r.completed).length}</span>
          </div>
        </div>

        <div className={styles.resultsTable}>
          <table>
            <thead>
              <tr>
                <th>Öğrenci</th>
                <th>Okul</th>
                <th>Sınıf</th>
                <th>Sınav</th>
                <th>Doğru</th>
                <th>Yanlış</th>
                <th>Başarı %</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <React.Fragment key={result.id}>
                  <tr>
                    <td>
                      <div className={styles.studentInfo}>
                        <strong>{result.user.full_name}</strong>
                        <small>{result.user.email}</small>
                      </div>
                    </td>
                    <td>{result.user.school_name}</td>
                    <td>{getGradeLabel(result.user.branch)}</td>
                    <td>{result.exam.title}</td>
                    <td className={styles.correct}>{result.correct_answers}</td>
                    <td className={styles.incorrect}>{result.incorrect_answers}</td>
                    <td>
                      <span className={styles.score}>
                        {calculateScore(result.correct_answers, result.incorrect_answers)}%
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${result.completed ? styles.completed : styles.pending}`}>
                        {result.completed ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleDetails(result.id)}
                        className={styles.detailButton}
                      >
                        <FiEye />
                        {showDetails === result.id ? 'Gizle' : 'Detay'}
                      </button>
                    </td>
                  </tr>
                  {showDetails === result.id && (
                    <tr>
                      <td colSpan={9}>
                        <div className={styles.detailsPanel}>
                          <h4>Soru Detayları</h4>
                          <div className={styles.answersList}>
                            {answerDetails.map((answer, index) => (
                              <div key={answer.id} className={`${styles.answerItem} ${answer.is_correct ? styles.correct : styles.incorrect}`}>
                                <div className={styles.questionHeader}>
                                  <span className={styles.questionNumber}>Soru {index + 1}</span>
                                  <span className={styles.questionStatus}>
                                    {answer.is_correct ? '✓ Doğru' : '✗ Yanlış'}
                                  </span>
                                </div>
                                <p className={styles.questionText}>{answer.question.text}</p>
                                <div className={styles.options}>
                                  <div className={styles.option}>
                                    <strong>A:</strong> {answer.question.option_1}
                                  </div>
                                  <div className={styles.option}>
                                    <strong>B:</strong> {answer.question.option_2}
                                  </div>
                                  <div className={styles.option}>
                                    <strong>C:</strong> {answer.question.option_3}
                                  </div>
                                  <div className={styles.option}>
                                    <strong>D:</strong> {answer.question.option_4}
                                  </div>
                                  {answer.question.option_5 && (
                                    <div className={styles.option}>
                                      <strong>E:</strong> {answer.question.option_5}
                                    </div>
                                  )}
                                </div>
                                <div className={styles.answerInfo}>
                                  <span className={styles.correctAnswer}>
                                    Doğru Cevap: {getOptionLabel(answer.question.correct_option_id)}
                                  </span>
                                  <span className={styles.studentAnswer}>
                                    Öğrenci Cevabı: {answer.selected_option ? getOptionLabel(answer.selected_option) : 'Boş'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className={styles.noResults}>
            <p>Seçilen kriterlere uygun sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;