"use client"
import React, { useState, useEffect } from 'react';
import { ExamSCH } from '../schemas/schemas';

interface AdminExam extends ExamSCH {
  registration_start_date: string;
  registration_end_date: string;
  exam_start_date: string;
  exam_end_date: string;
  question_counter: number;
  status: string;
}

interface CreateExamProps {
  onExamCreated?: (examId: number) => void;
}
// CreateExam.tsx



// useState'i güncelle
const [exams, setExams] = useState<AdminExam[]>([]); //

const CreateExam: React.FC<CreateExamProps> = ({ onExamCreated }) => {
  const [title, setTitle] = useState<string>('');
  const [registrationStartDate, setRegistrationStartDate] = useState<string>('');
  const [registrationEndDate, setRegistrationEndDate] = useState<string>('');
  const [examStartDate, setExamStartDate] = useState<string>('');
  const [examEndDate, setExamEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
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

    if (!registrationStartDate || !registrationEndDate || !examStartDate || !examEndDate) {
      setError('Tüm tarih alanları doldurulmalıdır');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          registration_start_date: new Date(registrationStartDate).toISOString(),
          registration_end_date: new Date(registrationEndDate).toISOString(),
          exam_start_date: new Date(examStartDate).toISOString(),
          exam_end_date: new Date(examEndDate).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sınav oluşturulurken bir hata oluştu');
      }

      setSuccess('Sınav başarıyla oluşturuldu');
      setTitle('');
      setRegistrationStartDate('');
      setRegistrationEndDate('');
      setExamStartDate('');
      setExamEndDate('');

      const updatedExams = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
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
    try {
      // URL'yi düzelttik
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/exams/${examId}/publish/${currentStatus ? 0 : 1}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Yayınlama işlemi başarısız oldu');
      }

      // Başarılı mesajı göster
      setSuccess(currentStatus ? 'Sınav yayından kaldırıldı' : 'Sınav yayınlandı');

      // Sınavları yenile
      const updatedExams = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedData = await updatedExams.json();
      if (Array.isArray(updatedData)) {
        setExams(updatedData);
      }
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
      setTimeout(() => setError(null), 3000);
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

         <div>
           <label htmlFor="registration-start" className="block mb-2 text-sm font-medium">
             Başvuru Başlangıç Tarihi
           </label>
           <input
               id="registration-start"
               type="datetime-local"
               value={registrationStartDate}
               onChange={(e) => setRegistrationStartDate(e.target.value)}
               required
               disabled={isLoading}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label htmlFor="registration-end" className="block mb-2 text-sm font-medium">
             Başvuru Bitiş Tarihi
           </label>
           <input
               id="registration-end"
               type="datetime-local"
               value={registrationEndDate}
               onChange={(e) => setRegistrationEndDate(e.target.value)}
               required
               disabled={isLoading}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label htmlFor="exam-start" className="block mb-2 text-sm font-medium">
             Sınav Başlangıç Tarihi
           </label>
           <input
               id="exam-start"
               type="datetime-local"
               value={examStartDate}
               onChange={(e) => setExamStartDate(e.target.value)}
               required
               disabled={isLoading}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label htmlFor="exam-end" className="block mb-2 text-sm font-medium">
             Sınav Bitiş Tarihi
           </label>
           <input
               id="exam-end"
               type="datetime-local"
               value={examEndDate}
               onChange={(e) => setExamEndDate(e.target.value)}
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
           <th className="border px-4 py-2">Yayın Durumu</th>
           <th className="border px-4 py-2">Başvuru Başlangıç</th>
           <th className="border px-4 py-2">Soru Sayısı</th>
           <th className="border px-4 py-2">İşlemler</th>
         </tr>
         </thead>
         <tbody>
         {Array.isArray(exams) && exams.map((exam) => (
             <tr key={exam.id}>
               <td className="border px-4 py-2">{exam.id}</td>
               <td className="border px-4 py-2">{exam.title}</td>
               <td className="border px-4 py-2">
                 {exam.is_published ? 'Yayında' : 'Yayında Değil'}
               </td>
               <td className="border px-4 py-2">
                 {new Date(exam.registration_start_date).toLocaleString('tr-TR')}
               </td>
               <td className="border px-4 py-2">{exam.question_counter}</td>
               <td className="border px-4 py-2">
                 <button
                     onClick={() => handlePublishExam(exam.id, exam.is_published)}
                     className={`py-1 px-2 rounded-md transition-colors ${
                         exam.is_published
                             ? 'bg-red-500 hover:bg-red-600'
                             : 'bg-green-500 hover:bg-green-600'
                     } text-white`}
                 >
                   {exam.is_published ? 'Yayından Kaldır' : 'Yayınla'}
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