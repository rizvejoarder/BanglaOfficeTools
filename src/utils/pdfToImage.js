import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { loadPDFDocument } from './pdfHelper.js';

export const convertPdfToImages = async (file, onProgress = () => {}) => {
  try {
    onProgress('পিডিএফ ফাইল প্রস্তুত করা হচ্ছে...');
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    onProgress('পিডিএফ ডকুমেন্ট লোড করা হচ্ছে...');
    
    // Load PDF document with enhanced error handling
    const pdf = await loadPDFDocument(arrayBuffer);
    const numPages = pdf.numPages;
    
    onProgress(`পিডিএফ লোড হয়েছে। মোট পৃষ্ঠা: ${numPages}`);
    
    const zip = new JSZip();
    const images = [];
    
    // Convert each page to image
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress(`পৃষ্ঠা ${pageNum}/${numPages} প্রক্রিয়াকরণ করা হচ্ছে...`);
      
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // High quality
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });
      
      // Add to zip file
      const fileName = `page-${pageNum.toString().padStart(3, '0')}.png`;
      zip.file(fileName, blob);
      images.push({ pageNum, fileName, blob });
    }
    
    onProgress('জিপ ফাইল তৈরি করা হচ্ছে...');
    
    // Generate zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Create download filename
    const originalName = file.name.replace('.pdf', '');
    const zipFileName = `${originalName}-images.zip`;
    
    onProgress(`সম্পন্ন! ${numPages}টি ছবি তৈরি হয়েছে।`);
    
    // Create download URL for the zip
    const downloadUrl = URL.createObjectURL(zipBlob);
    
    return {
      success: true,
      message: `সফলভাবে ${numPages}টি ছবি তৈরি হয়েছে এবং ডাউনলোড শুরু হয়েছে।`,
      images: images,
      filename: zipFileName,
      downloadUrl: downloadUrl,
      zipBlob: zipBlob,
      zipUrl: downloadUrl
    };
    
  } catch (error) {
    console.error('PDF to Image conversion error:', error);
    throw new Error(`পিডিএফ রূপান্তরে সমস্যা হয়েছে: ${error.message}`);
  }
};
