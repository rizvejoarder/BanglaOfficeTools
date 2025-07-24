// Main utility exports for Bangla Office Tools
export { convertPdfToImages } from './pdfToImage.js';
export { convertImagesToPdf } from './imageToPdf.js';
export { convertPdfToWord } from './pdfToWord.js';
export { convertImageToWord } from './imageToWord.js';
export { convertWordToPdf } from './wordToPdf.js';

// Tools configuration
export { tools } from './toolsConfig.js';

// Advanced processing utilities
export { preprocessImageForOCR } from './advancedImageProcessor.js';
export { applyAdvancedTextCorrection, applyDocumentSpecificCorrections } from './advancedTextCorrector.js';
export { ultimateImagePreprocessing } from './ultimateImageProcessor.js';
export { ultimateTextCorrection } from './ultimateTextCorrector.js';

// Bangla text processing utilities
export { 
  hasBanglaText, 
  normalizeBanglaText, 
  processTextForWord, 
  getAppropriateFont,
  detectDocumentElement,
  BANGLA_FONT_CONFIG 
} from './banglaTextProcessor.js';

// Bijoy Unicode converter utilities
export { 
  unicodeToBijoy, 
  bijoyToUnicode,
  processOCRWithBijoy,
  cleanAndNormalizeOCRText 
} from './bijoyConverter.js';

// Utility function to validate file types
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// Utility function to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility function for error handling
export const handleError = (error, defaultMessage = 'একটি সমস্যা হয়েছে।') => {
  console.error('Error:', error);
  return error.message || defaultMessage;
};
