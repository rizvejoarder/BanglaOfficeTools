# 🚀 BanglaOfficeTools - Deployment Guide

## 📋 Overview
Professional Bengali document processing tools with AI-powered OCR, PDF conversion, and text processing capabilities.

## 🛠️ Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
git clone <repository-url>
cd BanglaOfficeTools
npm install
npm run dev
```

**Local URL:** `http://localhost:3000/BanglaOfficeTools/`

## 🌐 Production Deployment

### Method 1: Standard Web Hosting

1. **Build for production:**
   ```bash
   npm run build:deploy
   ```

2. **Upload files:**
   - Upload ALL contents of the `dist/` folder to your server's root directory
   - **Important:** Upload the contents, not the dist folder itself

3. **File structure on server:**
   ```
   your-domain.com/
   ├── assets/
   │   ├── index-[hash].js
   │   └── index-[hash].css
   ├── .htaccess
   ├── index.html
   └── vite.svg
   ```

### Method 2: Subdomain/Subfolder Deployment

If deploying to a subfolder like `domain.com/tools/`:

1. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     base: '/tools/', // Change this to your subfolder
     // ... rest of config
   })
   ```

2. **Build and deploy:**
   ```bash
   npm run build:deploy
   ```

## ⚡ Quick Deploy Script

Create `deploy.sh` (Linux/Mac) or `deploy.bat` (Windows):

```bash
#!/bin/bash
echo "🚀 Building BanglaOfficeTools..."
npm run build:deploy

echo "📦 Files ready in dist/ folder"
echo "📁 Upload all contents of dist/ folder to your server"
echo "✅ Done! Your app will be available at your domain root"
```

## 🔧 Troubleshooting

### MIME Type Errors
The build includes a proper `.htaccess` file that handles MIME types. If you still get errors:

1. **Check if .htaccess is uploaded**
2. **Verify mod_rewrite is enabled** on your server
3. **Contact hosting provider** if issues persist

### 404 Errors for Assets
- Ensure you uploaded the `assets/` folder
- Check that file paths in `index.html` are relative (`./assets/`)

### App Not Loading
1. **Check browser console** for errors
2. **Verify all files** are uploaded correctly
3. **Test with** `domain.com/index.html` directly

## 📁 File Structure Explained

```
BanglaOfficeTools/
├── src/                    # Source code
│   ├── App_bengali_fixed.jsx
│   ├── components/
│   └── utils/
├── dist/                   # Production build (upload this)
│   ├── assets/
│   ├── .htaccess
│   ├── index.html
│   └── vite.svg
├── scripts/                # Build scripts
├── package.json
└── vite.config.js
```

## 🎯 For Open Source Contributors

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes in `src/`
4. Test with `npm run dev`
5. Build with `npm run build:deploy`
6. Submit pull request

### Key Files
- **Main App:** `src/App_bengali_fixed.jsx`
- **Styles:** `src/index_officewave.css` 
- **Utils:** `src/utils/` (all processing functions)
- **Config:** `vite.config.js`

## 🔒 Security Features
- CSP headers in `.htaccess`
- XSS protection
- MIME type enforcement
- Secure file handling

## 📧 Support
For deployment issues or contributions:
- Open an issue on GitHub
- Check troubleshooting section above
- Contact: [your-email]

---

**Note:** This app works 100% offline after initial load. No data is sent to external servers.
