import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export const convertImagesToPdf = async (files, onProgress = () => {}) => {
  try {
    if (!files || files.length === 0) {
      throw new Error('কোনো ছবি নির্বাচন করা হয়নি।');
    }

    onProgress(`${files.length}টি ছবি প্রক্রিয়াকরণ শুরু...`);

    // Create new PDF document
    const pdf = new jsPDF();
    let isFirstPage = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onProgress(`ছবি ${i + 1}/${files.length} যুক্ত করা হচ্ছে...`);

      // Read image file
      const imageData = await readImageFile(file);
      
      // Get image dimensions
      const imgDimensions = await getImageDimensions(imageData);
      
      // Calculate PDF page dimensions (A4 = 210 x 297 mm)
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Calculate scaling to fit image in page while maintaining aspect ratio
      const scaleX = pageWidth / imgDimensions.width;
      const scaleY = pageHeight / imgDimensions.height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
      
      const imgWidth = imgDimensions.width * scale;
      const imgHeight = imgDimensions.height * scale;
      
      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // Add new page for subsequent images
      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      // Add image to PDF
      pdf.addImage(imageData, 'JPEG', x, y, imgWidth, imgHeight);
    }

    onProgress('পিডিএফ ফাইল তৈরি করা হচ্ছে...');

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    
    // Create filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const fileName = `images-to-pdf-${timestamp}.pdf`;

    onProgress(`সম্পন্ন! ${files.length}টি ছবি দিয়ে পিডিএফ তৈরি হয়েছে।`);

    // Create download URL for the PDF
    const downloadUrl = URL.createObjectURL(pdfBlob);

    return {
      success: true,
      message: `সফলভাবে ${files.length}টি ছবি দিয়ে পিডিএফ তৈরি হয়েছে এবং ডাউনলোড শুরু হয়েছে।`,
      filename: fileName,
      downloadUrl: downloadUrl,
      blob: pdfBlob
    };

  } catch (error) {
    console.error('Images to PDF conversion error:', error);
    throw new Error(`ছবি থেকে পিডিএফ রূপান্তরে সমস্যা হয়েছে: ${error.message}`);
  }
};

// Helper function to read image file as data URL
const readImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('ছবি পড়তে সমস্যা হয়েছে।'));
    reader.readAsDataURL(file);
  });
};

// Helper function to get image dimensions
const getImageDimensions = (imageSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => reject(new Error('ছবির মাত্রা নির্ধারণে সমস্যা হয়েছে।'));
    img.src = imageSrc;
  });
};
