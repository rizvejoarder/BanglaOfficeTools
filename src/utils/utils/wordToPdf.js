import { renderAsync } from 'docx-preview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const convertWordToPdf = async (file, onProgress = () => {}) => {
  try {
    onProgress('Word ফাইল লোড করা হচ্ছে...');
    const arrayBuffer = await file.arrayBuffer();

    // Create a container for the rendered Word document
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    onProgress('Word ফাইল রেন্ডার করা হচ্ছে...');
    await renderAsync(arrayBuffer, container);

    onProgress('PDF তৈরি করা হচ্ছে...');
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const width = pdfWidth;
    const height = width / ratio;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    
    // Cleanup the container
    document.body.removeChild(container);

    onProgress('PDF ডাউনলোড করা হচ্ছে...');
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const pdfFileName = `${originalName}.pdf`;
    
    // Get PDF as blob instead of auto-downloading
    const pdfBlob = pdf.output('blob');
    
    // Create download URL
    const downloadUrl = URL.createObjectURL(pdfBlob);

    return {
      success: true,
      message: 'সফলভাবে Word থেকে PDF-এ রূপান্তরিত হয়েছে।',
      filename: pdfFileName,
      downloadUrl: downloadUrl,
      blob: pdfBlob
    };
  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    throw new Error(`Word থেকে PDF রূপান্তরে সমস্যা হয়েছে: ${error.message}`);
  }
};