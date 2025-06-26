"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  // Pagination state'leri
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

      // API parametrelerini oluştur
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

      console.log('API çağrısı yapılıyor:', `${process.env.NEXT_PUBLIC_API_URL}/admin/exam-results?${params}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exam-results?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: PaginatedResults = await response.json();
        console.log('API yanıtı:', data);
        setExamResults(data.results || []);
        setTotalResults(data.total || 0);
        setTotalPages(data.total_pages || 0);
      } else {
        console.error('API yanıt hatası:', response.status);
        const errorText = await response.text();
        console.error('Hata detayı:', errorText);
        setExamResults([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Sınav sonuçları yüklenirken hata:', error);
      setExamResults([]);
      setTotalResults(0);
      setTotalPages(0);
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p>Yükleniyor...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1>Admin Paneli - Sınav Sonuçları</h1>
          <p>Tüm öğrencilerin sınav sonuçlarını görüntüleyin ve analiz edin</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div>
            <label>Sınıf Filtresi:</label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                handleFilterChange();
              }}
              style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
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

          <div>
            <label>Sınav Filtresi:</label>
            <select
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                handleFilterChange();
              }}
              style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">Tüm Sınavlar</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id.toString()}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input
              type="text"
              placeholder="Öğrenci adı, email veya okul ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              style={{ padding: '8px 8px 8px 35px', borderRadius: '4px', border: '1px solid #ddd', width: '250px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Toplam Sonuç</h3>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{totalResults}</span>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Ortalama Başarı</h3>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {examResults.length > 0
                ? Math.round(examResults.reduce((acc, result) =>
                    acc + calculateScore(result.correct_answers, result.incorrect_answers), 0) / examResults.length)
                : 0}%
            </span>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Tamamlanan Sınav</h3>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{examResults.filter(r => r.completed).length}</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Öğrenci</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Okul</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Sınıf</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Sınav</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Doğru</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Yanlış</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Başarı %</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Durum</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {examResults.map((result) => (
                <React.Fragment key={result.id}>
                  <tr style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <strong>{result.user.full_name}</strong>
                        <br />
                        <small style={{ color: '#666' }}>{result.user.email}</small>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{result.user.school_name}</td>
                    <td style={{ padding: '12px' }}>{result.user.branch}</td>
                    <td style={{ padding: '12px' }}>{result.exam.title}</td>
                    <td style={{ padding: '12px', color: '#28a745', fontWeight: 'bold' }}>{result.correct_answers}</td>
                    <td style={{ padding: '12px', color: '#dc3545', fontWeight: 'bold' }}>{result.incorrect_answers}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: calculateScore(result.correct_answers, result.incorrect_answers) >= 70 ? '#d4edda' : '#f8d7da',
                        color: calculateScore(result.correct_answers, result.incorrect_answers) >= 70 ? '#155724' : '#721c24'
                      }}>
                        {calculateScore(result.correct_answers, result.incorrect_answers)}%
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: result.completed ? '#d4edda' : '#fff3cd',
                        color: result.completed ? '#155724' : '#856404'
                      }}>
                        {result.completed ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => toggleDetails(result.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        👁️ {showDetails === result.id ? 'Gizle' : 'Detay'}
                      </button>
                    </td>
                  </tr>
                  {showDetails === result.id && (
                    <tr>
                      <td colSpan={9} style={{ padding: '20px', background: '#f8f9fa' }}>
                        <div>
                          <h4>Soru Detayları</h4>
                          <div style={{ display: 'grid', gap: '15px' }}>
                            {answerDetails.map((answer, index) => (
                              <div key={answer.id} style={{
                                padding: '15px',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                background: answer.is_correct ? '#d4edda' : '#f8d7da'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <span style={{ fontWeight: 'bold' }}>Soru {index + 1}</span>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: answer.is_correct ? '#28a745' : '#dc3545',
                                    color: 'white'
                                  }}>
                                    {answer.is_correct ? '✓ Doğru' : '✗ Yanlış'}
                                  </span>
                                </div>
                                <p style={{ marginBottom: '10px' }}>{answer.question.text}</p>
                                <div style={{ marginBottom: '10px' }}>
                                  <div style={{ marginBottom: '5px' }}><strong>A:</strong> {answer.question.option_1}</div>
                                  <div style={{ marginBottom: '5px' }}><strong>B:</strong> {answer.question.option_2}</div>
                                  <div style={{ marginBottom: '5px' }}><strong>C:</strong> {answer.question.option_3}</div>
                                  <div style={{ marginBottom: '5px' }}><strong>D:</strong> {answer.question.option_4}</div>
                                  {answer.question.option_5 && (
                                    <div style={{ marginBottom: '5px' }}><strong>E:</strong> {answer.question.option_5}</div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                                  <span style={{ color: '#28a745' }}>
                                    Doğru Cevap: {getOptionLabel(answer.question.correct_option_id)}
                                  </span>
                                  <span style={{ color: '#dc3545' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                background: currentPage === 1 ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Önceki
            </button>

            <div style={{ display: 'flex', gap: '5px' }}>
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
                    style={{
                      padding: '8px 12px',
                      background: currentPage === pageNum ? '#007bff' : '#f8f9fa',
                      color: currentPage === pageNum ? 'white' : '#007bff',
                      border: '1px solid #007bff',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                background: currentPage === totalPages ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Sonraki →
            </button>
          </div>
        )}

        {examResults.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <p>Seçilen kriterlere uygun sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;