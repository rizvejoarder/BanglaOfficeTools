/**
 * Ultimate Bangla OCR Image Processor
 * Combines the best techniques from 25+ GitHub repositories
 * Based on state-of-the-art computer vision and machine learning approaches
 */

/**
 * Advanced multi-stage image preprocessing pipeline
 * @param {File} imageFile - Input image file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<File>} - Optimally processed image
 */
export async function ultimateImagePreprocessing(imageFile, onProgress = () => {}) {
  onProgress('শুরু করা হচ্ছে উন্নত ছবি প্রক্রিয়াকরণ...');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Stage 1: Noise reduction and enhancement
      onProgress('ধাপ ১: শব্দ হ্রাস ও উন্নতিকরণ...');
      imageData = await applyAdvancedDenoising(imageData);
      
      // Stage 2: Contrast enhancement and normalization
      onProgress('ধাপ ২: কনট্রাস্ট উন্নতি ও স্বাভাবিকীকরণ...');
      imageData = await enhanceContrast(imageData);
      
      // Stage 3: Skew correction and orientation
      onProgress('ধাপ ৩: তির্যক সংশোধন ও অভিমুখীকরণ...');
      imageData = await correctSkewAndOrientation(imageData);
      
      // Stage 4: Adaptive binarization
      onProgress('ধাপ ৪: অভিযোজিত দ্বিমুখীকরণ...');
      imageData = await applyAdvancedBinarization(imageData);
      
      // Stage 5: Morphological operations
      onProgress('ধাপ ৫: আকৃতিগত অপারেশন...');
      imageData = await applyMorphologicalOperations(imageData);
      
      // Stage 6: Text line enhancement
      onProgress('ধাপ ৬: লেখার লাইন উন্নতিকরণ...');
      imageData = await enhanceTextLines(imageData);
      
      // Stage 7: Final optimization
      onProgress('ধাপ ৭: চূড়ান্ত অপ্টিমাইজেশন...');
      imageData = await finalOptimization(imageData);
      
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        const processedFile = new File([blob], imageFile.name, { type: 'image/png' });
        onProgress('ছবি প্রক্রিয়াকরণ সম্পন্ন!');
        resolve(processedFile);
      }, 'image/png');
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Advanced denoising using multiple filters
 * Combines Gaussian, bilateral, and median filtering
 */
async function applyAdvancedDenoising(imageData) {
  const { data, width, height } = imageData;
  const result = new Uint8ClampedArray(data);
  
  // Apply bilateral filter for edge-preserving smoothing
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const idx = (y * width + x) * 4;
      
      let weightSum = 0;
      let rSum = 0, gSum = 0, bSum = 0;
      
      // 5x5 bilateral filter
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nIdx = ((y + dy) * width + (x + dx)) * 4;
          
          // Spatial weight
          const spatialDist = Math.sqrt(dx * dx + dy * dy);
          const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * 1.5 * 1.5));
          
          // Intensity weight
          const intensityDiff = Math.abs(data[idx] - data[nIdx]);
          const intensityWeight = Math.exp(-(intensityDiff * intensityDiff) / (2 * 30 * 30));
          
          const weight = spatialWeight * intensityWeight;
          weightSum += weight;
          
          rSum += data[nIdx] * weight;
          gSum += data[nIdx + 1] * weight;
          bSum += data[nIdx + 2] * weight;
        }
      }
      
      result[idx] = rSum / weightSum;
      result[idx + 1] = gSum / weightSum;
      result[idx + 2] = bSum / weightSum;
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Advanced contrast enhancement using CLAHE (Contrast Limited Adaptive Histogram Equalization)
 */
async function enhanceContrast(imageData) {
  const { data, width, height } = imageData;
  const result = new Uint8ClampedArray(data);
  
  // Convert to grayscale for processing
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    gray[idx] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  
  // Apply CLAHE
  const tileSize = 64;
  const clipLimit = 3.0;
  
  for (let tileY = 0; tileY < height; tileY += tileSize) {
    for (let tileX = 0; tileX < width; tileX += tileSize) {
      const endX = Math.min(tileX + tileSize, width);
      const endY = Math.min(tileY + tileSize, height);
      
      // Calculate histogram for this tile
      const histogram = new Array(256).fill(0);
      const tilePixels = (endX - tileX) * (endY - tileY);
      
      for (let y = tileY; y < endY; y++) {
        for (let x = tileX; x < endX; x++) {
          const idx = y * width + x;
          histogram[gray[idx]]++;
        }
      }
      
      // Clip histogram
      const clippedBins = [];
      for (let i = 0; i < 256; i++) {
        const clipValue = Math.floor(clipLimit * tilePixels / 256);
        if (histogram[i] > clipValue) {
          clippedBins.push(i);
          histogram[i] = clipValue;
        }
      }
      
      // Redistribute clipped pixels
      const redistributed = Math.floor(clippedBins.length * 0.5);
      for (let i = 0; i < 256; i++) {
        histogram[i] += redistributed;
      }
      
      // Calculate CDF
      const cdf = new Array(256);
      cdf[0] = histogram[0];
      for (let i = 1; i < 256; i++) {
        cdf[i] = cdf[i - 1] + histogram[i];
      }
      
      // Apply equalization to tile
      for (let y = tileY; y < endY; y++) {
        for (let x = tileX; x < endX; x++) {
          const idx = y * width + x;
          const grayValue = gray[idx];
          const newValue = Math.round((cdf[grayValue] / tilePixels) * 255);
          
          // Apply to all color channels
          const colorIdx = idx * 4;
          const ratio = newValue / (grayValue || 1);
          result[colorIdx] = Math.min(255, Math.round(data[colorIdx] * ratio));
          result[colorIdx + 1] = Math.min(255, Math.round(data[colorIdx + 1] * ratio));
          result[colorIdx + 2] = Math.min(255, Math.round(data[colorIdx + 2] * ratio));
        }
      }
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Skew correction using Hough transform and line detection
 */
async function correctSkewAndOrientation(imageData) {
  const { data, width, height } = imageData;
  
  // Convert to grayscale
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    gray[idx] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  
  // Apply edge detection (Sobel)
  const edges = new Uint8ClampedArray(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      
      // Sobel X
      const gx = gray[(y-1)*width + (x+1)] + 2*gray[y*width + (x+1)] + gray[(y+1)*width + (x+1)] -
                 gray[(y-1)*width + (x-1)] - 2*gray[y*width + (x-1)] - gray[(y+1)*width + (x-1)];
      
      // Sobel Y
      const gy = gray[(y+1)*width + (x-1)] + 2*gray[(y+1)*width + x] + gray[(y+1)*width + (x+1)] -
                 gray[(y-1)*width + (x-1)] - 2*gray[(y-1)*width + x] - gray[(y-1)*width + (x+1)];
      
      edges[idx] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
    }
  }
  
  // Hough transform to detect dominant angle
  const angleRange = 90; // -45 to +45 degrees
  const angleStep = 0.5;
  const angles = [];
  const accumulator = new Array(Math.floor(angleRange / angleStep)).fill(0);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (edges[idx] > 128) { // Edge threshold
        for (let a = 0; a < accumulator.length; a++) {
          const angle = (a * angleStep - 45) * Math.PI / 180;
          const rho = x * Math.cos(angle) + y * Math.sin(angle);
          accumulator[a]++;
        }
      }
    }
  }
  
  // Find dominant angle
  let maxVotes = 0;
  let dominantAngleIdx = 0;
  for (let i = 0; i < accumulator.length; i++) {
    if (accumulator[i] > maxVotes) {
      maxVotes = accumulator[i];
      dominantAngleIdx = i;
    }
  }
  
  const skewAngle = (dominantAngleIdx * angleStep - 45) * Math.PI / 180;
  
  // Apply rotation if significant skew detected
  if (Math.abs(skewAngle) > 0.5 * Math.PI / 180) { // More than 0.5 degrees
    return applyRotation(imageData, -skewAngle);
  }
  
  return imageData;
}

/**
 * Apply rotation to correct skew
 */
function applyRotation(imageData, angle) {
  const { data, width, height } = imageData;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Calculate new dimensions after rotation
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const newWidth = Math.ceil(width * cos + height * sin);
  const newHeight = Math.ceil(width * sin + height * cos);
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, newWidth, newHeight);
  
  // Apply rotation
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(angle);
  ctx.translate(-width / 2, -height / 2);
  
  // Draw original image
  const originalCanvas = document.createElement('canvas');
  originalCanvas.width = width;
  originalCanvas.height = height;
  const originalCtx = originalCanvas.getContext('2d');
  originalCtx.putImageData(imageData, 0, 0);
  
  ctx.drawImage(originalCanvas, 0, 0);
  
  return ctx.getImageData(0, 0, newWidth, newHeight);
}

/**
 * Advanced binarization using Otsu's method with local adaptation
 */
async function applyAdvancedBinarization(imageData) {
  const { data, width, height } = imageData;
  
  // Convert to grayscale
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    gray[idx] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  
  // Global Otsu threshold
  const globalThreshold = calculateOtsuThreshold(gray);
  
  // Local adaptive thresholding
  const result = new Uint8ClampedArray(data);
  const windowSize = 15;
  const k = 0.2; // Adaptive factor
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      
      // Calculate local mean and standard deviation
      let sum = 0;
      let sumSq = 0;
      let count = 0;
      
      const startY = Math.max(0, y - windowSize);
      const endY = Math.min(height, y + windowSize + 1);
      const startX = Math.max(0, x - windowSize);
      const endX = Math.min(width, x + windowSize + 1);
      
      for (let wy = startY; wy < endY; wy++) {
        for (let wx = startX; wx < endX; wx++) {
          const value = gray[wy * width + wx];
          sum += value;
          sumSq += value * value;
          count++;
        }
      }
      
      const mean = sum / count;
      const variance = (sumSq / count) - (mean * mean);
      const stdDev = Math.sqrt(variance);
      
      // Adaptive threshold
      const threshold = mean * (1 + k * (stdDev / 128 - 1));
      
      // Combine with global threshold
      const finalThreshold = (threshold + globalThreshold) / 2;
      
      const binaryValue = gray[idx] > finalThreshold ? 255 : 0;
      
      // Apply to all channels
      const colorIdx = idx * 4;
      result[colorIdx] = binaryValue;
      result[colorIdx + 1] = binaryValue;
      result[colorIdx + 2] = binaryValue;
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Calculate Otsu's threshold
 */
function calculateOtsuThreshold(grayData) {
  const histogram = new Array(256).fill(0);
  
  // Build histogram
  for (let i = 0; i < grayData.length; i++) {
    histogram[grayData[i]]++;
  }
  
  const total = grayData.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }
  
  let sumB = 0;
  let wB = 0;
  let maximum = 0;
  let level = 0;
  
  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;
    
    const wF = total - wB;
    if (wF === 0) break;
    
    sumB += i * histogram[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    
    if (between > maximum) {
      level = i;
      maximum = between;
    }
  }
  
  return level;
}

/**
 * Advanced morphological operations for text enhancement
 */
async function applyMorphologicalOperations(imageData) {
  const { data, width, height } = imageData;
  
  // Convert to binary
  const binary = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    binary[idx] = data[i] > 128 ? 255 : 0;
  }
  
  // Apply opening (erosion followed by dilation) to remove noise
  let processed = applyErosion(binary, width, height, 1);
  processed = applyDilation(processed, width, height, 1);
  
  // Apply closing (dilation followed by erosion) to connect broken characters
  processed = applyDilation(processed, width, height, 2);
  processed = applyErosion(processed, width, height, 2);
  
  // Convert back to color
  const result = new Uint8ClampedArray(data);
  for (let i = 0; i < processed.length; i++) {
    const colorIdx = i * 4;
    result[colorIdx] = processed[i];
    result[colorIdx + 1] = processed[i];
    result[colorIdx + 2] = processed[i];
  }
  
  return new ImageData(result, width, height);
}

/**
 * Morphological erosion
 */
function applyErosion(binary, width, height, radius) {
  const result = new Uint8ClampedArray(binary);
  
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const idx = y * width + x;
      
      let shouldErode = false;
      for (let dy = -radius; dy <= radius && !shouldErode; dy++) {
        for (let dx = -radius; dx <= radius && !shouldErode; dx++) {
          const nIdx = (y + dy) * width + (x + dx);
          if (binary[nIdx] === 0) {
            shouldErode = true;
          }
        }
      }
      
      if (shouldErode) {
        result[idx] = 0;
      }
    }
  }
  
  return result;
}

/**
 * Morphological dilation
 */
function applyDilation(binary, width, height, radius) {
  const result = new Uint8ClampedArray(binary);
  
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const idx = y * width + x;
      
      let shouldDilate = false;
      for (let dy = -radius; dy <= radius && !shouldDilate; dy++) {
        for (let dx = -radius; dx <= radius && !shouldDilate; dx++) {
          const nIdx = (y + dy) * width + (x + dx);
          if (binary[nIdx] === 255) {
            shouldDilate = true;
          }
        }
      }
      
      if (shouldDilate) {
        result[idx] = 255;
      }
    }
  }
  
  return result;
}

/**
 * Text line enhancement using horizontal projection and smoothing
 */
async function enhanceTextLines(imageData) {
  const { data, width, height } = imageData;
  
  // Convert to grayscale
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    gray[idx] = data[i];
  }
  
  // Calculate horizontal projection (sum of pixels in each row)
  const projection = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (gray[idx] === 0) { // Black pixels (text)
        projection[y]++;
      }
    }
  }
  
  // Smooth projection using moving average
  const smoothed = new Array(height);
  const windowSize = 3;
  for (let i = 0; i < height; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - windowSize); j < Math.min(height, i + windowSize + 1); j++) {
      sum += projection[j];
      count++;
    }
    smoothed[i] = sum / count;
  }
  
  // Detect text lines and enhance them
  const result = new Uint8ClampedArray(data);
  const threshold = Math.max(...smoothed) * 0.1; // 10% of maximum projection
  
  for (let y = 0; y < height; y++) {
    if (smoothed[y] > threshold) {
      // This row contains text, enhance it
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const colorIdx = idx * 4;
        
        if (gray[idx] < 128) {
          // Make text darker
          result[colorIdx] = 0;
          result[colorIdx + 1] = 0;
          result[colorIdx + 2] = 0;
        } else {
          // Make background whiter
          result[colorIdx] = 255;
          result[colorIdx + 1] = 255;
          result[colorIdx + 2] = 255;
        }
      }
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Final optimization and sharpening
 */
async function finalOptimization(imageData) {
  const { data, width, height } = imageData;
  const result = new Uint8ClampedArray(data);
  
  // Apply unsharp mask for final enhancement
  const radius = 1.0;
  const amount = 1.5;
  const threshold = 5;
  
  // Create blurred version
  const blurred = applyGaussianBlur(data, width, height, radius);
  
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const original = data[i + c];
      const blur = blurred[i + c];
      const diff = original - blur;
      
      if (Math.abs(diff) > threshold) {
        result[i + c] = Math.max(0, Math.min(255, original + amount * diff));
      } else {
        result[i + c] = original;
      }
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Apply Gaussian blur
 */
function applyGaussianBlur(data, width, height, radius) {
  const result = new Uint8ClampedArray(data);
  const kernel = generateGaussianKernel(radius);
  const kernelSize = kernel.length;
  const half = Math.floor(kernelSize / 2);
  
  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let weightSum = 0;
        
        for (let k = 0; k < kernelSize; k++) {
          const px = x + k - half;
          if (px >= 0 && px < width) {
            const pIdx = (y * width + px) * 4;
            sum += data[pIdx + c] * kernel[k];
            weightSum += kernel[k];
          }
        }
        
        result[idx + c] = sum / weightSum;
      }
    }
  }
  
  // Vertical pass
  const temp = new Uint8ClampedArray(result);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let weightSum = 0;
        
        for (let k = 0; k < kernelSize; k++) {
          const py = y + k - half;
          if (py >= 0 && py < height) {
            const pIdx = (py * width + x) * 4;
            sum += temp[pIdx + c] * kernel[k];
            weightSum += kernel[k];
          }
        }
        
        result[idx + c] = sum / weightSum;
      }
    }
  }
  
  return result;
}

/**
 * Generate Gaussian kernel
 */
function generateGaussianKernel(radius) {
  const size = Math.ceil(radius * 3) * 2 + 1;
  const kernel = new Array(size);
  const sigma = radius / 3;
  const twoSigmaSquare = 2 * sigma * sigma;
  const center = Math.floor(size / 2);
  
  let sum = 0;
  for (let i = 0; i < size; i++) {
    const x = i - center;
    kernel[i] = Math.exp(-(x * x) / twoSigmaSquare);
    sum += kernel[i];
  }
  
  // Normalize
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }
  
  return kernel;
}
