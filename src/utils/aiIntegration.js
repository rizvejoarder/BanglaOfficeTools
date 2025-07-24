// AI API Integration for Bangladeshi Official Assistant
import { toast } from 'react-hot-toast';

// API Configuration
const API_CONFIG = {
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    key: process.env.REACT_APP_GEMINI_API_KEY || '',
  },
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    key: process.env.REACT_APP_OPENAI_API_KEY || '',
  },
  huggingface: {
    endpoint: 'https://api-inference.huggingface.co/models/',
    key: process.env.REACT_APP_HUGGINGFACE_API_KEY || '',
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    key: process.env.REACT_APP_OPENROUTER_API_KEY || '',
  },
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    key: process.env.REACT_APP_CLAUDE_API_KEY || '',
  }
};

// Bengali official document system prompts
const SYSTEM_PROMPTS = {
  general: `আপনি একজন বিশেষজ্ঞ বাংলাদেশী সরকারি কাজকর্মের AI সহায়ক। আপনার দায়িত্ব:

1. বাংলাদেশের সরকারি নিয়মকানুন অনুযায়ী সব ধরনের অফিসিয়াল ডকুমেন্ট তৈরি করা
2. আবেদনপত্র, অভিযোগপত্র, সুপারিশপত্র সহ সব ধরনের সরকারি কাগজপত্র লেখা
3. বাংলা ও ইংরেজি উভয় ভাষায় নিখুঁত অনুবাদ প্রদান
4. বাংলাদেশের আইন, বিধিবিধান এবং প্রশাসনিক প্রক্রিয়া ব্যাখ্যা করা
5. আপলোডকৃত ফাইল বিশ্লেষণ করে সম্পাদনা ও উন্নতির পরামর্শ দেওয়া

সব সময় সঠিক বাংলা ব্যাকরণ, শিষ্টভাষা এবং সরকারি ভাষারীতি অনুসরণ করুন।`,

  document_analysis: `আপনি একজন বিশেষজ্ঞ ডকুমেন্ট বিশ্লেষক। আপলোডকৃত ফাইল বিশ্লেষণ করে:

1. ডকুমেন্টের ধরন চিহ্নিত করুন
2. ব্যাকরণ ও বানান পরীক্ষা করুন
3. ফরম্যাট উন্নতির পরামর্শ দিন
4. প্রয়োজনে পুনর্লিখন করুন
5. বাংলা ও ইংরেজি উভয় ভাষায় সাহায্য করুন`,

  application_writer: `আপনি বাংলাদেশের সরকারি আবেদনপত্র লেখার বিশেষজ্ঞ। সব ধরনের আবেদন লিখতে পারেন:

• চাকরির আবেদন
• ছুটির আবেদন
• বদলির আবেদন
• সার্টিফিকেটের আবেদন
• অভিযোগপত্র
• সুপারিশপত্র

সরকারি ভাষারীতি, যথাযথ সম্মোধন এবং নিয়মতান্ত্রিক ফরম্যাট অনুসরণ করুন।`
};

// Document templates for different types
const DOCUMENT_TEMPLATES = {
  application: {
    bengali: `তারিখ: {date}

প্রতি,
{authority_name}
{authority_designation}
{office_address}

বিষয়: {subject}

জনাব,

সবিনয়ে নিবেদন এই যে, {reason}

অতএব, আপনার নিকট বিনীত প্রার্থনা এই যে, {request} করিলে আমি চিরকৃতজ্ঞ থাকিব।

বিনীত নিবেদক,

{applicant_name}
{designation}
{contact_info}`,

    english: `Date: {date}

To,
{authority_name}
{authority_designation}
{office_address}

Subject: {subject}

Sir/Madam,

I have the honor to inform you that {reason}

Therefore, I would be grateful if you kindly {request}

Respectfully yours,

{applicant_name}
{designation}
{contact_info}`
  },

  leave_application: {
    bengali: `তারিখ: {date}

প্রতি,
{supervisor_name}
{department}
{organization}

বিষয়: {leave_type} ছুটির আবেদন।

জনাব,

সবিনয়ে নিবেদন এই যে, {leave_reason} কারণে আমার {start_date} থেকে {end_date} পর্যন্ত {duration} দিন {leave_type} ছুটি প্রয়োজন।

অতএব, আপনার নিকট বিনীত প্রার্থনা এই যে, উক্ত সময়ের জন্য আমাকে ছুটি মঞ্জুর করিলে আমি চিরকৃতজ্ঞ থাকিব।

বিনীত নিবেদক,

{employee_name}
{employee_id}
{designation}
{department}`
  },

  complaint: {
    bengali: `তারিখ: {date}

প্রতি,
{authority_name}
{authority_designation}
{office_address}

বিষয়: {complaint_subject} সম্পর্কে অভিযোগ।

জনাব,

সবিনয়ে নিবেদন এই যে, {complaint_details}

ঘটনার বিবরণ:
{incident_description}

সংযুক্ত কাগজপত্র:
{attachments}

অতএব, আপনার নিকট বিনীত প্রার্থনা এই যে, {requested_action} করিলে আমি চিরকৃতজ্ঞ থাকিব।

বিনীত নিবেদক,

{complainant_name}
{address}
{contact_info}`
  }
};

// API calling functions
export const callGeminiAPI = async (prompt, context = '') => {
  try {
    const response = await fetch(`${API_CONFIG.gemini.endpoint}?key=${API_CONFIG.gemini.key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPTS.general}\n\nContext: ${context}\n\nUser Query: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const callOpenAIAPI = async (prompt, context = '') => {
  try {
    const response = await fetch(API_CONFIG.openai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.openai.key}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS.general
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nQuery: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

export const callHuggingFaceAPI = async (prompt, context = '', model = 'microsoft/DialoGPT-large') => {
  try {
    const response = await fetch(`${API_CONFIG.huggingface.endpoint}${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.huggingface.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${SYSTEM_PROMPTS.general}\n\nContext: ${context}\n\nUser: ${prompt}\nAssistant:`,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true,
        }
      }),
    });

    const data = await response.json();
    return data[0]?.generated_text || 'API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।';
  } catch (error) {
    console.error('HuggingFace API Error:', error);
    throw error;
  }
};

export const callOpenRouterAPI = async (prompt, context = '') => {
  try {
    const response = await fetch(API_CONFIG.openrouter.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.openrouter.key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'BanglaOfficeTools AI Assistant',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPTS.general
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nQuery: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।';
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
};

export const callClaudeAPI = async (prompt, context = '') => {
  try {
    const response = await fetch(API_CONFIG.claude.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.claude.key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `${SYSTEM_PROMPTS.general}\n\nContext: ${context}\n\nUser Query: ${prompt}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.content?.[0]?.text || 'API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।';
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
};

// Main AI response function
export const getAIResponse = async (prompt, files = [], provider = 'gemini') => {
  try {
    // Process uploaded files context
    let fileContext = '';
    if (files.length > 0) {
      fileContext = `আপলোডকৃত ফাইল: ${files.map(f => f.name).join(', ')}`;
    }

    // Choose API based on provider
    switch (provider) {
      case 'gemini':
        return await callGeminiAPI(prompt, fileContext);
      case 'openai':
        return await callOpenAIAPI(prompt, fileContext);
      case 'huggingface':
        return await callHuggingFaceAPI(prompt, fileContext);
      case 'openrouter':
        return await callOpenRouterAPI(prompt, fileContext);
      case 'claude':
        return await callClaudeAPI(prompt, fileContext);
      default:
        throw new Error('অজানা AI প্রদানকারী');
    }
  } catch (error) {
    console.error('AI API Error:', error);
    
    // Fallback response
    return generateFallbackResponse(prompt, files);
  }
};

// Fallback response when APIs fail
const generateFallbackResponse = (prompt, files) => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('আবেদন') || promptLower.includes('application')) {
    return DOCUMENT_TEMPLATES.application.bengali.replace(/{(\w+)}/g, '[এখানে $1 লিখুন]');
  }
  
  if (promptLower.includes('ছুটি') || promptLower.includes('leave')) {
    return DOCUMENT_TEMPLATES.leave_application.bengali.replace(/{(\w+)}/g, '[এখানে $1 লিখুন]');
  }
  
  if (promptLower.includes('অভিযোগ') || promptLower.includes('complaint')) {
    return DOCUMENT_TEMPLATES.complaint.bengali.replace(/{(\w+)}/g, '[এখানে $1 লিখুন]');
  }

  return `দুঃখিত, এই মুহূর্তে AI সেবা উপলব্ধ নেই। তবে আমি আপনাকে সাহায্য করতে পারি:

**আপনার প্রশ্ন:** "${prompt}"

**সাধারণ পরামর্শ:**
• সরকারি আবেদনের জন্য যথাযথ ভাষা ব্যবহার করুন
• তারিখ, সম্মোধন এবং স্বাক্ষর অবশ্যই দিন
• বিষয় স্পষ্ট এবং সংক্ষিপ্ত রাখুন
• প্রয়োজনীয় কাগজপত্র সংযুক্ত করুন

${files.length > 0 ? `\n**আপলোডকৃত ফাইল:** ${files.length}টি ফাইল পাওয়া গেছে।` : ''}

পরে আবার চেষ্টা করুন বা API কী সেটাপ করুন।`;
};

// File processing utilities
export const processUploadedFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        content: content,
        lastModified: file.lastModified
      });
    };
    
    reader.onerror = (e) => {
      reject(new Error('ফাইল পড়তে সমস্যা হয়েছে'));
    };

    if (file.type.includes('text') || file.type.includes('json')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
};

// Document format detection
export const detectDocumentType = (text) => {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('আবেদন') && textLower.includes('ছুটি')) {
    return 'leave_application';
  } else if (textLower.includes('আবেদন')) {
    return 'application';
  } else if (textLower.includes('অভিযোগ')) {
    return 'complaint';
  } else if (textLower.includes('সুপারিশ')) {
    return 'recommendation';
  } else if (textLower.includes('চিঠি')) {
    return 'letter';
  }
  
  return 'general';
};

// Export templates for use in components
export { DOCUMENT_TEMPLATES, SYSTEM_PROMPTS };
