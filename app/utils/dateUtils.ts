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
export const convertLocalToUTC = (localDateString: string) => {
  const date = new Date(localDateString);
  // Yerel saat dilimindeki tarihi UTC'ye çevir
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  );
  return utcDate.toISOString();
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