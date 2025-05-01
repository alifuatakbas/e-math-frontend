// utils/dateUtils.ts

// Görüntüleme için (Sınavlar listesinde kullanılacak)
export const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  // UTC saatini yerel saate çevir
  date.setHours(date.getHours() + 3);

  return date.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Form gönderimi için (CreateExam'da kullanılacak)
export const convertLocalToUTC = (localDateString: string) => {
  const date = new Date(localDateString);
  // Zaten JavaScript otomatik olarak UTC'ye çevirecek
  return date.toISOString();
};

// UTC'den form input için yerel zamana çevirme
export const convertUTCToLocal = (utcDateString: string) => {
  const date = new Date(utcDateString);
  return date.toISOString().slice(0, 16); // "yyyy-MM-ddThh:mm" formatı için
};