/**
 * Advanced image preprocessing for better OCR accuracy
 * Based on techniques from habibahsan/bangla-ocr repository
 */

/**
 * Enhanced image preprocessing with multiple techniques
 * @param {File} imageFile - The image file to preprocess
 * @returns {Promise<Canvas>} - Preprocessed image canvas
 */
export async function preprocessImageForOCR(imageFile) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Set optimal canvas size (higher resolution for better OCR)
        const scale = Math.min(3000 / img.width, 3000 / img.height, 3);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Step 1: Draw image with initial preprocessing
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Step 2: Get image data for pixel manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Step 3: Convert to grayscale and apply thresholding
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale using luminance formula
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          data[i] = gray;     // Red
          data[i + 1] = gray; // Green
          data[i + 2] = gray; // Blue
          // Alpha stays the same
        }
        
        // Step 4: Apply Otsu's thresholding algorithm
        const threshold = calculateOtsuThreshold(data);
        
        for (let i = 0; i < data.length; i += 4) {
          const value = data[i] > threshold ? 255 : 0;
          data[i] = value;     // Red
          data[i + 1] = value; // Green
          data[i + 2] = value; // Blue
        }
        
        // Step 5: Apply morphological operations (noise reduction)
        const cleanedData = applyMorphologicalOperations(data, canvas.width, canvas.height);
        
        // Step 6: Put processed data back to canvas
        const finalImageData = new ImageData(cleanedData, canvas.width, canvas.height);
        ctx.putImageData(finalImageData, 0, 0);
        
        // Step 7: Apply final sharpening filter
        ctx.filter = 'contrast(1.2) brightness(1.1)';
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
        
        resolve(canvas);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Calculate optimal threshold using Otsu's method
 * @param {Uint8ClampedArray} data - Image pixel data
 * @returns {number} - Optimal threshold value
 */
function calculateOtsuThreshold(data) {
  // Create histogram
  const histogram = new Array(256).fill(0);
  const total = data.length / 4; // Total pixels
  
  for (let i = 0; i < data.length; i += 4) {
    histogram[data[i]]++;
  }
  
  // Normalize histogram
  for (let i = 0; i < 256; i++) {
    histogram[i] /= total;
  }
  
  let maxVariance = 0;
  let threshold = 0;
  
  for (let t = 0; t < 256; t++) {
    let w0 = 0, w1 = 0;
    let sum0 = 0, sum1 = 0;
    
    // Calculate weights and sums
    for (let i = 0; i <= t; i++) {
      w0 += histogram[i];
      sum0 += i * histogram[i];
    }
    
    for (let i = t + 1; i < 256; i++) {
      w1 += histogram[i];
      sum1 += i * histogram[i];
    }
    
    if (w0 === 0 || w1 === 0) continue;
    
    const mean0 = sum0 / w0;
    const mean1 = sum1 / w1;
    const variance = w0 * w1 * (mean0 - mean1) * (mean0 - mean1);
    
    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }
  
  return threshold;
}

/**
 * Apply morphological operations for noise reduction
 * @param {Uint8ClampedArray} data - Image pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Uint8ClampedArray} - Cleaned pixel data
 */
function applyMorphologicalOperations(data, width, height) {
  const result = new Uint8ClampedArray(data.length);
  
  // Apply erosion followed by dilation (opening operation)
  // This removes small noise while preserving text structure
  
  const kernel = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ];
  
  // Erosion
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      let minVal = 255;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          if (kernel[ky + 1][kx + 1] === 1) {
            const nIdx = ((y + ky) * width + (x + kx)) * 4;
            minVal = Math.min(minVal, data[nIdx]);
          }
        }
      }
      
      result[idx] = minVal;
      result[idx + 1] = minVal;
      result[idx + 2] = minVal;
      result[idx + 3] = data[idx + 3];
    }
  }
  
  // Dilation
  const dilated = new Uint8ClampedArray(data.length);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      let maxVal = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          if (kernel[ky + 1][kx + 1] === 1) {
            const nIdx = ((y + ky) * width + (x + kx)) * 4;
            maxVal = Math.max(maxVal, result[nIdx]);
          }
        }
      }
      
      dilated[idx] = maxVal;
      dilated[idx + 1] = maxVal;
      dilated[idx + 2] = maxVal;
      dilated[idx + 3] = data[idx + 3];
    }
  }
  
  return dilated;
}

/**
 * Apply advanced noise reduction techniques
 * @param {Canvas} canvas - Preprocessed canvas
 * @returns {Canvas} - Noise-reduced canvas
 */
export function applyAdvancedNoiseReduction(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply median filter for salt-and-pepper noise
  const filtered = applyMedianFilter(data, canvas.width, canvas.height);
  
  const finalImageData = new ImageData(filtered, canvas.width, canvas.height);
  ctx.putImageData(finalImageData, 0, 0);
  
  return canvas;
}

/**
 * Apply median filter for noise reduction
 * @param {Uint8ClampedArray} data - Image pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Uint8ClampedArray} - Filtered pixel data
 */
function applyMedianFilter(data, width, height) {
  const result = new Uint8ClampedArray(data.length);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const neighbors = [];
      
      // Collect 3x3 neighborhood
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = ((y + dy) * width + (x + dx)) * 4;
          neighbors.push(data[nIdx]);
        }
      }
      
      // Find median
      neighbors.sort((a, b) => a - b);
      const median = neighbors[Math.floor(neighbors.length / 2)];
      
      result[idx] = median;
      result[idx + 1] = median;
      result[idx + 2] = median;
      result[idx + 3] = data[idx + 3];
    }
  }
  
  return result;
}
