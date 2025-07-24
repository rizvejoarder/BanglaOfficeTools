import fs from 'fs-extra';
import path from 'path';

const buildDeploy = async () => {
  console.log('🚀 Building for deployment...');
  
  // Ensure dist directory exists
  await fs.ensureDir('dist');
  
  // Read the built index.html and update paths for root deployment
  const indexPath = path.join('dist', 'index.html');
  if (await fs.pathExists(indexPath)) {
    let indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Update asset paths to be relative to root
    indexContent = indexContent.replace(/href="\/BanglaOfficeTools\//g, 'href="./');
    indexContent = indexContent.replace(/src="\/BanglaOfficeTools\//g, 'src="./');
    indexContent = indexContent.replace(/crossorigin href="\/BanglaOfficeTools\//g, 'crossorigin href="./');
    
    await fs.writeFile(indexPath, indexContent);
    console.log('✅ Updated index.html paths for deployment');
  }
  
  // Create a proper .htaccess for production
  const htaccessContent = `RewriteEngine On

# Force correct MIME types for JavaScript modules
<FilesMatch "\\.js$">
    ForceType application/javascript
    Header always set Content-Type "application/javascript; charset=utf-8"
</FilesMatch>

<FilesMatch "\\.css$">
    ForceType text/css
    Header always set Content-Type "text/css; charset=utf-8"
</FilesMatch>

<FilesMatch "\\.svg$">
    ForceType image/svg+xml
    Header always set Content-Type "image/svg+xml; charset=utf-8"
</FilesMatch>

# Backup MIME type declarations
AddType application/javascript .js
AddType application/javascript .mjs
AddType text/css .css
AddType image/svg+xml .svg

# Handle client-side routing (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>`;

  await fs.writeFile(path.join('dist', '.htaccess'), htaccessContent);
  console.log('✅ Created production .htaccess');
  
  console.log('🎉 Deployment build complete!');
  console.log('📁 Upload the entire "dist" folder contents to your server root.');
};

buildDeploy().catch(console.error);
