# Production deployment configurations for SPA routing

## For Local Testing with `serve`
```bash
# Install serve globally if not already installed
npm install -g serve

# Serve the build with SPA fallback
serve -s dist -l 3000
```

## For Vercel Deployment
Create `vercel.json` in your project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## For Netlify Deployment
Create `_redirects` in your `public` folder or `dist` folder:

```
/*    /index.html   200
```

## For Apache Server
Create or update `.htaccess` in your `dist` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## For Nginx Server
Add this to your nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## For Express.js Server
If you're using Express.js:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```
