// Bangla Spell Checker Integration
// Uses bangla.plus spell checker API for OCR text correction

/**
 * Spell check and correct Bangla text using external API
 * @param {string} text - Text to spell check
 * @returns {Promise<string>} - Corrected text
 */
export const spellCheckBanglaText = async (text) => {
  if (!text || text.trim().length === 0) return text;
  
  try {
    // For now, we'll implement basic corrections
    // Later this can be extended with the bangla.plus API
    return await basicBanglaCorrections(text);
  } catch (error) {
    console.warn('Spell check failed, returning original text:', error);
    return text;
  }
};

/**
 * Basic Bangla text corrections for common OCR errors
 * @param {string} text - Text to correct
 * @returns {Promise<string>} - Corrected text
 */
const basicBanglaCorrections = async (text) => {
  let corrected = text;
  
  // Common OCR error corrections for Bangla
  const corrections = {
    // Number confusions
    '১': /1/g,
    '২': /2/g,
    '৩': /3/g,
    '৪': /4/g,
    '৫': /5/g,
    '৬': /6/g,
    '৭': /7/g,
    '৮': /8/g,
    '৯': /9/g,
    '০': /0/g,
    
    // Common character fixes
    'আ': /া/g,
    'ই': /ি/g,
    'ঈ': /ী/g,
    'উ': /ু/g,
    'ঊ': /ূ/g,
    'এ': /ে/g,
    'ঐ': /ৈ/g,
    'ও': /ো/g,
    'ঔ': /ৌ/g,
    
    // Common word corrections
    'আবেদন': /আবেদন|আবেদ|আবদন/g,
    'বিষয়': /বিষয়|বিষয|বিসয়/g,
    'মহোদয়': /মহোদয়|মহোদয|মহদয়/g,
    'তারিখ': /তারিখ|তারিক|তরিখ/g,
    'নিবেদক': /নিবেদক|নিবেদ|নিবদক/g,
    'ধন্যবাদ': /ধন্যবাদ|ধন্যবাদন্তে|ধন্যবাদঅন্তে/g,
    'প্রতি': /প্রতি|প্রতী|পতি/g,
    'বরাবর': /বরাবর|বরাব/g,
    'অফিস': /অফিস|অফস|অফিশ/g,
    'মোবাইল': /মোবাইল|মোবাইল|মবাইল/g,
    'ইমেইল': /ইমেইল|ইমেল|ইমইল/g,
    'ঠিকানা': /ঠিকানা|ঠিকান|ঠকানা/g,
    'যোগাযোগ': /যোগাযোগ|যোগযোগ|যোগাযগ/g,
    'নম্বর': /নম্বর|নম্বের|নম্বার/g,
    'বিভাগ': /বিভাগ|বিভগ|বভাগ/g,
    'সহকারী': /সহকারী|সহকারি|সহকার/g,
    'কর্মকর্তা': /কর্মকর্তা|কর্মকরতা|কর্মকতা/g,
    'পরিচালক': /পরিচালক|পরিচালক|পরচালক/g,
    
    // Common sentence patterns
    'বিনীত নিবেদক': /বিনীত নিবেদক|বিনিত নিবেদক|বিনীত নিবেদ/g,
    'ধন্যবাদান্তে': /ধন্যবাদান্তে|ধন্যবাদঅন্তে|ধন্যবাদন্তে/g,
    'আপনার বিশ্বস্ত': /আপনার বিশ্বস্ত|আপনার বিশ্বসত|আপনর বিশ্বস্ত/g,
    
    // Fix spacing issues
    '। ': /।\s*/g,
    ', ': /,\s*/g,
    ': ': /:\s*/g,
    '; ': /;\s*/g,
    '? ': /\?\s*/g,
    '! ': /!\s*/g,
    
    // Remove extra characters that are OCR artifacts
    '': /[|\\\/\-_=+~`'"<>{}[\]()]+(?!\w)/g,
    ' ': /\s+/g, // Multiple spaces to single space
  };
  
  // Apply corrections
  Object.entries(corrections).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  // Clean up extra whitespace
  corrected = corrected
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // Multiple line breaks
    .replace(/^\s+/gm, '') // Leading spaces
    .replace(/\s+$/gm, '') // Trailing spaces
    .trim();
  
  return corrected;
};

/**
 * Advanced spell checking using external service (future implementation)
 * @param {string} text - Text to check
 * @returns {Promise<string>} - Corrected text
 */
export const advancedSpellCheck = async (text) => {
  // This can be implemented to use bangla.plus API
  // For now, return basic corrections
  return await basicBanglaCorrections(text);
};

/**
 * Clean and validate extracted OCR text
 * @param {string} text - Raw OCR text
 * @returns {string} - Cleaned and validated text
 */
export const cleanOCRText = (text) => {
  if (!text) return '';
  
  // Split into lines and filter
  const lines = text.split('\n');
  const cleanLines = lines.filter(line => {
    const trimmed = line.trim();
    
    // Keep lines with substantial content
    if (trimmed.length < 2) return false;
    
    // Filter out lines that are mostly symbols or numbers without context
    const symbolRatio = (trimmed.match(/[^\u0980-\u09FFa-zA-Z0-9০-৯\s.,;:!?()\-]/g) || []).length / trimmed.length;
    if (symbolRatio > 0.7) return false;
    
    // Filter out obvious OCR artifacts
    const artifacts = /^[|\\\/\-_=+~`'"<>{}[\]()।,.\s]*$/;
    if (artifacts.test(trimmed)) return false;
    
    // Filter out lines with too many consecutive symbols
    if (/[^\w\s]{5,}/.test(trimmed)) return false;
    
    return true;
  });
  
  return cleanLines.join('\n').trim();
};
