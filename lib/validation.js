/**
 * Strict credential format validation
 * Ensures only original, authentic user credentials are submitted.
 */

export function validateCredentials({ name, contactType, contact, expectations, countryCode = 'IN' }) {
  // 1. Full Name Validation
  const cleanName = (name || '').trim();
  if (!cleanName || cleanName.length < 2) {
    return { valid: false, error: 'Please tell me your sweet name (minimum 2 letters).' };
  }
  if (!/^[a-zA-Z\s'.-]{2,60}$/.test(cleanName)) {
    return { valid: false, error: 'Your sweet name should only contain letters and spaces (no numbers or symbols).' };
  }

  // 2. Contact Channel Validation
  const cleanContact = (contact || '').trim();
  if (!cleanContact) {
    return { valid: false, error: 'Please let me know how we can be in touch.' };
  }

  if (contactType === 'phone' || contactType === 'whatsapp') {
    const digitsOnly = cleanContact.replace(/\D/g, '');

    if (countryCode === 'IN') {
      const localDigits = digitsOnly.startsWith('91') && digitsOnly.length > 10 ? digitsOnly.slice(2) : digitsOnly;
      if (!/^[6-9]\d{9}$/.test(localDigits)) {
        return {
          valid: false,
          error: 'Please enter a valid 10-digit mobile number so my messages reach only you.',
        };
      }
    } else if (countryCode === 'US' || countryCode === 'CA') {
      const localDigits = digitsOnly.startsWith('1') && digitsOnly.length > 10 ? digitsOnly.slice(1) : digitsOnly;
      if (localDigits.length !== 10) {
        return { valid: false, error: 'Please enter a valid 10-digit phone number so we can be in touch.' };
      }
    } else {
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return { valid: false, error: 'Please enter a valid phone number (7 to 15 digits) so we can be in touch.' };
      }
    }
  } else if (contactType === 'instagram') {
    const handle = cleanContact.replace(/^@/, '');
    if (!/^[a-zA-Z0-9._]{2,30}$/.test(handle) || handle.includes('..') || handle.startsWith('.') || handle.endsWith('.')) {
      return {
        valid: false,
        error: 'Please enter your real Instagram handle so I can find you and say hi.',
      };
    }
  } else if (contactType === 'twitter') {
    const handle = cleanContact.replace(/^@/, '');
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
      return {
        valid: false,
        error: 'Please enter your actual Twitter / X handle so we can stay connected.',
      };
    }
  } else if (contactType === 'telegram') {
    const handle = cleanContact.replace(/^@/, '');
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(handle) && !/^\+?\d{8,15}$/.test(cleanContact)) {
      return {
        valid: false,
        error: 'Please enter your real Telegram handle or phone so we can text.',
      };
    }
  } else if (contactType === 'email') {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanContact)) {
      return {
        valid: false,
        error: 'Please enter your real email so my notes do not bounce.',
      };
    }
  }

  // 3. Match Expectations Validation
  if (expectations !== undefined && expectations !== null) {
    const cleanExpectations = expectations.trim();
    const isSkipped =
      cleanExpectations === '' ||
      cleanExpectations.toLowerCase().startsWith('skipped') ||
      cleanExpectations.toLowerCase().startsWith('open to');

    if (!isSkipped && cleanExpectations.length < 8) {
      return {
        valid: false,
        error: 'Share a little more of what you desire (at least 8 characters) or click Skip.',
      };
    }
  }

  return { valid: true, error: null };
}
