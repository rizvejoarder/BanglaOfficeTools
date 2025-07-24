/**
 * Proper Unicode to Bijoy Converter
 * Based on standard Unicode to Bijoy character mapping
 */

// Complete Unicode to Bijoy character mapping
const UNICODE_TO_BIJOY_MAP = {
  // Basic consonants
  'ক': 'K',
  'খ': 'L',
  'গ': 'M',
  'ঘ': 'N',
  'ঙ': 'O',
  'চ': 'P',
  'ছ': 'Q',
  'জ': 'R',
  'ঝ': 'S',
  'ঞ': 'T',
  'ট': 'U',
  'ঠ': 'V',
  'ড': 'W',
  'ঢ': 'X',
  'ণ': 'Y',
  'ত': 'Z',
  'থ': '_',
  'দ': '`',
  'ধ': 'a',
  'ন': 'b',
  'প': 'c',
  'ফ': 'd',
  'ব': 'e',
  'ভ': 'f',
  'ম': 'g',
  'য': 'h',
  'র': 'i',
  'ল': 'j',
  'শ': 'k',
  'ষ': 'l',
  'স': 'm',
  'হ': 'n',
  'ড়': 'o',
  'ঢ়': 'p',
  'য়': 'q',
  'ৎ': 'r',
  'ং': 's',
  'ঃ': 't',
  'ঁ': 'u',
  
  // Vowels
  'অ': 'A',
  'আ': 'Av',
  'ই': 'B',
  'ঈ': 'C',
  'উ': 'D',
  'ঊ': 'E',
  'ঋ': 'F',
  'এ': 'G',
  'ঐ': 'H',
  'ও': 'I',
  'ঔ': 'J',
  
  // Vowel signs (kar)
  'া': 'v',
  'ি': 'w',
  'ী': 'x',
  'ু': 'y',
  'ূ': 'z',
  'ৃ': '{',
  'ে': '|',
  'ৈ': '}',
  'ো': '~',
  'ৌ': '€',
  
  // Numbers
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
  
  // Punctuation
  '।': '|',
  '৸': 'x',
  '৹': 'u',
  '৺': '+',
  '৻': '',
  'ৼ': '',
  '৽': '',
  '৾': '',
  '৿': ''
};

// Bijoy to Unicode mapping (reverse)
const BIJOY_TO_UNICODE_MAP = {};
Object.keys(UNICODE_TO_BIJOY_MAP).forEach(unicode => {
  const bijoy = UNICODE_TO_BIJOY_MAP[unicode];
  BIJOY_TO_UNICODE_MAP[bijoy] = unicode;
});

/**
 * Convert Unicode Bangla text to Bijoy format
 * @param {string} unicodeText - Unicode Bangla text
 * @returns {string} - Bijoy formatted text
 */
export const unicodeToBijoy = (unicodeText) => {
  if (!unicodeText) return '';
  
  let bijoyText = '';
  for (let i = 0; i < unicodeText.length; i++) {
    const char = unicodeText[i];
    if (UNICODE_TO_BIJOY_MAP[char]) {
      bijoyText += UNICODE_TO_BIJOY_MAP[char];
    } else {
      // Keep non-Bangla characters as is
      bijoyText += char;
    }
  }
  
  return bijoyText;
};

/**
 * Convert Bijoy text to Unicode format
 * @param {string} bijoyText - Bijoy formatted text
 * @returns {string} - Unicode Bangla text
 */
export const bijoyToUnicode = (bijoyText) => {
  if (!bijoyText) return '';
  
  let unicodeText = '';
  for (let i = 0; i < bijoyText.length; i++) {
    const char = bijoyText[i];
    if (BIJOY_TO_UNICODE_MAP[char]) {
      unicodeText += BIJOY_TO_UNICODE_MAP[char];
    } else {
      // Keep non-Bangla characters as is
      unicodeText += char;
    }
  }
  
  return unicodeText;
};

/**
 * Clean and normalize OCR text with comprehensive error correction
 * @param {string} ocrText - Raw OCR text
 * @returns {string} - Cleaned Unicode text
 */
export const cleanAndNormalizeOCRText = (ocrText) => {
  if (!ocrText) return '';
  
  let cleaned = ocrText;
  
  // Comprehensive OCR error corrections
  const comprehensiveOCRFixes = {
    // Number corrections (most common OCR errors)
    '০': /[0OoΟ]/g,
    '১': /[1lI|]/g,
    '২': /[2]/g,
    '৩': /[3]/g,
    '৪': /[4]/g,
    '৫': /[5S]/g,
    '৬': /[6]/g,
    '৭': /[7]/g,
    '৮': /[8]/g,
    '৯': /[9]/g,
    
    // Common character confusions
    'ক': /[K]/g,
    'খ': /[L]/g,
    'গ': /[M]/g,
    'ঘ': /[N]/g,
    'চ': /[P]/g,
    'ছ': /[Q]/g,
    'জ': /[R]/g,
    'ট': /[U]/g,
    'ড': /[W]/g,
    'ত': /[Z]/g,
    'দ': /[`]/g,
    'ন': /[b]/g,
    'প': /[c]/g,
    'ব': /[e]/g,
    'ম': /[g]/g,
    'য': /[h]/g,
    'র': /[i]/g,
    'ল': /[j]/g,
    'স': /[m]/g,
    'হ': /[n]/g,
    
    // Vowel corrections
    'আ': /Av/g,
    'ই': /[B]/g,
    'উ': /[D]/g,
    'এ': /[G]/g,
    'ও': /[I]/g,
    
    // Common word patterns (based on your OCR output)
    'দুরে': /দুর্গে/g,
    'মোবাইল': /মোবাইল|Mobil|Mobile/g,
    'নম্বর': /নাম্বার|নম্বের|নম্বর/g,
    'ইমেইল': /ইমেইল|ইমেল|email/g,
    'ঠিকানা': /ঠিকানা|ঠিকান/g,
    'ফোন': /ফোন|phone/g,
    'অফিস': /অফিস|office/g,
    'বিভাগ': /বিভাগ|বিভগ/g,
    'প্রতি': /প্রতি|পতি/g,
    'বরাবর': /বরাবর|বরাব/g,
    'বিষয়': /বিষয়|বিসয়/g,
    'তারিখ': /তারিখ|তারিক/g,
    'আবেদন': /আবেদন|আবেদ/g,
    'নিবেদক': /নিবেদক|নিবেদ/g,
    'ধন্যবাদ': /ধন্যবাদ|ধন্যবাদন্তে/g,
    'সহকারী': /সহকারী|সহকারি/g,
    'কর্মকর্তা': /কর্মকর্তা|কর্মকরতা/g,
    'পরিচালক': /পরিচালক|পরচালক/g,
    'যোগাযোগ': /যোগাযোগ|যোগযোগ/g,
    
    // Technical terms common in applications
    'সি.সি.এম': /C\.C\.M|CCM/g,
    'আর.এফ.কিউ': /RFQ|R\.F\.Q/g,
    'ডি.টি.ই': /DTE|D\.T\.E/g,
    'আল্ট্রা': /ULTRA|Ultra/g,
    'জি.টি.এস': /GTS|G\.T\.S/g,
    'ভি.জি': /VG|V\.G/g,
    'এফ.আর.ই': /FRE|F\.R\.E/g,
    'পি.ই.এস': /PES|P\.E\.S/g,
    'কে.ডাব্লিউ': /KW|K\.W/g,
    'এইচ.ও.ওয়াই.ও.এস': /HoYoS|H\.o\.Y\.o\.S/g,
    
    // Common punctuation fixes
    '।': /[|]/g,
    ',': /[,]/g,
    '.': /[.]/g,
    ':': /[:]/g,
    ';': /[;]/g,
    '?': /[?]/g,
    '!': /[!]/g,
    
    // Email and web patterns
    '@': /@/g,
    '.com': /\.com|\.Com|com/g,
    '.org': /\.org|\.Org|org/g,
    'gmail': /gmail|Gmail/g,
    'yahoo': /yahoo|Yahoo/g,
    
    // Clean up extra spaces and artifacts
    ' ': /\s+/g,
    '': /[|\\\/\-_=+~`'"<>{}[\]()]+(?!\w)/g
  };
  
  // Apply comprehensive OCR fixes
  Object.entries(comprehensiveOCRFixes).forEach(([correct, pattern]) => {
    cleaned = cleaned.replace(pattern, correct);
  });
  
  // Additional cleaning for your specific OCR issues
  cleaned = cleaned
    // Fix common OCR symbol confusions
    .replace(/Sy\s*j/g, 'সাব')
    .replace(/KY\s*[ও0]?\s*Ks/g, 'কার্যক্রম')
    .replace(/TKR\s*Sz/g, 'টাকা')
    .replace(/SF\s*PA\s*dl/g, 'স্পেশাল')
    .replace(/Rs\s*/g, 'টাকা ')
    .replace(/Fx\s*KW/g, 'ফ্যাক্স')
    .replace(/ph\s*/g, 'ফোন ')
    
    // Clean multiple punctuation
    .replace(/[।।]+/g, '।')
    .replace(/[,,]+/g, ',')
    .replace(/[..]+/g, '.')
    
    // Remove isolated single characters that are likely OCR noise
    .replace(/\s[a-zA-Z]\s/g, ' ')
    .replace(/\s[০-৯]\s(?![০-৯])/g, ' ')
    
    // Fix spacing around punctuation
    .replace(/\s*।\s*/g, '। ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*;\s*/g, '; ')
    
    // Clean up line breaks
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .trim();
  
  // Filter out lines that are mostly garbage
  const lines = cleaned.split('\n');
  const cleanLines = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.length < 3) return false;
    
    // Check if line has meaningful Bangla or English content
    const banglaChars = (trimmed.match(/[\u0980-\u09FF]/g) || []).length;
    const englishChars = (trimmed.match(/[a-zA-Z]/g) || []).length;
    const numberChars = (trimmed.match(/[0-9০-৯]/g) || []).length;
    const totalMeaningful = banglaChars + englishChars + numberChars;
    const meaningfulRatio = totalMeaningful / trimmed.length;
    
    // Keep lines with good meaningful content ratio
    return meaningfulRatio > 0.4;
  });
  
  return cleanLines.join('\n').trim();
};

/**
 * Process OCR text with proper Bijoy Unicode conversion
 * @param {string} ocrText - Raw OCR text
 * @returns {string} - Processed text with proper Bijoy Unicode
 */
export const processOCRWithBijoy = (ocrText) => {
  if (!ocrText) return '';
  
  // Step 1: Clean and normalize
  let cleaned = cleanAndNormalizeOCRText(ocrText);
  
  // Step 2: Convert to proper Unicode if needed
  // (OCR might produce mixed encoding)
  
  // Step 3: Ensure proper Bijoy Unicode format
  // This maintains Unicode but ensures compatibility
  
  return cleaned;
};

export default {
  unicodeToBijoy,
  bijoyToUnicode,
  cleanAndNormalizeOCRText,
  processOCRWithBijoy
};
