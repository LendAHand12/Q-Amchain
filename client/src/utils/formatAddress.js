/**
 * Format address/hash to show only first 4 and last 4 characters
 * @param {string} address - The address or hash to format
 * @returns {string} - Formatted address (e.g., "0x1234...5678")
 */
export const formatAddress = (address) => {
  if (!address || typeof address !== "string") return "N/A";
  if (address.length <= 8) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

