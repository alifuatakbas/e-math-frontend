"use client"
import React, { useState, useEffect } from 'react';
import { ExamSCH } from '../schemas/schemas';
import { formatDateForDisplay, convertLocalToUTC, convertUTCToLocal } from '../utils/dateUtils';


interface CreateExamProps {
  onExamCreated?: (examId: number) => void;
}
// CreateExam.tsx





const CreateExam: React.FC<CreateExamProps> = ({ onExamCreated }) => {
  interface AdminExam extends ExamSCH {
  registration_start_date: string;
  registration_end_date: string;
  exam_start_date: string;
  exam_end_date: string;
  question_counter: number;
  status: string;
  requires_registration: boolean;
   duration_minutes: number; // Sınav süresi alanını ekle

}
  const [title, setTitle] = useState<string>('');
  const [requiresRegistration, setRequiresRegistration] = useState<boolean>(true);  // Yeni state
  const [registrationStartDate, setRegistrationStartDate] = useState<string>('');
  const [registrationEndDate, setRegistrationEndDate] = useState<string>('');
  const [examStartDate, setExamStartDate] = useState<string>('');
  const [examEndDate, setExamEndDate] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60); // Sınav süresi (dakika)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);



const [exams, setExams] = useState<AdminExam[]>([]); //

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

  // Sınav süresi kontrolü
  if (durationMinutes <= 0 || durationMinutes > 480) { // Maksimum 8 saat
    setError('Sınav süresi 1-480 dakika arasında olmalıdır');
    return;
  }

  // Başvurulu sınavlar için tarih kontrolü
  if (requiresRegistration) {
    if (!registrationStartDate || !registrationEndDate || !examStartDate || !examEndDate) {
      setError('Tüm tarih alanları doldurulmalıdır');
      return;
    }
  } else {
    // Başvurusuz sınavlar için sadece sınav tarihleri
    if (!examStartDate || !examEndDate) {
      setError('Sınav başlangıç ve bitiş tarihleri doldurulmalıdır');
      return;
    }
  }

  setIsLoading(true);
  const token = localStorage.getItem('token');

  try {
    // Request body'yi dinamik olarak oluştur
    const requestBody: any = {
      title,
      requires_registration: requiresRegistration,
      exam_start_date: new Date(examStartDate).toISOString(),
      exam_end_date: new Date(examEndDate).toISOString(),
      duration_minutes: durationMinutes // Sınav süresini ekle
    };

    // Sadece başvurulu sınavlar için tarihleri ekle
    if (requiresRegistration) {
      requestBody.registration_start_date = new Date(registrationStartDate).toISOString();
      requestBody.registration_end_date = new Date(registrationEndDate).toISOString();
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-exam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Sınav oluşturulurken bir hata oluştu');
    }

    setSuccess('Sınav başarıyla oluşturuldu');
    setTitle('');
    setRequiresRegistration(true);
    setRegistrationStartDate('');
    setRegistrationEndDate('');
    setExamStartDate('');
    setExamEndDate('');
    setDurationMinutes(60); // Varsayılan değere sıfırla

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
           <label className="block mb-2 text-sm font-medium">
             Sınav Türü
           </label>
           <div className="flex gap-4">
             <label className="flex items-center">
               <input
                 type="radio"
                 name="registrationType"
                 checked={requiresRegistration}
                 onChange={() => setRequiresRegistration(true)}
                 className="mr-2"
               />
               Başvurulu Sınav
             </label>
             <label className="flex items-center">
               <input
                 type="radio"
                 name="registrationType"
                 checked={!requiresRegistration}
                 onChange={() => setRequiresRegistration(false)}
                 className="mr-2"
               />
               Başvurusuz Sınav
             </label>
           </div>
         </div>

         <div>
           <label htmlFor="duration-minutes" className="block mb-2 text-sm font-medium">
             Sınav Süresi (Dakika)
           </label>
           <input
               id="duration-minutes"
               type="number"
               min="1"
               max="480"
               value={durationMinutes}
               onChange={(e) => setDurationMinutes(Number(e.target.value))}
               placeholder="60"
               required
               disabled={isLoading}
               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <p className="text-xs text-gray-500 mt-1">
             Kullanıcının sınavı çözmek için kullanacağı süre (1-480 dakika)
           </p>
         </div>

         {requiresRegistration && (
           <>
             <div>
               <label htmlFor="registration-start" className="block mb-2 text-sm font-medium">
                 Başvuru Başlangıç Tarihi
               </label>
               <input
                   id="registration-start"
                   type="datetime-local"
                   value={registrationStartDate}
                   onChange={(e) => setRegistrationStartDate(e.target.value)}
                   required={requiresRegistration}
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
                   required={requiresRegistration}
                   disabled={isLoading}
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
           </>
         )}

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
           <th className="border px-4 py-2">Tür</th>
           <th className="border px-4 py-2">Süre (dk)</th>
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
                 {exam.requires_registration ? 'Başvurulu' : 'Başvurusuz'}
               </td>
               <td className="border px-4 py-2">{exam.duration_minutes || 'N/A'}</td>
               <td className="border px-4 py-2">
                 {exam.is_published ? 'Yayında' : 'Yayında Değil'}
               </td>
               <td className="border px-4 py-2">
                 {exam.requires_registration
                   ? formatDateForDisplay(exam.registration_start_date)
                   : 'Başvuru gerekmez'
                 }
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