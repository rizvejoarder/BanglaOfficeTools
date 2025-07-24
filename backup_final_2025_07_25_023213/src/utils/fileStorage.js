/**
 * Temporary File Storage System
 * Stores files temporarily for sharing purposes
 * Files are automatically deleted after 24 hours
 */

class TemporaryFileStorage {
  constructor() {
    this.storage = new Map();
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.baseUrl = window.location.origin + window.location.pathname;
    
    // Clean up expired files every hour
    setInterval(() => {
      this.cleanupExpiredFiles();
    }, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Store a file temporarily and return a shareable link
   * @param {Blob} blob - The file blob
   * @param {string} filename - Original filename
   * @param {string} mimeType - File MIME type
   * @returns {object} - Object with fileId, shareUrl, and expiry info
   */
  storeFile(blob, filename, mimeType) {
    const fileId = this.generateFileId();
    const expiryTime = Date.now() + this.maxAge;
    
    // Create object URL for the blob
    const objectUrl = URL.createObjectURL(blob);
    
    const fileInfo = {
      id: fileId,
      filename: filename,
      mimeType: mimeType,
      size: blob.size,
      objectUrl: objectUrl,
      createdAt: Date.now(),
      expiryTime: expiryTime,
      accessCount: 0,
      maxAccess: 100 // Limit downloads
    };
    
    this.storage.set(fileId, fileInfo);
    
    const shareUrl = `${this.baseUrl}?share=${fileId}`;
    const expiryDate = new Date(expiryTime);
    
    return {
      fileId: fileId,
      shareUrl: shareUrl,
      filename: filename,
      size: this.formatFileSize(blob.size),
      expiryTime: expiryDate.toLocaleString('bn-BD'),
      expiryHours: Math.round((expiryTime - Date.now()) / (60 * 60 * 1000))
    };
  }

  /**
   * Retrieve a file by ID
   * @param {string} fileId - File ID
   * @returns {object|null} - File info or null if not found/expired
   */
  getFile(fileId) {
    const fileInfo = this.storage.get(fileId);
    
    if (!fileInfo) {
      return null;
    }
    
    // Check if file is expired
    if (Date.now() > fileInfo.expiryTime) {
      this.deleteFile(fileId);
      return null;
    }
    
    // Check access limit
    if (fileInfo.accessCount >= fileInfo.maxAccess) {
      return null;
    }
    
    // Increment access count
    fileInfo.accessCount++;
    
    return fileInfo;
  }

  /**
   * Download a file by ID
   * @param {string} fileId - File ID
   * @returns {boolean} - Success status
   */
  downloadFile(fileId) {
    const fileInfo = this.getFile(fileId);
    
    if (!fileInfo) {
      return false;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = fileInfo.objectUrl;
    link.download = fileInfo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }

  /**
   * Delete a file
   * @param {string} fileId - File ID
   */
  deleteFile(fileId) {
    const fileInfo = this.storage.get(fileId);
    if (fileInfo && fileInfo.objectUrl) {
      URL.revokeObjectURL(fileInfo.objectUrl);
    }
    this.storage.delete(fileId);
  }

  /**
   * Clean up expired files
   */
  cleanupExpiredFiles() {
    const now = Date.now();
    const expiredIds = [];
    
    for (const [fileId, fileInfo] of this.storage.entries()) {
      if (now > fileInfo.expiryTime) {
        expiredIds.push(fileId);
      }
    }
    
    expiredIds.forEach(fileId => {
      this.deleteFile(fileId);
    });
    
    if (expiredIds.length > 0) {
      console.log(`Cleaned up ${expiredIds.length} expired files`);
    }
  }

  /**
   * Generate unique file ID
   * @returns {string} - Unique file ID
   */
  generateFileId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `file_${timestamp}_${randomStr}`;
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get storage statistics
   * @returns {object} - Storage stats
   */
  getStats() {
    const now = Date.now();
    let totalFiles = 0;
    let totalSize = 0;
    let expiredFiles = 0;
    
    for (const [fileId, fileInfo] of this.storage.entries()) {
      totalFiles++;
      totalSize += fileInfo.size;
      
      if (now > fileInfo.expiryTime) {
        expiredFiles++;
      }
    }
    
    return {
      totalFiles,
      activeFiles: totalFiles - expiredFiles,
      expiredFiles,
      totalSize: this.formatFileSize(totalSize)
    };
  }
}

// Create global instance
const fileStorage = new TemporaryFileStorage();

// Handle shared file downloads from URL
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');
  
  if (shareId) {
    const fileInfo = fileStorage.getFile(shareId);
    if (fileInfo) {
      // Show download dialog
      const download = confirm(
        `ফাইল ডাউনলোড করতে চান?\n\n` +
        `ফাইলের নাম: ${fileInfo.filename}\n` +
        `আকার: ${fileStorage.formatFileSize(fileInfo.size)}\n` +
        `মেয়াদ উত্তীর্ণ: ${new Date(fileInfo.expiryTime).toLocaleString('bn-BD')}\n\n` +
        `ডাউনলোড সংখ্যা: ${fileInfo.accessCount}/${fileInfo.maxAccess}`
      );
      
      if (download) {
        if (fileStorage.downloadFile(shareId)) {
          alert('ফাইল ডাউনলোড শুরু হয়েছে!');
        } else {
          alert('ফাইল ডাউনলোড করতে সমস্যা হয়েছে। ফাইলটি মেয়াদ উত্তীর্ণ হতে পারে।');
        }
      }
      
      // Remove share parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      alert('ফাইল পাওয়া যায়নি। ফাইলটি মেয়াদ উত্তীর্ণ বা মুছে ফেলা হয়েছে।');
      // Remove share parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }
});

export default fileStorage;
