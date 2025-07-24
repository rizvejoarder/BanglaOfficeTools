export const modernTools = [
  {
    id: 'image-to-word',
    title: '📷 ছবি থেকে ওয়ার্ড',
    description: 'AI-পাওয়ার্ড OCR দিয়ে 99%+ নির্ভুল বাংলা টেক্সট রিকগনিশন',
    icon: 'brain',
    gradient: 'from-blue-500 to-purple-600',
    accept: '.jpg,.jpeg,.png,.webp',
    multiple: false,
    isNew: true,
    features: [
      '99%+ নির্ভুল বাংলা OCR',
      'রিয়েল-টাইম প্রিভিউ',
      'স্মার্ট ইমেজ এনহান্সমেন্ট',
      'বিজয় ইউনিকোড সাপোর্ট',
      'ইনস্ট্যান্ট ডাউনলোড'
    ],
    accuracy: 99,
    processingTime: '2-5 সেকেন্ড',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxSize: '10MB'
  },
  {
    id: 'pdf-to-word',
    title: '📄 PDF থেকে ওয়ার্ড',
    description: 'স্মার্ট PDF টেক্সট এক্সট্রাকশন ও ফরম্যাটিং প্রিজার্ভেশন',
    icon: 'file-text',
    gradient: 'from-green-500 to-teal-600',
    accept: '.pdf',
    multiple: false,
    isNew: false,
    features: [
      'স্মার্ট টেক্সট এক্সট্রাকশন',
      'ফরম্যাটিং প্রিজার্ভেশন',
      'মাল্টি-পেজ সাপোর্ট',
      'টেবিল রিকগনিশন',
      'উচ্চ মানের আউটপুট'
    ],
    accuracy: 95,
    processingTime: '3-8 সেকেন্ড',
    supportedFormats: ['PDF'],
    maxSize: '50MB'
  },
  {
    id: 'pdf-to-image',
    title: '📄 PDF থেকে ছবি',
    description: '4K রেজোলিউশন সহ উচ্চ মানের ইমেজ কনভার্শন',
    icon: 'image',
    gradient: 'from-orange-500 to-red-600',
    accept: '.pdf',
    multiple: false,
    isNew: false,
    features: [
      '4K রেজোলিউশন সাপোর্ট',
      'ব্যাচ প্রসেসিং',
      'কাস্টম DPI সেটিং',
      'মাল্টিপল ফরম্যাট',
      'ZIP ডাউনলোড'
    ],
    accuracy: 100,
    processingTime: '1-3 সেকেন্ড/পেজ',
    supportedFormats: ['PDF'],
    maxSize: '100MB'
  },
  {
    id: 'images-to-pdf',
    title: '🖼️ ছবি থেকে PDF',
    description: 'AI-অপটিমাইজড লেআউট ও কমপ্রেশন সহ PDF তৈরি',
    icon: 'layers',
    gradient: 'from-purple-500 to-pink-600',
    accept: '.jpg,.jpeg,.png,.webp',
    multiple: true,
    isNew: true,
    features: [
      'AI-অপটিমাইজড লেআউট',
      'স্মার্ট কমপ্রেশন',
      'ড্র্যাগ এন্ড রিঅর্ডার',
      'কাস্টম পেজ সাইজ',
      'অটো অরিয়েন্টেশন'
    ],
    accuracy: 100,
    processingTime: '1-2 সেকেন্ড/ছবি',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxSize: '5MB/ছবি'
  }
];

// Tool categories for better organization
export const toolCategories = {
  ocr: {
    title: 'OCR ও টেক্সট',
    tools: ['image-to-word', 'text-corrector'],
    icon: 'brain',
    color: 'blue'
  },
  pdf: {
    title: 'PDF টুলস',
    tools: ['pdf-to-word', 'pdf-to-image', 'word-to-pdf'],
    icon: 'file-text',
    color: 'green'
  },
  image: {
    title: 'ইমেজ টুলস',
    tools: ['images-to-pdf'],
    icon: 'image',
    color: 'purple'
  }
};

// Performance metrics
export const performanceMetrics = {
  totalTools: modernTools.length,
  averageAccuracy: Math.round(modernTools.reduce((acc, tool) => acc + tool.accuracy, 0) / modernTools.length),
  supportedFormats: [...new Set(modernTools.flatMap(tool => tool.supportedFormats))],
  newFeatures: modernTools.filter(tool => tool.isNew).length
};
