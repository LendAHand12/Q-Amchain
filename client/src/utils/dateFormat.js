/**
 * Format date to dd/mm/yyyy HH:mm format (Vietnam timezone UTC+7)
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string (dd/mm/yyyy HH:mm)
 */
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  // Format to Vietnam timezone (Asia/Ho_Chi_Minh = UTC+7)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(d);
  const day = parts.find(p => p.type === 'day').value;
  const month = parts.find(p => p.type === 'month').value;
  const year = parts.find(p => p.type === 'year').value;
  const hours = parts.find(p => p.type === 'hour').value;
  const minutes = parts.find(p => p.type === 'minute').value;
  
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

/**
 * Format date with time to dd/mm/yyyy HH:mm format (Vietnam timezone)
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string (dd/mm/yyyy HH:mm)
 */
export const formatDateTime = (date) => {
  // Same as formatDate now, but keeping for backward compatibility
  return formatDate(date);
};

