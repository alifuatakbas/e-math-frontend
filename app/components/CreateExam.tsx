"use client"
import React, { useState, useEffect } from 'react';

interface CreateExamProps {
  onExamCreated?: (examId: number) => void;
}

const CreateExam: React.FC<CreateExamProps> = ({ onExamCreated }) => {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/exams', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setExams(data);
        } else {
          setError('Invalid data format');
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching exams');
      }
    };

    fetchExams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Sınav başlığı boş bırakılamaz');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/create-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sınav oluşturulurken bir hata oluştu');
      }

      setSuccess('Sınav başarıyla oluşturuldu');
      setTitle('');

      const updatedExams = await fetch('${process.env.NEXT_PUBLIC_API_URL}/exams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedData = await updatedExams.json();
      if (Array.isArray(updatedData)) {
        setExams(updatedData);
      } else {
        setError('Failed to fetch updated exams');
      }

      if (onExamCreated && data.exam_id) {
        onExamCreated(data.exam_id);
      }
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishExam = async (examId: number, currentStatus: boolean) => {
    const token = localStorage.getItem('token');
    const newPublishStatus = currentStatus ? 0 : 1;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}/publish/${newPublishStatus}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert(`Sınav başarıyla ${currentStatus ? 'kaldırıldı' : 'yayınlandı'}.`);
        const updatedExams = await fetch('${process.env.NEXT_PUBLIC_API_URL}/exams', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const updatedData = await updatedExams.json();
        if (Array.isArray(updatedData)) {
          setExams(updatedData);
        } else {
          setError('Failed to fetch updated exams');
        }
      } else {
        alert('Sınav yayınlama işlemi başarısız oldu.');
      }
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Yeni Sınav Oluştur</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="exam-title" className="block mb-2 text-sm font-medium">
            Sınav Başlığı
          </label>
          <input
            id="exam-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sınav başlığını girin"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Oluşturuluyor...' : 'Sınavı Oluştur'}
        </button>
      </form>

      <h3 className="text-xl font-bold mt-6">Tüm Sınavlar</h3>
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Başlık</th>
            <th className="border px-4 py-2">Yayınlandı mı?</th>
            <th className="border px-4 py-2">Soru Sayısı</th>
            <th className="border px-4 py-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(exams) && exams.map((exam) => (
            <tr key={exam.id}>
              <td className="border px-4 py-2">{exam.id}</td>
              <td className="border px-4 py-2">{exam.title}</td>
              <td className="border px-4 py-2">{exam.is_published ? 'Evet' : 'Hayır'}</td>
              <td className="border px-4 py-2">{exam.question_counter}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handlePublishExam(exam.id, exam.is_published)}
                  className={`py-1 px-2 rounded-md transition-colors ${exam.is_published ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {exam.is_published ? 'Kaldır' : 'Yayınla'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateExam;