/**
 * Formatting utilities for the Xuxu app
 */

/**
 * Format a number as Mexican peso currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$123.45 MXN")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date for display in Spanish locale
 * @param date - The date to format
 * @param options - Optional formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  };

  return new Intl.DateTimeFormat('es-MX', {
    ...defaultOptions,
    ...options,
  }).format(date);
};

/**
 * Format a date as a short date (no time)
 * @param date - The date to format
 * @returns Formatted short date string (e.g., "15 ene 2024")
 */
export const formatShortDate = (date: Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date as just time
 * @param date - The date to format
 * @returns Formatted time string (e.g., "14:30")
 */
export const formatTime = (date: Date): string => {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Format a date for relative display (e.g., "hace 2 horas")
 * @param date - The date to format
 * @returns Relative time string in Spanish
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'ahora mismo';
  } else if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  } else {
    return formatShortDate(date);
  }
};

/**
 * Format a phone number for display
 * @param phone - The phone number to format
 * @returns Formatted phone number (e.g., "+52 55 1234 5678")
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Mexican phone numbers (10 digits) with country code
  if (cleaned.length === 10) {
    return `+52 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  }
  
  // Handle international format (country code + 10 digits)
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }
  
  // Return original if format is unclear
  return phone;
};

/**
 * Format a percentage
 * @param value - The decimal value (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "15.0%")
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number with thousands separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string (e.g., "1,234")
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Truncate text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitalize the first letter of a string
 * @param text - The text to capitalize
 * @returns Text with first letter capitalized
 */
export const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format an address for display
 * @param address - Address object
 * @returns Formatted address string
 */
export const formatAddress = (address: {
  street?: string;
  colonia?: string;
  municipality?: string;
  state?: string;
  postalCode?: string;
}): string => {
  const parts = [
    address.street,
    address.colonia,
    address.municipality,
    address.state,
    address.postalCode ? `C.P. ${address.postalCode}` : null,
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Format file size in human readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format order status for display in Spanish
 * @param status - Order status
 * @returns Formatted status string in Spanish
 */
export const formatOrderStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': 'Pendiente',
    'confirmed': 'Confirmado',
    'preparing': 'Preparando',
    'ready': 'Listo',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado',
  };
  
  return statusMap[status] || status;
};

/**
 * Format payment method for display in Spanish
 * @param method - Payment method
 * @returns Formatted payment method string in Spanish
 */
export const formatPaymentMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    'cash': 'Efectivo',
    'card': 'Tarjeta',
    'digital': 'Pago Digital',
  };
  
  return methodMap[method] || method;
};

/**
 * Format fulfillment type for display in Spanish
 * @param type - Fulfillment type
 * @returns Formatted fulfillment type string in Spanish
 */
export const formatFulfillmentType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'delivery': 'Entrega a domicilio',
    'pickup': 'Recoger en tienda',
  };
  
  return typeMap[type] || type;
};