# 🚀 ICCT26 Deployment & DevOps Guide

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│              (Source Code Management)                    │
└────────────┬────────────────────────────────────────────┘
             │
       ┌─────┴──────┐
       │            │
       ▼            ▼
┌─────────────┐  ┌────────────────┐
│   Netlify   │  │     Render     │
│  (Frontend) │  │   (Backend)    │
└─────────────┘  └────────────────┘
       │                 │
       │                 ▼
       │         ┌───────────────┐
       │         │  PostgreSQL   │
       │         │   Database    │
       │         └───────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │  Cloudinary  │  │    SMTP     │  │   Google     │  │
│  │    (CDN)     │  │   (Email)   │  │    Maps      │  │
│  └──────────────┘  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Deployment (Netlify)

### Platform: Netlify

**Production URL**: `https://icct26.netlify.app`

### Configuration

**File**: [`netlify.toml`](../netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Environment Variables (Netlify)

```bash
# Backend API URL
VITE_API_URL=https://icct26-backend.onrender.com

# Google Maps API (if using)
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Cloudinary (if managing from frontend)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Build Settings

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |
| **Node Version** | 18.x |
| **Build Time** | ~2-3 minutes |
| **Deploy Previews** | Enabled |
| **Branch Deploys** | main only |

### Deploy Process

1. **Automatic Deploy**:
   - Push to `main` branch
   - Netlify detects changes
   - Runs build command
   - Deploys to production

2. **Manual Deploy**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build locally
   npm run build
   
   # Deploy
   netlify deploy --prod
   ```

3. **Deploy Previews**:
   - Created for Pull Requests
   - Unique URL for each PR
   - Auto-deleted when PR is merged

### Performance Optimization

**Build Optimizations**:
- Asset minification
- Code splitting
- Tree shaking
- Image optimization
- Gzip compression
- Brotli compression

**CDN Configuration**:
- Global edge network
- Automatic HTTPS
- HTTP/2 support
- Smart caching

### Custom Domain Setup

1. Add custom domain in Netlify dashboard
2. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: icct26.netlify.app
   ```

3. Enable HTTPS (automatic)
4. Force HTTPS redirects

---

## Backend Deployment (Render)

### Platform: Render

**Production URL**: `https://icct26-backend.onrender.com`

### Technology Stack

- **Runtime**: Python 3.11
- **Framework**: FastAPI
- **Database**: PostgreSQL 15
- **File Storage**: Cloudinary

### Environment Variables (Render)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# CORS Origins
ALLOWED_ORIGINS=https://icct26.netlify.app,http://localhost:5174

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@icct26.org

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
SECRET_KEY=your_secret_key_here
DEBUG=False
ENVIRONMENT=production
```

### Build Settings

| Setting | Value |
|---------|-------|
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Python Version** | 3.11 |
| **Auto Deploy** | Enabled |
| **Health Check Path** | `/` |

### Database Setup (PostgreSQL)

1. **Create Database** (Render Dashboard)
   - Database Name: icct26_db
   - Region: Same as backend
   - Plan: Free/Starter

2. **Connection**:
   ```python
   # Database connection
   DATABASE_URL = os.getenv('DATABASE_URL')
   
   # SQLAlchemy engine
   engine = create_engine(DATABASE_URL)
   ```

3. **Migrations**:
   ```bash
   # Run migrations on deploy
   alembic upgrade head
   ```

### File Storage (Cloudinary)

**Configuration**:
```python
import cloudinary
import cloudinary.uploader

cloudinary.config(
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key = os.getenv('CLOUDINARY_API_KEY'),
  api_secret = os.getenv('CLOUDINARY_API_SECRET')
)
```

**Upload Function**:
```python
def upload_file(file, folder="icct26"):
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type="auto"
    )
    return result['secure_url']
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: pip install -r requirements.txt
        
      - name: Run tests
        run: pytest
```

---

## Development Workflow

### Local Development

```bash
# Frontend
npm install
npm run dev

# Backend (separate repository)
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Files

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:8000
```

**Backend** (`.env`):
```bash
DATABASE_URL=postgresql://localhost/icct26_dev
ALLOWED_ORIGINS=http://localhost:5174
DEBUG=True
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub

# After review and approval
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main

# Automatic deployment triggers
```

---

## Monitoring & Logging

### Netlify Analytics

- **Page Views**: Track visitor traffic
- **Top Pages**: Most visited pages
- **Traffic Sources**: Referral analysis
- **Bandwidth Usage**: Asset delivery metrics

### Render Metrics

- **Response Time**: API latency
- **Error Rate**: Failed requests
- **CPU Usage**: Server load
- **Memory Usage**: RAM consumption
- **Database Connections**: Active connections

### Error Tracking

**Frontend** (Console Logging):
```typescript
// Production error logging
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    // Log to external service (e.g., Sentry)
    console.error('Production Error:', event.error)
  })
}
```

**Backend** (Logging):
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
```

---

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**:
   ```typescript
   // Route-based splitting
   const Home = lazy(() => import('./pages/Home'))
   const Gallery = lazy(() => import('./pages/Gallery'))
   ```

2. **Image Optimization**:
   - WebP format with fallbacks
   - Lazy loading
   - Responsive images

3. **Asset Optimization**:
   - Minification
   - Compression (Gzip/Brotli)
   - CDN delivery

4. **Caching Strategy**:
   ```toml
   [[headers]]
     for = "/assets/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   ```

### Backend Optimizations

1. **Database Indexing**:
   ```sql
   CREATE INDEX idx_team_name ON teams(team_name);
   CREATE INDEX idx_match_status ON matches(status);
   ```

2. **Query Optimization**:
   - Use select specific fields
   - Implement pagination
   - Add database indexes

3. **Caching**:
   ```python
   # Redis caching (future enhancement)
   from functools import lru_cache
   
   @lru_cache(maxsize=100)
   def get_matches():
       return db.query(Match).all()
   ```

4. **Connection Pooling**:
   ```python
   engine = create_engine(
       DATABASE_URL,
       pool_size=10,
       max_overflow=20
   )
   ```

---

## Security Best Practices

### Frontend Security

1. **Environment Variables**:
   - Never commit `.env` files
   - Use Netlify environment variables
   - Prefix with `VITE_` for exposure

2. **Content Security Policy**:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline';">
   ```

3. **Input Sanitization**:
   ```typescript
   import DOMPurify from 'dompurify'
   const clean = DOMPurify.sanitize(userInput)
   ```

### Backend Security

1. **CORS Configuration**:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://icct26.netlify.app"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **SQL Injection Prevention**:
   ```python
   # Use ORM parameterized queries
   team = db.query(Team).filter(Team.id == team_id).first()
   ```

3. **File Upload Validation**:
   ```python
   ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
   MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
   ```

---

## Backup & Recovery

### Database Backups

**Automated Backups** (Render):
- Daily automatic backups
- 7-day retention
- Point-in-time recovery

**Manual Backup**:
```bash
pg_dump -h host -U user -d icct26_db > backup_$(date +%Y%m%d).sql
```

**Restore**:
```bash
psql -h host -U user -d icct26_db < backup_20260105.sql
```

### File Storage Backups

**Cloudinary**:
- Automatic backup to cloud storage
- Version history
- Download assets via API

---

## Rollback Procedures

### Frontend Rollback (Netlify)

1. Go to Netlify Dashboard
2. Navigate to "Deploys"
3. Find previous successful deploy
4. Click "Publish deploy"

### Backend Rollback (Render)

1. Go to Render Dashboard
2. Navigate to service
3. Click "Rollback" on previous deployment
4. Confirm rollback

### Emergency Rollback (Git)

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## Scaling Strategies

### Horizontal Scaling

**Frontend**:
- Netlify auto-scales with global CDN
- No manual intervention needed

**Backend**:
- Render auto-scaling (paid plans)
- Add more instances as traffic grows

### Vertical Scaling

**Database**:
- Upgrade PostgreSQL plan
- Increase storage and connections

**Backend**:
- Upgrade server resources
- More CPU and RAM

---

## Cost Optimization

### Current Costs (Estimated)

| Service | Plan | Cost/Month |
|---------|------|------------|
| Netlify | Free | $0 |
| Render (Backend) | Free/Starter | $0-7 |
| Render (Database) | Free/Starter | $0-7 |
| Cloudinary | Free | $0 |
| **Total** | | **$0-14** |

### Cost Reduction Tips

1. Optimize images (reduce bandwidth)
2. Implement caching (reduce API calls)
3. Use free tiers efficiently
4. Monitor usage regularly

---

*Complete deployment and DevOps guide for ICCT26*
