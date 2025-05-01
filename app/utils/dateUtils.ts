// utils/dateUtils.ts
export const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Istanbul'
  });
};

// Yerel saatten UTC'ye çevirme (form gönderirken)
// utils/dateUtils.ts
export const convertLocalToUTC = (localDateString: string) => {
  const date = new Date(localDateString);
  // Yerel saatten UTC'ye çevirirken 3 saat çıkar
  date.setHours(date.getHours() - 3);
  return date.toISOString();
};

// UTC'den yerel saate çevirme (form input için)
export const convertUTCToLocal = (utcDateString: string) => {
  const date = new Date(utcDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};