export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

export const getPreviousWorkingDay = (baseDate: Date): Date => {
  const date = new Date(baseDate);
  do {
    date.setDate(date.getDate() - 1);
  } while (isWeekend(date));
  return date;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (hour: number, minute: number, period: string): string => {
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const formatISODate = (date: Date): string => {
  // Use local time components to avoid UTC timezone shifts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseISODate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
