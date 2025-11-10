# 🔧 Backend & Frontend File Upload & Registration Fix

## 📋 Overview

Complete guide to fix the registration system for proper file upload handling with Base64 encoding, MIME type validation, and CORS support.

---

## 🎯 Problems to Fix

1. ❌ File uploads not properly Base64 encoded with MIME types
2. ❌ Captain/Vice-Captain not structured as objects in payload
3. ❌ CORS issues between frontend and backend
4. ❌ File validation missing on both sides
5. ❌ Database column limits for file storage

---

## ✅ Solution Architecture

### Frontend Flow
```
User selects file 
    ↓
FileUpload component reads file
    ↓
Convert to Base64 with MIME type (data:image/jpeg;base64,...)
    ↓
Store in form state
    ↓
Send payload to backend with Base64 strings
```

### Backend Flow
```
Receive Base64 payload
    ↓
Validate MIME type (PDF, PNG, JPEG only)
    ↓
Validate Base64 integrity
    ↓
Extract MIME type for storage
    ↓
Store in database with proper column size
```

---

## 📁 Files to Modify

### Backend
- `app/schemas_team.py` - Pydantic schemas
- `app/routes/registration.py` - POST endpoint
- `app/services.py` - File validation logic
- `app/main.py` - CORS configuration

### Frontend
- `src/components/FileUpload.tsx` - File upload component
- `src/pages/Registration.tsx` - Form logic
- `src/components/PlayerFormCard.tsx` - Player form
- `src/services/api.ts` - API calls
- `.env` - Environment variables

---

## 🔧 Implementation Guide

### BACKEND CHANGES

#### 1. Update `app/schemas_team.py`

```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional

class CaptainInfo(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., regex=r'^\+?1?\d{9,15}$')
    whatsapp: str = Field(..., regex=r'^\d{10}$')
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')

class PlayerData(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    age: int = Field(..., ge=15, le=60)
    phone: str = Field(..., regex=r'^\+?1?\d{9,15}$')
    role: str = Field(..., regex=r'^(Batsman|Bowler|All-rounder|Wicket Keeper)$')
    aadhar_file: str  # Base64 with MIME: data:image/jpeg;base64,...
    subscription_file: str  # Base64 with MIME

class TeamRegistration(BaseModel):
    church_name: str = Field(..., min_length=1, max_length=255)
    team_name: str = Field(..., min_length=1, max_length=255)
    pastor_letter: str  # Base64 with MIME
    payment_receipt: str  # Base64 with MIME
    captain: CaptainInfo
    vice_captain: CaptainInfo
    players: List[PlayerData] = Field(..., min_items=11, max_items=15)

    @validator('players')
    def validate_players(cls, v):
        if len(v) < 11:
            raise ValueError('Minimum 11 players required')
        if len(v) > 15:
            raise ValueError('Maximum 15 players allowed')
        return v
```

#### 2. Update `app/services.py`

```python
import base64
import re
from typing import Dict, Tuple, Optional
from datetime import datetime

ALLOWED_MIME_TYPES = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg'
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes

def validate_base64_file(file_str: str, file_name: str = 'file') -> Tuple[str, str, bytes]:
    """
    Validate Base64 file and extract MIME type and binary data
    
    Returns: (mime_type, extension, binary_data)
    Raises: ValueError if invalid
    """
    if not file_str:
        raise ValueError(f"{file_name} is empty")
    
    # Extract MIME type and Base64 data
    if not file_str.startswith("data:"):
        raise ValueError(f"{file_name} must be in data URI format (data:mime/type;base64,...)")
    
    try:
        header, base64_data = file_str.split(",", 1)
    except ValueError:
        raise ValueError(f"{file_name} has invalid format")
    
    # Extract MIME type from header
    mime_match = re.match(r'data:([a-z/+\-]+);base64', header)
    if not mime_match:
        raise ValueError(f"{file_name} MIME type not found or invalid")
    
    mime_type = mime_match.group(1)
    
    # Validate MIME type
    if mime_type not in ALLOWED_MIME_TYPES:
        allowed = ", ".join(ALLOWED_MIME_TYPES.keys())
        raise ValueError(f"{file_name} MIME type '{mime_type}' not allowed. Allowed: {allowed}")
    
    # Decode Base64
    try:
        binary_data = base64.b64decode(base64_data, validate=True)
    except Exception as e:
        raise ValueError(f"{file_name} Base64 decoding failed: {str(e)}")
    
    # Validate file size
    if len(binary_data) > MAX_FILE_SIZE:
        raise ValueError(f"{file_name} exceeds 5MB limit")
    
    extension = ALLOWED_MIME_TYPES[mime_type]
    return mime_type, extension, binary_data

async def save_team_to_db(team_data: dict) -> dict:
    """
    Save team registration to database with file validation
    """
    try:
        # Validate all files
        files_to_validate = {
            'pastor_letter': team_data.get('pastor_letter'),
            'payment_receipt': team_data.get('payment_receipt'),
        }
        
        for file_name, file_str in files_to_validate.items():
            if not file_str:
                raise ValueError(f"Missing {file_name}")
            mime_type, ext, binary = validate_base64_file(file_str, file_name)
        
        # Validate player files
        for idx, player in enumerate(team_data.get('players', [])):
            for file_field in ['aadhar_file', 'subscription_file']:
                file_str = player.get(file_field)
                if not file_str:
                    raise ValueError(f"Player {idx + 1} missing {file_field}")
                mime_type, ext, binary = validate_base64_file(file_str, f"Player {idx + 1} {file_field}")
        
        # Store in database (implement your DB logic here)
        # Example: create_team_record(team_data)
        
        return {
            "team_id": "ICCT26-0001",
            "status": "registered",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except ValueError as e:
        raise ValueError(f"Validation error: {str(e)}")
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")
```

#### 3. Update `app/routes/registration.py`

```python
from fastapi import APIRouter, HTTPException, status
from app.schemas_team import TeamRegistration
from app.services import save_team_to_db

router = APIRouter(prefix="/api", tags=["registration"])

@router.post("/register/team", status_code=201)
async def register_team(team: TeamRegistration):
    """
    Register a team with captain, vice-captain, players, and files
    
    Accepts Base64 encoded files with MIME types
    """
    try:
        # Convert Pydantic model to dict for service
        team_dict = team.dict()
        
        # Save to database
        result = await save_team_to_db(team_dict)
        
        return {
            "success": True,
            "data": result,
            "message": "Team registered successfully"
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/status")
async def get_status():
    """Get API status"""
    return {"status": "ok", "service": "registration"}
```

#### 4. Update `app/main.py` - CORS Configuration

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import registration, team

app = FastAPI(
    title="ICCT26 Cricket Tournament API",
    description="Team registration and management API",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "https://icct26.netlify.app",  # Production frontend
    "http://localhost:5173",        # Local development (Vite default)
    "http://localhost:3000",        # Alternative local port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Type",
        "Authorization",
    ],
    max_age=3600,
)

# Include routers
app.include_router(registration.router)
app.include_router(team.router)

@app.get("/")
async def root():
    return {
        "message": "ICCT26 Cricket Tournament Registration API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/status")
async def status():
    return {"status": "ok", "service": "registration"}
```

---

## 🎨 FRONTEND CHANGES

### 1. Update `src/components/FileUpload.tsx`

```tsx
import React, { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  file: File | null
  onFileChange: (base64: string | null) => void
  accept?: string
  placeholder?: string
  className?: string
  maxSizeMB?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  accept = '.pdf,.png,.jpg,.jpeg',
  placeholder = 'Upload file',
  className = '',
  maxSizeMB = 5,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg']
  const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024

  const validateFile = (f: File): boolean => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(f.type)) {
      setError(`Invalid file type. Allowed: PDF, PNG, JPEG`)
      return false
    }

    // Check file size
    if (f.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return false
    }

    setError('')
    return true
  }

  const readFileAsBase64 = (f: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onload = () => {
      const base64 = reader.result as string
      onFileChange(base64) // Returns: data:image/jpeg;base64,...
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
  }

  const handleFile = (f: File) => {
    if (validateFile(f)) {
      readFileAsBase64(f)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) handleFile(files[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
    setError('')
  }

  return (
    <div className={className}>
      <div className="relative">
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-sm ${
            dragActive ? 'border-gray-700 bg-gray-100' : 'border-gray-300'
          }`}
        >
          {file ? (
            <span className="text-green-600">✓</span>
          ) : (
            <Upload className="w-5 h-5 text-gray-600" />
          )}
          <span className="truncate max-w-[180px] text-gray-700 font-subheading text-sm">
            {file ? file.name : placeholder}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {file && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-gray-200 text-gray-500 shadow"
            aria-label="Clear file"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs mt-2">{error}</p>
      )}
    </div>
  )
}

export default FileUpload
```

### 2. Update `src/pages/Registration.tsx` - handleSubmit

Key changes in the form submission:

```tsx
// In handleSubmit function
const handleSubmit = async () => {
  setIsSubmitting(true)
  setConvertingFiles(true)
  setValidationError('')
  try {
    // ... existing validations ...

    // Build payload with Base64 strings (already Base64 from FileUpload)
    const payload = {
      churchName: formData.churchName,
      teamName: formData.teamName,
      pastorLetter: formData.pastorLetterBase64,  // Base64 string
      captain: {
        name: formData.captain.name,
        phone: formData.captain.phone,
        whatsapp: formData.captain.whatsapp,
        email: formData.captain.email,
      },
      viceCaptain: {
        name: formData.viceCaptain.name,
        phone: formData.viceCaptain.phone,
        whatsapp: formData.viceCaptain.whatsapp,
        email: formData.viceCaptain.email,
      },
      players: formData.players.map(p => ({
        name: p.name,
        age: p.age,
        phone: p.phone,
        role: p.role,
        aadharFile: p.aadharFileBase64,
        subscriptionFile: p.subscriptionFileBase64,
      })),
      paymentReceipt: formData.paymentReceiptBase64,
    }

    // Call API
    await apiService.registerTeam(payload)

    setShowSuccess(true)
  } catch (err) {
    // Error handling
  } finally {
    setIsSubmitting(false)
    setConvertingFiles(false)
  }
}
```

### 3. Update `.env`

```
VITE_API_URL=https://icct26-backend.onrender.com
VITE_MAX_FILE_SIZE=5242880
```

---

## ✅ Validation Checklist

- [ ] Backend schemas accept Base64 with MIME types
- [ ] Backend validates MIME types (PDF, PNG, JPEG only)
- [ ] Backend validates file sizes (5MB limit)
- [ ] CORS headers configured correctly
- [ ] Frontend FileUpload converts files to Base64
- [ ] FileUpload validates before encoding
- [ ] Registration form sends objects for captain/vice-captain
- [ ] Players array validated (11-15 items)
- [ ] API endpoint matches: `/api/register/team`
- [ ] Error messages clear and helpful

---

## 🧪 Testing

### Backend Test
```bash
curl -X POST https://icct26-backend.onrender.com/api/register/team \
  -H "Content-Type: application/json" \
  -d '{
    "church_name": "CSI St. Peters",
    "team_name": "Thunder",
    "pastor_letter": "data:image/jpeg;base64,...",
    "payment_receipt": "data:image/jpeg;base64,...",
    "captain": {...},
    "vice_captain": {...},
    "players": [...]
  }'
```

### Frontend Test
1. Open registration form
2. Upload files (should show checkmark if valid)
3. Submit form
4. Should see success message (not 404)

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Not Found | Endpoint should be `/api/register/team` |
| CORS Error | Check `allow_origins` in main.py |
| File too large | Validate size before Base64 encoding |
| Invalid MIME type | Only PDF, PNG, JPEG allowed |
| Base64 invalid | Ensure file format is `data:mime/type;base64,...` |

