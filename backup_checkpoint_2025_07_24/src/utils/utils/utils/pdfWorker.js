// PDF Worker setup utility
import * as pdfjsLib from 'pdfjs-dist';

let workerInitialized = false;

export const initializePDFWorker = () => {
  if (workerInitialized) return;

  try {
    // Use the exact same version as installed (3.11.174)
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    workerInitialized = true;
    console.log('PDF.js worker initialized successfully');
  } catch (error) {
    console.error('Failed to initialize PDF worker:', error);
    
    // Fallback: try alternative CDN
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      workerInitialized = true;
      console.log('PDF.js worker initialized with fallback CDN');
    } catch (fallbackError) {
      console.error('All PDF worker initialization attempts failed:', fallbackError);
    }
  }
};
