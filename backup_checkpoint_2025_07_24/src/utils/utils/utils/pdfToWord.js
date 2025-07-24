import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { loadPDFDocument } from './pdfHelper.js';
import { 
  processTextForWord, 
  splitTextPreservingBangla,
  BANGLA_FONT_CONFIG 
} from './banglaTextProcessor.js';

export const convertPdfToWord = async (file, onProgress = () => {}) => {
  try {
    onProgress('পিডিএফ ফাইল প্রস্তুত করা হচ্ছে...');
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    onProgress('পিডিএফ ডকুমেন্ট লোড করা হচ্ছে...');
    
    // Load PDF document with enhanced error handling
    const pdf = await loadPDFDocument(arrayBuffer);
    const numPages = pdf.numPages;
    
    onProgress(`পিডিএফ লোড হয়েছে। মোট পৃষ্ঠা: ${numPages}`);
    
    let allText = '';
    const paragraphs = [];
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress(`পৃষ্ঠা ${pageNum}/${numPages} থেকে লেখা বের করা হচ্ছে...`);
      
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
        .trim();
      
      if (pageText) {
        allText += pageText + '\n\n';
        
        // Add page break paragraph (except for first page)
        if (pageNum > 1) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: '',
                  break: 1
                })
              ]
            })
          );
        }
        
        // Split text into paragraphs and add to document with proper Bangla support
        const lines = splitTextPreservingBangla(pageText);
        for (const line of lines) {
          if (line.trim()) {
            const textConfig = processTextForWord(line);
            
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: textConfig.text,
                    font: textConfig.font,
                    size: textConfig.size,
                    rightToLeft: textConfig.rightToLeft
                  })
                ]
              })
            );
          }
        }
      }
    }
    
    if (!allText.trim()) {
      throw new Error('পিডিএফ থেকে কোনো লেখা পাওয়া যায়নি। এটি একটি স্ক্যান করা ডকুমেন্ট হতে পারে।');
    }
    
    onProgress('ওয়ার্ড ডকুমেন্ট তৈরি করা হচ্ছে...');
    
    // Create Word document
    const doc = new Document({
      sections: [
        {
          children: paragraphs
        }
      ]
    });
    
    // Generate document buffer using browser-compatible method
    const buffer = await Packer.toBlob(doc);
    
    // Create filename
    const originalName = file.name.replace('.pdf', '');
    const docFileName = `${originalName}-text.docx`;
    
    onProgress(`সম্পন্ন! লেখা বের করে ওয়ার্ড ফাইল তৈরি হয়েছে।`);
    
    // Create blob from buffer
    const wordBlob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // Create download URL
    const downloadUrl = URL.createObjectURL(wordBlob);
    
    return {
      success: true,
      message: `সফলভাবে ${numPages} পৃষ্ঠা থেকে লেখা বের করে ওয়ার্ড ফাইল তৈরি হয়েছে।`,
      filename: docFileName,
      downloadUrl: downloadUrl,
      blob: wordBlob,
      textLength: allText.length
    };
    
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    throw new Error(`পিডিএফ থেকে ওয়ার্ড রূপান্তরে সমস্যা হয়েছে: ${error.message}`);
  }
};
