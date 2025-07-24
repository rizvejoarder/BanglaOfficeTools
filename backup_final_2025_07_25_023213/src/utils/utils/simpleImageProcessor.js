/**
 * Simple but effective image preprocessing for Bengali OCR
 * Focuses on proven techniques that work reliably
 */

/**
 * Simple and reliable image preprocessing
 * @param {File} imageFile - The image file to preprocess
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<File>} - Preprocessed image file
 */
export async function preprocessImageForOCR(imageFile, onProgress = () => {}) {
  onProgress('ছবি প্রক্রিয়াকরণ শুরু হচ্ছে...');
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Step 1: Set optimal resolution for OCR
        onProgress('রেজোলিউশন অপ্টিমাইজেশন...');
        const targetWidth = Math.min(2400, img.width * 2);
        const targetHeight = Math.min(2400, img.height * 2);
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Step 2: Draw with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Step 3: Get image data
        onProgress('ছবির গুণমান উন্নতিকরণ...');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Step 4: Convert to grayscale with optimal contrast
        for (let i = 0; i < data.length; i += 4) {
          // Enhanced grayscale conversion for Bengali text
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          
          // Apply contrast enhancement
          const enhanced = gray < 128 ? Math.max(0, gray - 20) : Math.min(255, gray + 20);
          
          data[i] = enhanced;     // Red
          data[i + 1] = enhanced; // Green  
          data[i + 2] = enhanced; // Blue
          // Alpha unchanged
        }
        
        // Step 5: Apply adaptive thresholding
        onProgress('অভিযোজিত থ্রেশহোল্ডিং প্রয়োগ...');
        const threshold = calculateAdaptiveThreshold(data, canvas.width, canvas.height);
        
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i];
          const binary = gray > threshold ? 255 : 0;
          
          data[i] = binary;
          data[i + 1] = binary;
          data[i + 2] = binary;
        }
        
        // Step 6: Apply the processed data back to canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Step 7: Convert canvas to blob and then to file
        onProgress('চূড়ান্ত প্রক্রিয়াকরণ...');
        canvas.toBlob((blob) => {
          const processedFile = new File([blob], imageFile.name, {
            type: 'image/png',
            lastModified: Date.now()
          });
          
          onProgress('ছবি প্রক্রিয়াকরণ সম্পন্ন!');
          resolve(processedFile);
        }, 'image/png', 1.0);
        
      } catch (error) {
        console.error('Image preprocessing error:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('ছবি লোড করতে ব্যর্থ'));
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Calculate adaptive threshold using Otsu's method
 */
function calculateAdaptiveThreshold(data, width, height) {
  // Create histogram
  const histogram = new Array(256).fill(0);
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    histogram[gray]++;
  }
  
  const total = width * height;
  let sum = 0;
  
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }
  
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 0;
  
  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;
    
    wF = total - wB;
    if (wF === 0) break;
    
    sumB += i * histogram[i];
    
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    
    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = i;
    }
  }
  
  // Adjust threshold for Bengali text (slightly lower for better text detection)
  return Math.max(120, threshold - 10);
}
