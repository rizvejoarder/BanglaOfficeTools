// Enhanced File Storage and Handling Utilities for AI Assistant
// For AI Assistant file upload, analysis, and management

export const aiFileStorage = {
  // Store uploaded files temporarily
  uploadedFiles: new Map(),
  
  // Generate unique file ID
  generateFileId() {
    return `ai_file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  // Store file with metadata
  storeFile(file, analysisResult = null) {
    const fileId = this.generateFileId();
    const fileData = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      uploadTime: new Date().toISOString(),
      file: file,
      analysisResult: analysisResult,
      status: 'uploaded'
    };
    
    this.uploadedFiles.set(fileId, fileData);
    return fileId;
  },
  
  // Get file by ID
  getFile(fileId) {
    return this.uploadedFiles.get(fileId);
  },
  
  // Get all files
  getAllFiles() {
    return Array.from(this.uploadedFiles.values());
  },
  
  // Update file analysis result
  updateAnalysis(fileId, analysisResult) {
    const fileData = this.uploadedFiles.get(fileId);
    if (fileData) {
      fileData.analysisResult = analysisResult;
      fileData.status = 'analyzed';
      this.uploadedFiles.set(fileId, fileData);
    }
  },
  
  // Remove file
  removeFile(fileId) {
    return this.uploadedFiles.delete(fileId);
  },
  
  // Clear all files
  clearAll() {
    this.uploadedFiles.clear();
  },
  
  // Get file size in human readable format
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Check if file type is supported
  isSupportedFileType(file) {
    const supportedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      
      // Presentations
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Spreadsheets
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    return supportedTypes.includes(file.type);
  },
  
  // Get file type category
  getFileCategory(file) {
    const type = file.type.toLowerCase();
    
    if (type.includes('image/')) return 'image';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word')) return 'document';
    if (type.includes('text/')) return 'text';
    if (type.includes('sheet') || type.includes('excel')) return 'spreadsheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'presentation';
    
    return 'other';
  },
  
  // Read file as text (for text files)
  async readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  },
  
  // Read file as data URL (for images)
  async readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  },
  
  // Validate file before upload
  validateFile(file, maxSize = 10 * 1024 * 1024) { // 10MB default
    const errors = [];
    
    if (!file) {
      errors.push('কোন ফাইল নির্বাচিত হয়নি');
      return { valid: false, errors };
    }
    
    if (!this.isSupportedFileType(file)) {
      errors.push('এই ফাইল টাইপ সাপোর্ট করা হয় না');
    }
    
    if (file.size > maxSize) {
      errors.push(`ফাইল সাইজ ${this.formatFileSize(maxSize)} এর চেয়ে বড়`);
    }
    
    if (file.size === 0) {
      errors.push('ফাইলটি খালি');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },
  
  // Extract text content from different file types
  async extractTextContent(file) {
    const category = this.getFileCategory(file);
    
    switch (category) {
      case 'text':
        return await this.readAsText(file);
        
      case 'image':
        // For OCR processing - return placeholder for now
        return `[ছবি ফাইল: ${file.name} - OCR প্রসেসিং প্রয়োজন]`;
        
      case 'pdf':
        // For PDF text extraction - return placeholder for now
        return `[PDF ফাইল: ${file.name} - PDF টেক্সট এক্সট্রাকশন প্রয়োজন]`;
        
      default:
        return `[${category} ফাইল: ${file.name} - বাইনারি ফাইল বিশ্লেষণ প্রয়োজন]`;
    }
  },
  
  // Generate file summary for AI processing
  generateFileSummary(fileData) {
    const category = this.getFileCategory(fileData.file);
    const summary = {
      name: fileData.name,
      type: fileData.type,
      category: category,
      size: this.formatFileSize(fileData.size),
      uploadTime: fileData.uploadTime,
      hasAnalysis: !!fileData.analysisResult
    };
    
    return summary;
  },
  
  // Get file icon based on category
  getFileIcon(file) {
    const category = this.getFileCategory(file);
    const icons = {
      image: '🖼️',
      pdf: '📄',
      document: '📝',
      text: '📄',
      spreadsheet: '📊',
      presentation: '📊',
      other: '📁'
    };
    
    return icons[category] || icons.other;
  }
};

// Export for use in components
export default aiFileStorage;
