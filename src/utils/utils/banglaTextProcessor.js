// Bangla Unicode and Text Processing Utilities
// Supports proper Bijoy Unicode conversion and Nikosh font formatting

// Bangla Unicode range: U+0980 to U+09FF
const BANGLA_UNICODE_RANGE = /[\u0980-\u09FF]/;

// Common Bangla character mappings for better compatibility
const BANGLA_CHAR_NORMALIZATIONS = {
  // Zero-width characters that might cause issues
  '\u200C': '', // Zero Width Non-Joiner
  '\u200D': '', // Zero Width Joiner
  '\u00A0': ' ', // Non-breaking space to regular space
};

/**
 * Detects if text contains Bangla characters
 * @param {string} text - Text to analyze
 * @returns {boolean} - True if contains Bangla characters
 */
export const hasBanglaText = (text) => {
  return BANGLA_UNICODE_RANGE.test(text);
};

/**
 * Normalizes Bangla text for better display in Word documents
 * @param {string} text - Original text
 * @returns {string} - Normalized text
 */
export const normalizeBanglaText = (text) => {
  if (!text) return '';
  
  let normalized = text;
  
  // Apply character normalizations
  Object.keys(BANGLA_CHAR_NORMALIZATIONS).forEach(char => {
    normalized = normalized.replace(new RegExp(char, 'g'), BANGLA_CHAR_NORMALIZATIONS[char]);
  });
  
  // Normalize Unicode (NFC - Canonical Decomposition, followed by Canonical Composition)
  if (normalized.normalize) {
    normalized = normalized.normalize('NFC');
  }
  
  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
};

/**
 * Gets the appropriate font name based on text content
 * @param {string} text - Text to analyze
 * @returns {string} - Font name to use
 */
export const getAppropriateFont = (text) => {
  return hasBanglaText(text) ? 'Nikosh' : 'Times New Roman';
};

/**
 * Processes text for Word document creation with proper Bangla support
 * @param {string} text - Original text
 * @returns {object} - Processed text with formatting information
 */
export const processTextForWord = (text) => {
  const normalized = normalizeBanglaText(text);
  const font = getAppropriateFont(normalized);
  const isBangla = hasBanglaText(normalized);
  
  return {
    text: normalized,
    font: font,
    isBangla: isBangla,
    size: 24, // 12pt
    rightToLeft: false // Bangla in Unicode is LTR
  };
};

/**
 * Splits text into lines while preserving Bangla text integrity
 * @param {string} text - Text to split
 * @returns {Array<string>} - Array of lines
 */
export const splitTextPreservingBangla = (text) => {
  return text
    .split('\n')
    .map(line => normalizeBanglaText(line))
    .filter(line => line.length > 0);
};

/**
 * Validates and enhances OCR text specifically for Bangla content
 * @param {string} ocrText - Raw OCR output
 * @returns {string} - Enhanced text
 */
export const enhanceBanglaOCRText = (ocrText) => {
  if (!ocrText) return '';
  
  let enhanced = normalizeBanglaText(ocrText);
  
  // Comprehensive OCR corrections for Bangla text
  const corrections = {
    // Common character confusions in OCR
    'ও': /[০o0]/g,
    '০': /[Oo]/g,
    'ৎ': /[t]/g,
    'ং': /[ng]/g,
    'ঃ': /[:]/g,
    'ি': /[i]/g,
    'ী': /[I]/g,
    'ু': /[u]/g,
    'ূ': /[U]/g,
    'ে': /[e]/g,
    'ৈ': /[ai]/g,
    'ো': /[o]/g,
    'ৌ': /[ou]/g,
    // Fix spacing around punctuation
    '। ': /\s*।\s*/g,
    ', ': /\s*,\s*/g,
    // Common Bangla words that get misrecognized
    'আবেদন': /আবেদন/g,
    'বিষয়': /বিষয়/g,
    'মহোদয়': /মহোদয়/g,
    'ধন্যবাদান্তে': /ধন্যবাদান্তে/g,
    'বিনীত নিবেদক': /বিনীত নিবেদক/g,
    'প্রতি': /প্রতি/g,
    'তারিখ': /তারিখ/g,
    'অফিস': /অফিস/g,
    'আবেদনকারী': /আবেদনকারী/g
  };
  
  // Apply corrections
  Object.entries(corrections).forEach(([correct, pattern]) => {
    enhanced = enhanced.replace(pattern, correct);
  });
  
  // Clean up whitespace while preserving document structure
  enhanced = enhanced
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
    .replace(/[ \t]+/g, ' ') // Multiple spaces to single
    .replace(/^\s+/gm, '') // Leading spaces on lines
    .replace(/\s+$/gm, '') // Trailing spaces on lines
    .trim();
  
  // Filter out lines that are likely OCR artifacts
  const lines = enhanced.split('\n');
  const cleanLines = lines.filter(line => {
    const trimmed = line.trim();
    // Keep lines that have substantial content
    if (trimmed.length < 3) return false;
    
    // Filter out lines with too many special characters
    const specialCharRatio = (trimmed.match(/[^\u0980-\u09FFa-zA-Z0-9০-৯\s.,;:!?()-]/g) || []).length / trimmed.length;
    if (specialCharRatio > 0.8) return false;
    
    // Filter out lines that look like OCR errors
    const ocrErrorPatterns = /^[|\\\/\-_=+~`'"<>{}[\]()।,.\s]*$/;
    if (ocrErrorPatterns.test(trimmed)) return false;
    
    return true;
  });
  
  return cleanLines.join('\n');
};

/**
 * Detects document structure and formatting patterns in Bangla text
 * @param {string} text - Text to analyze
 * @returns {string} - Document element type
 */
export const detectDocumentElement = (text) => {
  if (!text || !text.trim()) return 'empty';
  
  const cleanText = text.trim();
  
  // Title patterns
  if (cleanText.length < 100 && (
    cleanText.includes('আবেদন') || 
    cleanText.includes('চিঠি') || 
    cleanText.includes('নোটিশ') ||
    cleanText.includes('প্রতিবেদন') ||
    cleanText.includes('দরখাস্ত')
  )) {
    return 'title';
  }
  
  // Address/recipient patterns
  if (cleanText.includes('বরাবর') || 
      cleanText.includes('মহোদয়') || 
      cleanText.includes('প্রতি')) {
    return 'address';
  }
  
  // Subject patterns
  if (cleanText.startsWith('বিষয়') || 
      cleanText.startsWith('প্রসঙ্গ') ||
      cleanText.includes('বিষয়:')) {
    return 'subject';
  }
  
  // Date patterns
  if (cleanText.includes('তারিখ') || 
      /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(cleanText) ||
      /\d{1,2}-\d{1,2}-\d{2,4}/.test(cleanText)) {
    return 'date';
  }
  
  // Salutation patterns
  if (cleanText.includes('জনাব') || 
      cleanText.includes('মাননীয়') ||
      cleanText.includes('শ্রদ্ধেয়')) {
    return 'salutation';
  }
  
  // Closing patterns
  if (cleanText.includes('ধন্যবাদান্তে') || 
      cleanText.includes('বিনীত নিবেদক') ||
      cleanText.includes('আপনার বিশ্বস্ত') ||
      cleanText.includes('নিবেদক')) {
    return 'closing';
  }
  
  // Signature patterns
  if (cleanText.includes('স্বাক্ষর') || 
      cleanText.includes('নাম') ||
      cleanText.includes('পদবী')) {
    return 'signature';
  }
  
  return 'body';
};

// Font configuration for Word documents
export const BANGLA_FONT_CONFIG = {
  primaryFont: 'Nikosh',
  bangla: {
    name: 'Nikosh',
    size: 24,
    fallbacks: ['SolaimanLipi', 'Kalpurush', 'SutonnyMJ']
  },
  english: {
    name: 'Times New Roman',
    size: 24,
    fallbacks: ['Arial', 'Calibri']
  }
};
