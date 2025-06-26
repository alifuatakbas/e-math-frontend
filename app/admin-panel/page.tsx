"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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

interface PaginatedResults {
  results: ExamResult[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const AdminPanel = () => {
  const router = useRouter();
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [exams, setExams] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [answerDetails, setAnswerDetails] = useState<Answer[]>([]);

  // Sayfalama state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchExams();
  }, []);

  useEffect(() => {
    fetchExamResults();
  }, [currentPage, pageSize, selectedGrade, searchTerm, selectedExam]);

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

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const examsData = await response.json();
        setExams(examsData);
      }
    } catch (error) {
      console.error('Sınavlar yüklenirken hata:', error);
    }
  };

  const fetchExamResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Backend API parametrelerini oluştur
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString()
      });

      if (selectedGrade) {
        params.append('grade', selectedGrade);
      }
      if (selectedExam) {
        params.append('exam_id', selectedExam);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exam-results?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: PaginatedResults = await response.json();
        setExamResults(data.results);
        setTotalResults(data.total);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Sınav sonuçları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
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

  const getOptionLabel = (optionNumber: number) => {
    const options = ['A', 'B', 'C', 'D', 'E'];
    return options[optionNumber - 1] || optionNumber.toString();
  };

  const calculateScore = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
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
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                handleFilterChange();
              }}
              className={styles.select}
            >
              <option value="">Tüm Sınıflar</option>
              <option value="3. Sınıf">3. Sınıf</option>
              <option value="4. Sınıf">4. Sınıf</option>
              <option value="5. Sınıf">5. Sınıf</option>
              <option value="6. Sınıf">6. Sınıf</option>
              <option value="7. Sınıf">7. Sınıf</option>
              <option value="8. Sınıf">8. Sınıf</option>
              <option value="9. Sınıf">9. Sınıf</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sınav Filtresi:</label>
            <select
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                handleFilterChange();
              }}
              className={styles.select}
            >
              <option value="">Tüm Sınavlar</option>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Toplam Sonuç</h3>
            <span>{totalResults}</span>
          </div>
          <div className={styles.statCard}>
            <h3>Ortalama Başarı</h3>
            <span>
              {examResults.length > 0
                ? Math.round(examResults.reduce((acc, result) =>
                    acc + calculateScore(result.correct_answers, result.incorrect_answers), 0) / examResults.length)
                : 0}%
            </span>
          </div>
          <div className={styles.statCard}>
            <h3>Tamamlanan Sınav</h3>
            <span>{examResults.filter(r => r.completed).length}</span>
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
              {examResults.map((result) => (
                <React.Fragment key={result.id}>
                  <tr>
                    <td>
                      <div className={styles.studentInfo}>
                        <strong>{result.user.full_name}</strong>
                        <small>{result.user.email}</small>
                      </div>
                    </td>
                    <td>{result.user.school_name}</td>
                    <td>{result.user.branch}</td>
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

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              <FiChevronLeft />
              Önceki
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Sonraki
              <FiChevronRight />
            </button>
          </div>
        )}

        {examResults.length === 0 && !loading && (
          <div className={styles.noResults}>
            <p>Seçilen kriterlere uygun sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;