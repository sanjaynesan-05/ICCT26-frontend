# Netlify Deployment Guide - ICCT26 Frontend

This guide provides step-by-step instructions to deploy the ICCT26 tournament website frontend to Netlify.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build Configuration](#build-configuration)
3. [Deployment Methods](#deployment-methods)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)
7. [Domain Setup](#domain-setup)
8. [Performance Optimization](#performance-optimization)

---

## Prerequisites

### Required Accounts & Tools

- **GitHub Account** - For version control and Git-based deployment
- **Netlify Account** - Free account at [netlify.com](https://netlify.com)
- **Node.js** - v16 or higher (for local building)
- **Git** - Installed on your system
- **Code Editor** - VS Code or similar

### Local Setup Check

Before deploying, ensure your project builds successfully locally:

```bash
# Navigate to project directory
cd d:\ICCT26

# Install dependencies
npm install

# Build the project
npm run build

# Verify build output
# Check if 'dist' folder is created with production-ready files
```

---

## Build Configuration

### Current Project Setup

**Project Type:** React + TypeScript + Vite  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Node Version:** 16+ or 18+  

### Vite Build Configuration

Your `vite.config.ts` should include proper output configuration:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'framer-motion'
          ]
        }
      }
    }
  },
  server: {
    port: 5174,
    host: true
  }
})
```

### Netlify Configuration File

Create a `netlify.toml` file in the root directory with the following configuration:

```toml
# Netlify Build Configuration
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

# Environment
[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"

# Redirects for SPA (Single Page Application)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

# Cache configuration
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"

# Gzip compression
[build.processing]
  skip_processing = false

# Build context for different branches
[context.develop]
  command = "npm run build"
  publish = "dist"

[context.production]
  command = "npm run build"
  publish = "dist"
```

---

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

#### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - ICCT26 frontend"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ICCT26-frontend.git

# Push to main branch
git branch -M main
git push -u origin main
```

#### Step 2: Connect Netlify to GitHub

1. Visit [netlify.com](https://netlify.com) and sign up/login
2. Click **"New site from Git"**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select the **ICCT26-frontend** repository
6. Review build settings:
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
7. Click **"Deploy site"**

#### Step 3: Automatic Deployments

After setup, every push to `main` branch triggers automatic deployment:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically deploys the new changes!
```

---

### Method 2: Netlify CLI (Direct Upload)

#### Step 1: Install Netlify CLI

```bash
# Global installation
npm install -g netlify-cli

# Or using yarn
yarn global add netlify-cli
```

#### Step 2: Build Locally

```bash
cd d:\ICCT26
npm run build
```

#### Step 3: Deploy with CLI

```bash
# Login to Netlify (opens browser for authentication)
netlify login

# Deploy the dist folder
netlify deploy --prod --dir=dist

# Or without --prod for preview deployment
netlify deploy --dir=dist
```

#### Step 4: Interactive Setup

First time deployment:

```bash
# This will guide you through setup
netlify init

# Follow prompts:
# 1. Connect to GitHub account
# 2. Create new Netlify site
# 3. Set build command: npm run build
# 4. Set publish directory: dist
```

---

### Method 3: Manual Upload (Drag & Drop)

1. Build locally: `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder onto the Netlify dashboard
4. Your site is live immediately!

**Note:** This method doesn't enable automatic deployments.

---

## Post-Deployment Configuration

### 1. Custom Domain Setup

#### Add Custom Domain

1. Go to **Site Settings** → **Domain management**
2. Click **"Add domain"**
3. Enter your domain (e.g., `icct26.com`)
4. Update DNS records at your registrar:
   - **Nameservers:** Use Netlify's provided nameservers
   - Or use **CNAME record:** Point to `your-site.netlify.app`

#### SSL/HTTPS Certificate

- Netlify automatically provides **free SSL certificate** via Let's Encrypt
- HTTPS is enabled automatically
- Certificate renews automatically

### 2. Site Settings Configuration

#### Build & Deploy

1. **Site Settings** → **Build & Deploy** → **Build Settings**
2. Verify:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment: NODE_VERSION = 18

#### Deploy Previews

Enable automatic preview deployments:
1. **Deploys** → **Deploy settings**
2. Enable **"Deploy previews"** for all pull requests
3. Everyone can test PRs before merging

#### Branch Deploys

Deploy specific branches to separate URLs:
1. **Site Settings** → **Build & Deploy** → **Deploy contexts**
2. Add branch names (e.g., `develop`, `staging`)
3. Each branch gets unique URL

### 3. Environment Variables

If you need environment variables for API endpoints:

1. **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Edit variables"**
3. Add variables:
   ```
   VITE_API_URL = https://api.example.com
   VITE_APP_NAME = ICCT26
   ```

In your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Environment Variables

### Required Variables (if any)

Create a `.env.production` file for production builds:

```env
VITE_API_URL=https://api.icct26.com
VITE_APP_NAME=ICCT26
VITE_APP_VERSION=1.0.0
```

### Netlify Environment Setup

1. **Settings** → **Build & Deploy** → **Environment**
2. Add each variable:
   - Key: `VITE_API_URL`
   - Value: `https://api.icct26.com`
3. Click **"Save"**
4. Redeploy to apply changes

---

## Troubleshooting

### Build Fails: "npm not found"

**Solution:**
1. Ensure `package.json` exists in root
2. Check Node version in `netlify.toml`:
   ```toml
   [build.environment]
   NODE_VERSION = "18"
   ```
3. Redeploy

### Build Succeeds but Site Shows 404

**Solution:** Add `netlify.toml` redirect:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Assets Not Loading (404 errors)

**Solution:** Check Vite config `base` setting:
```typescript
export default defineConfig({
  base: '/',  // Ensure this matches your domain path
  // ...
})
```

### Images/Assets Not Displayed

**Solution:**
1. Ensure assets are in `public/` folder
2. In Vite, reference as: `/image.png`
3. Not as: `./image.png`

### Slow Performance

**Solution:**
1. Enable **Netlify Edge Functions** for caching
2. Minify CSS/JS in Vite config
3. Optimize images (use WebP format)
4. Check **Analytics** → **Performance** tab

### DNS Not Resolving

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Verify nameservers at your registrar
3. Test with: `nslookup your-domain.com`

---

## Domain Setup

### Using Netlify DNS (Recommended)

1. Buy domain on Netlify or connect existing
2. Netlify automatically configures DNS
3. Auto-renews SSL certificate
4. No manual DNS configuration needed

### Using External DNS Provider (GoDaddy, Namecheap, etc.)

#### Option A: Nameserver Delegation

1. Get Netlify nameservers from **Domain settings**
2. Update at registrar:
   - NS1: `dns1.p01.nsone.net`
   - NS2: `dns2.p02.nsone.net`
   - (Use actual values from Netlify)
3. Wait 24-48 hours for propagation

#### Option B: CNAME Record

1. Get CNAME value: `your-site.netlify.app`
2. Create CNAME record at registrar:
   ```
   Name: @
   Value: your-site.netlify.app
   TTL: 3600
   ```
3. Wait for propagation

### SSL Certificate

- **Automatic:** Netlify issues free Let's Encrypt certificate
- **Custom:** Upload your own certificate in **Domain settings**
- **Renewal:** Automatic, no action required

---

## Performance Optimization

### 1. Enable Netlify Analytics

1. **Site Settings** → **Analytics**
2. Enable **Netlify Analytics**
3. View real-time performance data

### 2. Content Delivery Network (CDN)

- **Automatic:** Netlify uses global CDN by default
- **Edge locations:** 200+ locations worldwide
- **No configuration:** Works out of the box

### 3. Image Optimization

Configure in Vite:

```typescript
build: {
  outDir: 'dist',
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'framer-motion']
      }
    }
  }
}
```

### 4. Caching Strategy

In `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"
```

### 5. Compression

- **Automatic:** Gzip and Brotli enabled by default
- **No configuration:** Netlify handles it

### 6. Lazy Loading

Implement in React:

```typescript
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/Home'))

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  )
}
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` locally and verify no errors
- [ ] Test production build locally: `npm run preview`
- [ ] All environment variables set in Netlify dashboard
- [ ] `netlify.toml` configured with correct build settings
- [ ] `README.md` updated with deployment instructions
- [ ] GitHub repository is public (for free tier)
- [ ] `.gitignore` includes `dist/`, `node_modules/`
- [ ] All sensitive data removed from code
- [ ] Domain configured (or using `netlify.app` subdomain)
- [ ] SSL certificate enabled and verified

---

## Quick Deploy Commands

### One-time Deploy (GitHub)

```bash
git push origin main
# Netlify automatically deploys!
```

### One-time Deploy (CLI)

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Preview Deploy (Before Production)

```bash
netlify deploy --dir=dist
# Get preview URL from terminal output
```

---

## Monitoring & Analytics

### Monitor Site Health

1. **Netlify Dashboard** → **Analytics**
2. View:
   - Page views
   - Load time
   - Edge locations
   - Traffic patterns

### Logs & Errors

1. **Netlify Dashboard** → **Deploys**
2. Click on deployment
3. View **Deploy log** for errors
4. Check **Function logs** if using serverless functions

### Performance Monitoring

1. **Lighthouse CI** integration
2. Enable in **Build settings**
3. Get automated performance reports on each deploy

---

## Rollback & Version Control

### Rollback to Previous Version

1. **Netlify Dashboard** → **Deploys**
2. Find previous successful deployment
3. Click **"Restore"** or **"Publish"**
4. Site reverts instantly

### Production Branches

Setup separate environments:

```toml
[context.main]
  command = "npm run build"
  publish = "dist"

[context.staging]
  command = "npm run build"
  publish = "dist"
```

---

## Support & Resources

- **Netlify Documentation:** https://docs.netlify.com
- **Netlify Community:** https://community.netlify.com
- **Support Email:** support@netlify.com
- **Status Page:** https://status.netlify.com

---

## Summary

Your ICCT26 frontend is now deployed on Netlify! 🚀

**Key Points:**
- ✅ Automatic deployments from GitHub
- ✅ Free SSL/HTTPS certificate
- ✅ Global CDN for fast performance
- ✅ Preview deployments for PRs
- ✅ Easy rollback to previous versions
- ✅ Custom domain support
- ✅ Analytics and monitoring

**Next Steps:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Configure custom domain
4. Monitor analytics

Happy deploying! 🎉
