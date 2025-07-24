// Build and Deploy Script for Apache Server
// This script builds the project and prepares it for Apache deployment

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Apache Deployment Build Process...\n');

// Configuration
const config = {
    buildDir: 'dist',
    apacheDir: 'apache-deploy',
    sourceDir: 'src',
    publicDir: 'public'
};

async function buildForApache() {
    try {
        // Step 1: Clean previous builds
        console.log('🧹 Cleaning previous builds...');
        await fs.remove(config.buildDir);
        await fs.remove(config.apacheDir);
        
        // Step 2: Build the project
        console.log('📦 Building the project with Vite...');
        execSync('npm run build', { stdio: 'inherit' });
        
        // Step 3: Create Apache deployment directory
        console.log('📁 Creating Apache deployment directory...');
        await fs.ensureDir(config.apacheDir);
        
        // Step 4: Copy built files to Apache directory
        console.log('📋 Copying built files...');
        await fs.copy(config.buildDir, config.apacheDir);
        
        // Step 5: Copy .htaccess file
        console.log('⚙️ Copying Apache configuration...');
        if (await fs.pathExists('.htaccess')) {
            await fs.copy('.htaccess', path.join(config.apacheDir, '.htaccess'));
        }
        
        // Step 6: Create deployment info file
        const packageJson = JSON.parse(await fs.readFile(path.resolve(__dirname, '../package.json'), 'utf8'));
        const deploymentInfo = {
            buildDate: new Date().toISOString(),
            version: packageJson.version,
            environment: 'production',
            server: 'Apache',
            features: [
                'Bengali Office Tools',
                'AI Assistant with Multi-Provider Support',
                'Document Templates (50+)',
                'File Upload and Analysis',
                'Responsive Design',
                'PWA Ready'
            ],
            apiProviders: [
                'Google Gemini',
                'OpenAI ChatGPT',
                'HuggingFace',
                'OpenRouter',
                'Anthropic Claude'
            ],
            requirements: {
                php: 'Not required',
                database: 'Not required',
                apache_modules: ['mod_rewrite', 'mod_headers', 'mod_deflate', 'mod_expires', 'mod_mime'],
                environment_variables: 'Set API keys in .env file'
            }
        };
        
        await fs.writeJSON(
            path.join(config.apacheDir, 'deployment-info.json'), 
            deploymentInfo, 
            { spaces: 2 }
        );
        
        // Step 7: Create deployment README
        const deploymentReadme = `# BanglaOfficeTools - Apache Deployment Guide

## 🚀 Deployment Status: READY FOR APACHE

### What's Included:
- ✅ Complete React application (built and optimized)
- ✅ Apache .htaccess configuration
- ✅ All static assets (CSS, JS, images, fonts)
- ✅ Bengali font support
- ✅ AI Assistant with full functionality
- ✅ 50+ Bangladeshi document templates
- ✅ File upload and analysis system

### Quick Deploy Steps:

1. **Upload to Apache Server:**
   - Upload all files from this folder to your Apache document root
   - Ensure .htaccess file is uploaded and readable

2. **Set Up Environment Variables (Optional for AI features):**
   - Copy .env.example to .env
   - Add your API keys for AI providers
   - Configure as needed

3. **Verify Apache Modules:**
   - mod_rewrite (for routing)
   - mod_headers (for security)
   - mod_deflate (for compression)
   - mod_expires (for caching)

4. **Access Your Application:**
   - Visit your domain/subdomain
   - All features should work immediately
   - AI features will work once API keys are configured

### File Structure:
\`\`\`
/
├── index.html (Main application entry)
├── .htaccess (Apache configuration)
├── assets/ (CSS, JS, images)
├── deployment-info.json (Build information)
└── README-DEPLOYMENT.md (This file)
\`\`\`

### Features Included:
- 🖼️ Image to Word (OCR)
- 📄 PDF to Image conversion
- 📱 Images to PDF
- 📝 PDF to Word
- 📋 Word to PDF
- 🤖 AI Assistant (Multi-provider)
- 📋 50+ Document Templates
- 🔄 File Analysis System

### Technical Details:
- Built with: Vite + React + Tailwind CSS
- Bundle size: Optimized for production
- Browser support: Modern browsers + IE11 fallback
- Mobile responsive: Full mobile support
- Performance: Optimized for fast loading

### Support:
- No server-side code required
- Pure client-side application
- Works on any Apache server
- No database required

### Build Date: ${new Date().toLocaleString()}
### Version: ${packageJson.version}
`;

        await fs.writeFile(
            path.join(config.apacheDir, 'README-DEPLOYMENT.md'), 
            deploymentReadme
        );
        
        // Step 8: Create .env.example for production
        const envExample = `# Production Environment Variables for BanglaOfficeTools
# Copy this file to .env and configure your API keys

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API  
VITE_OPENAI_API_KEY=your_openai_api_key_here

# HuggingFace API
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# OpenRouter API
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Configuration
VITE_AI_DEFAULT_PROVIDER=gemini
VITE_AI_MAX_TOKENS=4000
VITE_AI_TEMPERATURE=0.7

# Note: These are client-side environment variables
# They will be visible in the browser, so use accordingly
# For production, consider using a backend proxy for API calls`;

        await fs.writeFile(
            path.join(config.apacheDir, '.env.example'), 
            envExample
        );
        
        // Step 9: Generate deployment statistics
        const stats = await getDeploymentStats();
        console.log('\n📊 Deployment Statistics:');
        console.log(`   Total Files: ${stats.totalFiles}`);
        console.log(`   Total Size: ${stats.totalSize}`);
        console.log(`   JS Files: ${stats.jsFiles}`);
        console.log(`   CSS Files: ${stats.cssFiles}`);
        console.log(`   Asset Files: ${stats.assetFiles}`);
        
        console.log('\n✅ Apache deployment build completed successfully!');
        console.log(`📁 Deployment files are ready in: ${config.apacheDir}/`);
        console.log('\n🚀 Ready to upload to your Apache server!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

async function getDeploymentStats() {
    const stats = {
        totalFiles: 0,
        totalSize: '0 MB',
        jsFiles: 0,
        cssFiles: 0,
        assetFiles: 0
    };
    
    try {
        const files = await fs.readdir(config.apacheDir, { recursive: true });
        stats.totalFiles = files.length;
        
        let totalBytes = 0;
        for (const file of files) {
            const filePath = path.join(config.apacheDir, file);
            try {
                const fileStat = await fs.stat(filePath);
                if (fileStat.isFile()) {
                    totalBytes += fileStat.size;
                    
                    if (file.endsWith('.js')) stats.jsFiles++;
                    else if (file.endsWith('.css')) stats.cssFiles++;
                    else if (file.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$/)) stats.assetFiles++;
                }
            } catch (e) {
                // Skip files that can't be read
            }
        }
        
        stats.totalSize = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';
    } catch (error) {
        console.warn('Could not calculate deployment stats:', error.message);
    }
    
    return stats;
}

// Run the build
buildForApache();
