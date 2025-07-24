import"./index-BFnaxcIa.js";import"./pdfjs-CwH_0J_o.js";var s={};const i={gemini:{endpoint:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",key:s.REACT_APP_GEMINI_API_KEY||""},openai:{endpoint:"https://api.openai.com/v1/chat/completions",key:s.REACT_APP_OPENAI_API_KEY||""},huggingface:{endpoint:"https://api-inference.huggingface.co/models/",key:s.REACT_APP_HUGGINGFACE_API_KEY||""},openrouter:{endpoint:"https://openrouter.ai/api/v1/chat/completions",key:s.REACT_APP_OPENROUTER_API_KEY||""},claude:{endpoint:"https://api.anthropic.com/v1/messages",key:s.REACT_APP_CLAUDE_API_KEY||""}},c={general:`আপনি একজন বিশেষজ্ঞ বাংলাদেশী সরকারি কাজকর্মের AI সহায়ক। আপনার দায়িত্ব:

1. বাংলাদেশের সরকারি নিয়মকানুন অনুযায়ী সব ধরনের অফিসিয়াল ডকুমেন্ট তৈরি করা
2. আবেদনপত্র, অভিযোগপত্র, সুপারিশপত্র সহ সব ধরনের সরকারি কাগজপত্র লেখা
3. বাংলা ও ইংরেজি উভয় ভাষায় নিখুঁত অনুবাদ প্রদান
4. বাংলাদেশের আইন, বিধিবিধান এবং প্রশাসনিক প্রক্রিয়া ব্যাখ্যা করা
5. আপলোডকৃত ফাইল বিশ্লেষণ করে সম্পাদনা ও উন্নতির পরামর্শ দেওয়া

সব সময় সঠিক বাংলা ব্যাকরণ, শিষ্টভাষা এবং সরকারি ভাষারীতি অনুসরণ করুন।`,document_analysis:`আপনি একজন বিশেষজ্ঞ ডকুমেন্ট বিশ্লেষক। আপলোডকৃত ফাইল বিশ্লেষণ করে:

1. ডকুমেন্টের ধরন চিহ্নিত করুন
2. ব্যাকরণ ও বানান পরীক্ষা করুন
3. ফরম্যাট উন্নতির পরামর্শ দিন
4. প্রয়োজনে পুনর্লিখন করুন
5. বাংলা ও ইংরেজি উভয় ভাষায় সাহায্য করুন`,application_writer:`আপনি বাংলাদেশের সরকারি আবেদনপত্র লেখার বিশেষজ্ঞ। সব ধরনের আবেদন লিখতে পারেন:

• চাকরির আবেদন
• ছুটির আবেদন
• বদলির আবেদন
• সার্টিফিকেটের আবেদন
• অভিযোগপত্র
• সুপারিশপত্র

সরকারি ভাষারীতি, যথাযথ সম্মোধন এবং নিয়মতান্ত্রিক ফরম্যাট অনুসরণ করুন।`},d={application:{bengali:`তারিখ: {date}

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
{contact_info}`},leave_application:{bengali:`তারিখ: {date}

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
{department}`},complaint:{bengali:`তারিখ: {date}

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
{contact_info}`}},g=async(n,o="")=>{var t,e,a,r,p;try{return((p=(r=(a=(e=(t=(await(await fetch(`${i.gemini.endpoint}?key=${i.gemini.key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:`${c.general}

Context: ${o}

User Query: ${n}`}]}],generationConfig:{temperature:.7,topK:40,topP:.95,maxOutputTokens:2048},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_MEDIUM_AND_ABOVE"}]})})).json()).candidates)==null?void 0:t[0])==null?void 0:e.content)==null?void 0:a.parts)==null?void 0:r[0])==null?void 0:p.text)||"API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।"}catch(l){throw console.error("Gemini API Error:",l),l}},u=async(n,o="")=>{var t,e,a;try{return((a=(e=(t=(await(await fetch(i.openai.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i.openai.key}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:c.general},{role:"user",content:`Context: ${o}

Query: ${n}`}],temperature:.7,max_tokens:2048})})).json()).choices)==null?void 0:t[0])==null?void 0:e.message)==null?void 0:a.content)||"API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।"}catch(r){throw console.error("OpenAI API Error:",r),r}},_=async(n,o="",t="microsoft/DialoGPT-large")=>{var e;try{return((e=(await(await fetch(`${i.huggingface.endpoint}${t}`,{method:"POST",headers:{Authorization:`Bearer ${i.huggingface.key}`,"Content-Type":"application/json"},body:JSON.stringify({inputs:`${c.general}

Context: ${o}

User: ${n}
Assistant:`,parameters:{max_length:500,temperature:.7,do_sample:!0}})})).json())[0])==null?void 0:e.generated_text)||"API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।"}catch(a){throw console.error("HuggingFace API Error:",a),a}},m=async(n,o="")=>{var t,e,a;try{return((a=(e=(t=(await(await fetch(i.openrouter.endpoint,{method:"POST",headers:{Authorization:`Bearer ${i.openrouter.key}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"BanglaOfficeTools AI Assistant"},body:JSON.stringify({model:"openai/gpt-3.5-turbo",messages:[{role:"system",content:c.general},{role:"user",content:`Context: ${o}

Query: ${n}`}],temperature:.7,max_tokens:2048})})).json()).choices)==null?void 0:t[0])==null?void 0:e.message)==null?void 0:a.content)||"API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।"}catch(r){throw console.error("OpenRouter API Error:",r),r}},h=async(n,o="")=>{var t,e;try{return((e=(t=(await(await fetch(i.claude.endpoint,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":i.claude.key,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-3-sonnet-20240229",max_tokens:2048,messages:[{role:"user",content:`${c.general}

Context: ${o}

User Query: ${n}`}],temperature:.7})})).json()).content)==null?void 0:t[0])==null?void 0:e.text)||"API থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।"}catch(a){throw console.error("Claude API Error:",a),a}},f=async(n,o=[],t="gemini")=>{try{let e="";switch(o.length>0&&(e=`আপলোডকৃত ফাইল: ${o.map(a=>a.name).join(", ")}`),t){case"gemini":return await g(n,e);case"openai":return await u(n,e);case"huggingface":return await _(n,e);case"openrouter":return await m(n,e);case"claude":return await h(n,e);default:throw new Error("অজানা AI প্রদানকারী")}}catch(e){return console.error("AI API Error:",e),y(n,o)}},y=(n,o)=>{const t=n.toLowerCase();return t.includes("আবেদন")||t.includes("application")?d.application.bengali.replace(/{(\w+)}/g,"[এখানে $1 লিখুন]"):t.includes("ছুটি")||t.includes("leave")?d.leave_application.bengali.replace(/{(\w+)}/g,"[এখানে $1 লিখুন]"):t.includes("অভিযোগ")||t.includes("complaint")?d.complaint.bengali.replace(/{(\w+)}/g,"[এখানে $1 লিখুন]"):`দুঃখিত, এই মুহূর্তে AI সেবা উপলব্ধ নেই। তবে আমি আপনাকে সাহায্য করতে পারি:

**আপনার প্রশ্ন:** "${n}"

**সাধারণ পরামর্শ:**
• সরকারি আবেদনের জন্য যথাযথ ভাষা ব্যবহার করুন
• তারিখ, সম্মোধন এবং স্বাক্ষর অবশ্যই দিন
• বিষয় স্পষ্ট এবং সংক্ষিপ্ত রাখুন
• প্রয়োজনীয় কাগজপত্র সংযুক্ত করুন

${o.length>0?`
**আপলোডকৃত ফাইল:** ${o.length}টি ফাইল পাওয়া গেছে।`:""}

পরে আবার চেষ্টা করুন বা API কী সেটাপ করুন।`};export{d as DOCUMENT_TEMPLATES,c as SYSTEM_PROMPTS,h as callClaudeAPI,g as callGeminiAPI,_ as callHuggingFaceAPI,u as callOpenAIAPI,m as callOpenRouterAPI,f as getAIResponse};
