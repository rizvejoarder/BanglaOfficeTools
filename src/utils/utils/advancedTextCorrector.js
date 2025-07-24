/**
 * Advanced Bangla text correction and normalization
 * Based on techniques from habibahsan/bangla-ocr repository
 */

import { unicodeToBijoy } from './bijoyConverter.js';

/**
 * Advanced Bangla text correction pipeline
 * @param {string} rawText - Raw OCR text
 * @returns {string} - Corrected and normalized text
 */
export function applyAdvancedTextCorrection(rawText) {
  if (!rawText || rawText.trim().length === 0) return '';
  
  let corrected = rawText;
  
  // Step 1: Basic cleaning and normalization
  corrected = normalizeUnicodeText(corrected);
  
  // Step 2: Apply contextual corrections
  corrected = applyContextualCorrections(corrected);
  
  // Step 3: Fix common OCR patterns
  corrected = fixCommonOCRPatterns(corrected);
  
  // Step 4: Apply linguistic rules
  corrected = applyLinguisticRules(corrected);
  
  // Step 5: Final cleanup
  corrected = finalCleanup(corrected);
  
  return corrected;
}

/**
 * Normalize Unicode text (similar to bnunicodenormalizer)
 * @param {string} text - Input text
 * @returns {string} - Normalized text
 */
function normalizeUnicodeText(text) {
  let normalized = text;
  
  // Unicode normalization mappings for common Bangla characters
  const normalizations = {
    // Normalize different Unicode representations of same characters
    'ক': /[\u0995\u09FA]/g,
    'খ': /[\u0996]/g,
    'গ': /[\u0997]/g,
    'ঘ': /[\u0998]/g,
    'ঙ': /[\u0999]/g,
    'চ': /[\u099A]/g,
    'ছ': /[\u099B]/g,
    'জ': /[\u099C]/g,
    'ঝ': /[\u099D]/g,
    'ঞ': /[\u099E]/g,
    'ট': /[\u099F]/g,
    'ঠ': /[\u09A0]/g,
    'ড': /[\u09A1]/g,
    'ঢ': /[\u09A2]/g,
    'ণ': /[\u09A3]/g,
    'ত': /[\u09A4]/g,
    'থ': /[\u09A5]/g,
    'দ': /[\u09A6]/g,
    'ধ': /[\u09A7]/g,
    'ন': /[\u09A8]/g,
    'প': /[\u09AA]/g,
    'ফ': /[\u09AB]/g,
    'ব': /[\u09AC]/g,
    'ভ': /[\u09AD]/g,
    'ম': /[\u09AE]/g,
    'য': /[\u09AF]/g,
    'র': /[\u09B0]/g,
    'ল': /[\u09B2]/g,
    'শ': /[\u09B6]/g,
    'ষ': /[\u09B7]/g,
    'স': /[\u09B8]/g,
    'হ': /[\u09B9]/g,
    
    // Normalize vowel marks
    'া': /[\u09BE]/g,
    'ি': /[\u09BF]/g,
    'ী': /[\u09C0]/g,
    'ু': /[\u09C1]/g,
    'ূ': /[\u09C2]/g,
    'ৃ': /[\u09C3]/g,
    'ে': /[\u09C7]/g,
    'ৈ': /[\u09C8]/g,
    'ো': /[\u09CB]/g,
    'ৌ': /[\u09CC]/g,
    '্': /[\u09CD]/g,
    
    // Normalize digits
    '০': /[0০]/g,
    '১': /[1১]/g,
    '২': /[2২]/g,
    '৩': /[3৩]/g,
    '৪': /[4৪]/g,
    '৫': /[5৫]/g,
    '৬': /[6৬]/g,
    '৭': /[7৭]/g,
    '৮': /[8৮]/g,
    '৯': /[9৯]/g,
  };
  
  Object.entries(normalizations).forEach(([correct, pattern]) => {
    normalized = normalized.replace(pattern, correct);
  });
  
  return normalized;
}

/**
 * Apply contextual corrections based on word patterns
 * @param {string} text - Input text
 * @returns {string} - Contextually corrected text
 */
function applyContextualCorrections(text) {
  let corrected = text;
  
  // Common word corrections based on context
  const contextualCorrections = {
    // Addressing patterns
    'প্রিয় মহোদয়': /প্রিয়\s*মহোদয়|প্রিয়\s*মহোদয়/gi,
    'মাননীয় প্রধানমন্ত্রী': /মাননীয়\s*প্রধানমন্ত্রী|মান্নীয়\s*প্রধানমন্ত্রী/gi,
    'মহোদয়': /মহোদয়|মোহোদয়|মহোদয/gi,
    'মহোদয়া': /মহোদয়া|মোহোদয়া/gi,
    
    // Common government terms
    'সচিব': /সচিব|সেচিব|সচীব/gi,
    'মন্ত্রণালয়': /মন্ত্রণালয়|মন্ত্রনালয়|মন্ত্রণালয/gi,
    'অধিদপ্তর': /অধিদপ্তর|অধিদফতর|অধিদপতর/gi,
    'কর্মকর্তা': /কর্মকর্তা|কর্মকরতা|কর্মকর্ত্তা/gi,
    'সহকারী': /সহকারী|সহকারি|সহকার্যী/gi,
    'পরিচালক': /পরিচালক|পরচালক|পরিচালক/gi,
    
    // Common application terms
    'আবেদন': /আবেদন|আবেদান|আবেদন/gi,
    'আবেদনকারী': /আবেদনকারী|আবেদনকারি|আবেদনকার্যী/gi,
    'নিবেদক': /নিবেদক|নিবেদন|নিবেদক/gi,
    'প্রার্থী': /প্রার্থী|প্রার্থি|প্রার্থী/gi,
    
    // Contact information
    'মোবাইল': /মোবাইল|মোবাইল|মবাইল/gi,
    'নম্বর': /নম্বর|নাম্বার|নম্বের/gi,
    'ঠিকানা': /ঠিকানা|ঠিকান|ঠিকানা/gi,
    'ইমেইল': /ইমেইল|ইমেল|ইমেইল/gi,
    'ফোন': /ফোন|ফোন/gi,
    'ফ্যাক্স': /ফ্যাক্স|ফ্যাক্স/gi,
    
    // Date and time
    'তারিখ': /তারিখ|তারিক|তারিখ/gi,
    'সাল': /সাল|সাল/gi,
    'মাস': /মাস|মাস/gi,
    'দিন': /দিন|দিন/gi,
    
    // Closing statements
    'ধন্যবাদান্তে': /ধন্যবাদান্তে|ধন্যবাদান্ত|ধন্যবাদান্তে/gi,
    'বিনীত': /বিনীত|বিনিত|বিনীত/gi,
    'বিনীতভাবে': /বিনীতভাবে|বিনিতভাবে|বিনীতভাবে/gi,
    'সাদর': /সাদর|সাদর/gi,
    'শ্রদ্ধাসহ': /শ্রদ্ধাসহ|শ্রদ্ধাসহ/gi,
    
    // Numbers and amounts
    'টাকা': /টাকা|টাকা/gi,
    'পয়সা': /পয়সা|পয়সা/gi,
    'হাজার': /হাজার|হাজার/gi,
    'লক্ষ': /লক্ষ|লক্ষ/gi,
    'কোটি': /কোটি|কোটি/gi,
  };
  
  Object.entries(contextualCorrections).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Fix common OCR pattern errors
 * @param {string} text - Input text
 * @returns {string} - Pattern-corrected text
 */
function fixCommonOCRPatterns(text) {
  let corrected = text;
  
  // Common OCR misreadings
  const ocrPatterns = {
    // Character confusions
    'ড়': /ড়|র্|ঢ়/g,
    'ঢ়': /ঢ়|ঢ/g,
    'য়': /য়|য/g,
    'ৎ': /ৎ|ত্/g,
    
    // Common conjunct confusions
    'ক্ত': /ক্ত|কত/g,
    'ক্র': /ক্র|কর/g,
    'গ্র': /গ্র|গর/g,
    'ঙ্গ': /ঙ্গ|ঙগ/g,
    'চ্চ': /চ্চ|চচ/g,
    'জ্জ': /জ্জ|জজ/g,
    'ট্ট': /ট্ট|টট/g,
    'দ্দ': /দ্দ|দদ/g,
    'ন্ত': /ন্ত|নত/g,
    'ন্দ': /ন্দ|নদ/g,
    'প্প': /প্প|পপ/g,
    'ব্ব': /ব্ব|বব/g,
    'ম্ম': /ম্ম|মম/g,
    'ল্ল': /ল্ল|লল/g,
    'স্স': /স্স|সস/g,
    
    // Vowel mark corrections
    'কা': /কা|ক া/g,
    'কি': /কি|ক ি/g,
    'কী': /কী|ক ী/g,
    'কু': /কু|ক ু/g,
    'কূ': /কূ|ক ূ/g,
    'কে': /কে|ক ে/g,
    'কৈ': /কৈ|ক ৈ/g,
    'কো': /কো|ক ো/g,
    'কৌ': /কৌ|ক ৌ/g,
    
    // Punctuation corrections
    '।': /[।|]/g,
    ',': /[,]/g,
    '.': /[.]/g,
    ':': /[:]/g,
    ';': /[;]/g,
    '?': /[?]/g,
    '!': /[!]/g,
    '"': /[""]/g,
    "'": /['']/g,
  };
  
  Object.entries(ocrPatterns).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Apply linguistic rules for better text coherence
 * @param {string} text - Input text
 * @returns {string} - Linguistically corrected text
 */
function applyLinguisticRules(text) {
  let corrected = text;
  
  // Apply sandhi rules (vowel harmony in Bengali)
  const sandhiRules = {
    // Vowel + vowel combinations
    'আ + ই': /আ\s*ই/g,
    'এ + অ': /এ\s*অ/g,
    'ও + আ': /ও\s*আ/g,
    
    // Common prefix-suffix combinations
    'নিম্ন': /নিম্ন|নিম্ন/g,
    'উপ-': /উপ-|উপ/g,
    'সহ-': /সহ-|সহ/g,
    'প্রতি-': /প্রতি-|প্রতি/g,
    'অতি-': /অতি-|অতি/g,
    
    // Compound word corrections
    'সরকারি': /সরকারি|সরকারী/g,
    'বেসরকারি': /বেসরকারি|বেসরকারী/g,
    'জাতীয়': /জাতীয়|জাতিয়/g,
    'আন্তর্জাতিক': /আন্তর্জাতিক|আন্তর্জাতিক/g,
  };
  
  Object.entries(sandhiRules).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Final cleanup and formatting
 * @param {string} text - Input text
 * @returns {string} - Final cleaned text
 */
function finalCleanup(text) {
  let cleaned = text;
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Fix spacing around punctuation
  cleaned = cleaned.replace(/\s*।\s*/g, '। ');
  cleaned = cleaned.replace(/\s*,\s*/g, ', ');
  cleaned = cleaned.replace(/\s*:\s*/g, ': ');
  cleaned = cleaned.replace(/\s*;\s*/g, '; ');
  
  // Remove leading/trailing whitespace from lines
  cleaned = cleaned.replace(/^\s+/gm, '');
  cleaned = cleaned.replace(/\s+$/gm, '');
  
  // Normalize line breaks
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
  
  // Remove empty lines at start and end
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Enhanced post-processing for specific document types
 * @param {string} text - Input text
 * @param {string} documentType - Type of document (application, letter, form, etc.)
 * @returns {string} - Post-processed text
 */
export function applyDocumentSpecificCorrections(text, documentType = 'general') {
  let corrected = text;
  
  switch (documentType.toLowerCase()) {
    case 'application':
    case 'আবেদন':
      corrected = applyApplicationCorrections(corrected);
      break;
    case 'letter':
    case 'চিঠি':
      corrected = applyLetterCorrections(corrected);
      break;
    case 'form':
    case 'ফর্ম':
      corrected = applyFormCorrections(corrected);
      break;
    case 'official':
    case 'সরকারি':
      corrected = applyOfficialCorrections(corrected);
      break;
    default:
      corrected = applyGeneralCorrections(corrected);
  }
  
  return corrected;
}

/**
 * Apply corrections specific to applications
 * @param {string} text - Input text
 * @returns {string} - Corrected text
 */
function applyApplicationCorrections(text) {
  let corrected = text;
  
  const applicationTerms = {
    'বরাবর': /বরাবর|বরাব|বারাবর/gi,
    'বিষয়': /বিষয়|বিসয়|বিষয/gi,
    'জনাব': /জনাব|জোনাব|জনাব/gi,
    'জনাবা': /জনাবা|জোনাবা|জনাবা/gi,
    'হতে': /হতে|হইতে|হতে/gi,
    'করে': /করে|করিয়া|করে/gi,
    'দেওয়া': /দেওয়া|দেয়া|দেওয়া/gi,
    'হওয়া': /হওয়া|হওয়া|হওয়া/gi,
  };
  
  Object.entries(applicationTerms).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Apply corrections specific to letters
 * @param {string} text - Input text
 * @returns {string} - Corrected text
 */
function applyLetterCorrections(text) {
  let corrected = text;
  
  const letterTerms = {
    'প্রিয়': /প্রিয়|প্রিয/gi,
    'স্নেহের': /স্নেহের|স্নেহর/gi,
    'ভালোবাসার': /ভালোবাসার|ভালবাসার/gi,
    'শুভেচ্ছা': /শুভেচ্ছা|শুভেচ্ছা/gi,
    'কুশল': /কুশল|কুসল/gi,
    'মঙ্গল': /মঙ্গল|মংগল/gi,
  };
  
  Object.entries(letterTerms).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Apply corrections specific to forms
 * @param {string} text - Input text
 * @returns {string} - Corrected text
 */
function applyFormCorrections(text) {
  let corrected = text;
  
  const formTerms = {
    'ক্রমিক': /ক্রমিক|ক্রমিক/gi,
    'বিবরণ': /বিবরণ|বিবরন/gi,
    'পরিমাণ': /পরিমাণ|পরিমান/gi,
    'একক': /একক|একক/gi,
    'মোট': /মোট|মোট/gi,
    'যোগফল': /যোগফল|যোগফল/gi,
    'সর্বমোট': /সর্বমোট|সর্বমোট/gi,
  };
  
  Object.entries(formTerms).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Apply corrections specific to official documents
 * @param {string} text - Input text
 * @returns {string} - Corrected text
 */
function applyOfficialCorrections(text) {
  let corrected = text;
  
  const officialTerms = {
    'গণপ্রজাতন্ত্রী': /গণপ্রজাতন্ত্রী|গনপ্রজাতন্ত্রী/gi,
    'বাংলাদেশ': /বাংলাদেশ|বাংলাদেস/gi,
    'সরকার': /সরকার|সরকার/gi,
    'মন্ত্রিপরিষদ': /মন্ত্রিপরিষদ|মন্ত্রীপরিষদ/gi,
    'জাতীয় সংসদ': /জাতীয়\s*সংসদ|জাতিয়\s*সংসদ/gi,
  };
  
  Object.entries(officialTerms).forEach(([correct, pattern]) => {
    corrected = corrected.replace(pattern, correct);
  });
  
  return corrected;
}

/**
 * Apply general corrections
 * @param {string} text - Input text
 * @returns {string} - Corrected text
 */
function applyGeneralCorrections(text) {
  // Apply basic corrections for general text
  return text;
}
