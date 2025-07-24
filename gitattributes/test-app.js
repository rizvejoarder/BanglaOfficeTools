#!/usr/bin/env node
/**
 * Test script for Bangla Office Tools
 * This script verifies that all dependencies are properly installed
 * and the application can be built successfully.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = join(__dirname, 'package.json');

console.log('🧪 Testing Bangla Office Tools Application...\n');

try {
  // Check package.json
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  console.log('✅ Package.json loaded successfully');
  console.log(`   Project: ${packageJson.name} v${packageJson.version}`);

  // Check required dependencies
  const requiredDeps = [
    'react',
    'react-dom', 
    'pdf-lib',
    'jspdf',
    'tesseract.js',
    'docx',
    'file-saver',
    'jszip',
    'pdfjs-dist'
  ];

  console.log('\n📦 Checking dependencies...');
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  for (const dep of requiredDeps) {
    if (dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: Missing`);
      process.exit(1);
    }
  }

  // Test build process
  console.log('\n🏗️  Testing build process...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build completed successfully');

  console.log('\n🎉 All tests passed! Your Bangla Office Tools application is ready to use.');
  console.log('\n📖 To start the application:');
  console.log('   npm run dev');
  console.log('\n🌐 Then open: http://localhost:5173/');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
