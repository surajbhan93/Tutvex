// src/lib/phoneUtils.ts

/**
 * Format phone user input in real-time as they type/autofill.
 * Supports:
 * - 0-prefixed (11 digits): 09336289192
 * - +91-prefixed: +919336289192
 * - 91-prefixed (12 digits): +919336289192
 * - Standard 10-digit mobile: 9336289192
 */
export const formatPhoneInput = (val: string): string => {
  if (!val) return '';
  let cleaned = val.trim();

  // If user types/pastes +91...
  if (cleaned.startsWith('+91')) {
    const digits = cleaned.slice(3).replace(/\D/g, '').slice(0, 10);
    return '+91' + digits;
  }

  const digitsOnly = cleaned.replace(/\D/g, '');

  // Leading 0 format (e.g. 09336289192 -> 11 digits)
  if (digitsOnly.startsWith('0')) {
    return '0' + digitsOnly.slice(1, 11);
  }

  // Leading 91 format when > 10 digits (e.g. 919336289192 -> +919336289192)
  if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
    return '+91' + digitsOnly.slice(2, 12);
  }

  // Standard 10 digits
  return digitsOnly.slice(0, 10);
};

/**
 * Extract clean 10-digit mobile number for database storage & OTP verification.
 */
export const extractTenDigitPhone = (val?: string): string => {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
};

/**
 * Format phone number for clean UI display across Admin Panel, Tutor Profile, and Registration.
 * Example output: +91 93362 89192 (or raw if non-standard)
 */
export const displayFormattedPhone = (phone?: string): string => {
  if (!phone) return 'N/A';
  const tenDigit = extractTenDigitPhone(phone);
  if (tenDigit.length === 10) {
    return `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}`;
  }
  return phone;
};
