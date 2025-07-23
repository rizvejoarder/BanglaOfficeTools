import Tesseract from 'tesseract.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { processTextForWord, splitTextPreservingBangla } from './banglaTextProcessor.js';

export const convertImageToWord = async (file, onProgress = () => {}) => {
  try {
    onProgress('ছবি প্রক্রিয়াকরণ শুরু হচ্ছে...');

    const result = await Tesseract.recognize(file, 'ben+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const progress = Math.round(m.progress * 100);
          onProgress(`লেখা শনাক্ত করা হচ্ছে: ${progress}%`);
        }
      },
    });

    onProgress('লেখা প্রস্তুত করা হচ্ছে...');
    const { data: { text } } = result;

    if (!text || text.trim().length === 0) {
      throw new Error('ছবি থেকে কোনো লেখা পাওয়া যায়নি।');
    }

    const lines = splitTextPreservingBangla(text);
    const paragraphs = lines.map(line => {
      const textConfig = processTextForWord(line);
      return new Paragraph({
        children: [
          new TextRun({
            text: textConfig.text,
            font: textConfig.font,
            size: textConfig.size,
          }),
        ],
      });
    });

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
        },
      ],
    });

    onProgress('Word ফাইল তৈরি করা হচ্ছে...');
    const blob = await Packer.toBlob(doc);
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const docFileName = `${originalName}.docx`;

    saveAs(blob, docFileName);

    return {
      success: true,
      message: 'সফলভাবে ছবি থেকে Word-এ রূপান্তরিত হয়েছে।',
      fileName: docFileName,
    };
  } catch (error) {
    console.error('Image to Word conversion error:', error);
    throw new Error(`ছবি থেকে Word রূপান্তরে সমস্যা হয়েছে: ${error.message}`);
  }
};