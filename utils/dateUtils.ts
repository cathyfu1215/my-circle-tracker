/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g. "Monday, Jan 1")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Check if a date string is today
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Boolean indicating if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  return dateString === today;
};

/**
 * Get the ISO date string (YYYY-MM-DD) for today
 * @returns ISO date string for today
 */
export const getTodayString = (): string => {
  return new Date().toISOString().slice(0, 10);
};

/**
 * Get an array of ISO date strings for the past n days (including today)
 * @param days - Number of days to include
 * @returns Array of ISO date strings
 */
export const getLastNDays = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().slice(0, 10));
  }
  
  return dates;
}; 