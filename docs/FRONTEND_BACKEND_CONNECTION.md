# Frontend-Backend Connection Guide

## Problem: ProgressEvent Error

If you see a `ProgressEvent` or "Failed to fetch" error, it means the frontend cannot reach the backend.

## Checklist

### 1. Backend is Running
Make sure your backend is running on port 8000:

```bash
cd /path/to/your/backend-repo
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

### 2. Backend has CORS Enabled

Your FastAPI backend MUST have CORS middleware configured. Add this to your `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add this after creating your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Local dev (Vite default)
        "http://localhost:3000",       # Alternative dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        # For production, add your deployed domain:
        # "https://yourfrontend.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Frontend Environment Variable

Check `.env` file in the frontend repo:

```properties
VITE_API_URL=http://localhost:8000
```

### 4. Test the Backend Directly

In your browser, visit:
```
http://localhost:8000/
```

You should see the backend response (usually a JSON welcome message).

### 5. Restart Frontend Dev Server

After backend is running and CORS is configured, restart the frontend:

```bash
npm run dev
```

Then clear browser cache (Ctrl+Shift+Del) and reload the page.

## Expected Flow

1. ✅ Backend running on `http://localhost:8000`
2. ✅ CORS middleware configured
3. ✅ Frontend can reach backend
4. ✅ User fills form and submits
5. ✅ Files are converted to Base64
6. ✅ JSON payload is POSTed to `/register/team`
7. ✅ Success message appears

## Still Having Issues?

If it still doesn't work, check:

- **Backend logs**: Look for error messages in backend terminal
- **Browser console**: Check for exact error message (F12)
- **Network tab** (F12 → Network): See if request was made and what response was
- **Backend port**: Verify backend is actually on 8000 (`netstat -ano | findstr :8000` on Windows)
- **Firewall**: Make sure port 8000 is not blocked

## For Production Deployment

When deploying to production:

1. Update `.env` with production backend URL:
   ```properties
   VITE_API_URL=https://backend.yourdomain.com
   ```

2. Update backend CORS with production frontend domain:
   ```python
   allow_origins=[
       "https://frontend.yourdomain.com",
       "https://www.frontend.yourdomain.com",
   ]
   ```

3. Rebuild and deploy both frontend and backend
