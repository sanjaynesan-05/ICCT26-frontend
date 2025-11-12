# Backend Jersey Number Fix - Alignment Guide

**Status:** Frontend is correct ✅ | Backend needs verification

**Date:** November 12, 2025

---

## 🎯 Problem Statement

**Backend Error:**
```
asyncpg.exceptions.NotNullViolationError: null value in column "jersey_number" violates not-null constraint
```

**Root Cause:**
Backend is not receiving `jersey_number` field from frontend OR not correctly parsing/storing it.

**Frontend Status:** ✅ Sending correct data in correct format

---

## 📤 Frontend is Sending Correct Payload

### Confirmed Payload Structure
```json
{
  "team_name": "Team Name",
  "church_name": "Church Name",
  "captain": { ... },
  "viceCaptain": { ... },
  "payment_receipt": "data:image/png;base64,...",
  "pastor_letter": "data:image/png;base64,...",
  "players": [
    {
      "name": "Player 1",
      "age": 25,
      "phone": "9876543210",
      "role": "Batsman",
      "jersey_number": "7",                    ← CORRECT KEY!
      "aadhar_file": "data:image/png;base64,...",
      "subscription_file": "data:application/pdf;base64,..."
    }
  ]
}
```

**✅ Frontend sending:** `"jersey_number": "7"`

---

## 🔧 Backend Checklist

### 1️⃣ Pydantic Model Definition
**File:** `models/player.py` or similar

**Should have:**
```python
class PlayerRegistration(BaseModel):
    name: str
    age: int
    phone: str
    role: str
    jersey_number: str          # ✅ MUST match frontend key name!
    aadhar_file: str            # Base64
    subscription_file: str      # Base64
```

**❌ Wrong:**
```python
class PlayerRegistration(BaseModel):
    name: str
    jerseyNumber: str  # ❌ Wrong! Frontend sends jersey_number (snake_case)
```

**Check:**
```bash
# Verify field name in Pydantic model
grep -n "jersey_number" models/player.py
```

---

### 2️⃣ FastAPI Route Handler
**File:** `routes/registration.py` or similar

**Correct pattern:**
```python
@router.post("/register/team")
async def register_team(payload: TeamRegistrationPayload):
    """
    Expected payload structure:
    {
        "players": [
            {
                "jersey_number": "7",  ← This key name MUST match
                ...
            }
        ]
    }
    """
    
    # Parse player data
    for player_data in payload.players:
        print(f"📥 Player received: {player_data.dict()}")
        
        # Should print:
        # Player received: {
        #     'name': 'John',
        #     'jersey_number': '7',  ← Check this!
        #     ...
        # }
        
        player = create_player_from_data(player_data)
        db.add(player)
    
    await db.commit()
```

**Debug step:**
Add logging to see what backend receives:
```python
@router.post("/register/team")
async def register_team(payload: TeamRegistrationPayload):
    print("📥 Full payload received:", payload.dict())
    
    for idx, player_data in enumerate(payload.players):
        print(f"📥 Player {idx + 1}:", player_data.dict())
        print(f"   jersey_number = {player_data.jersey_number}")
        print(f"   type = {type(player_data.jersey_number)}")
    
    # Rest of logic...
```

**Expected output:**
```
📥 Player 1: {'name': 'John', 'age': 25, 'jersey_number': '7', ...}
   jersey_number = 7
   type = <class 'str'>
```

---

### 3️⃣ Database Model
**File:** `models/player_db.py` or ORM model

**Should have:**
```python
class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    phone = Column(String, nullable=False)
    role = Column(String, nullable=False)
    jersey_number = Column(String, nullable=False)  # ✅ MUST be NOT NULL!
    aadhar_file = Column(String, nullable=False)
    subscription_file = Column(String, nullable=False)
    # ... other fields
```

**Check:**
```bash
# Verify column name in DB model
grep -n "jersey_number" models/player_db.py
```

**Database migration should have:**
```sql
ALTER TABLE players ADD COLUMN jersey_number VARCHAR(3) NOT NULL;
```

---

### 4️⃣ Data Insertion Logic
**File:** `services/registration.py` or similar

**Correct pattern:**
```python
def create_player_in_db(db_session, player_data: PlayerRegistration, team_id: int):
    """
    Insert player with jersey_number
    """
    
    player = Player(
        team_id=team_id,
        name=player_data.name,
        age=player_data.age,
        phone=player_data.phone,
        role=player_data.role,
        jersey_number=player_data.jersey_number,  # ✅ CRITICAL!
        aadhar_file=player_data.aadhar_file,
        subscription_file=player_data.subscription_file,
    )
    
    db_session.add(player)
    db_session.flush()  # Flush to detect constraint violations
    
    print(f"✅ Player inserted with jersey_number={player.jersey_number}")
    
    return player
```

**❌ Wrong:**
```python
# This would cause NULL violation:
player = Player(
    name=player_data.name,
    age=player_data.age,
    # ❌ MISSING: jersey_number=player_data.jersey_number
)
```

---

## 🧪 Backend Testing Steps

### Step 1: Enable Debug Logging
```python
# At top of registration route
@router.post("/register/team")
async def register_team(payload: TeamRegistrationPayload):
    print("=" * 50)
    print("🔵 REGISTRATION START")
    print("=" * 50)
    
    print("\n📥 Full Payload Received:")
    print(json.dumps(payload.dict(), indent=2))
    
    for idx, player_data in enumerate(payload.players):
        print(f"\n📥 Player {idx + 1}:")
        print(f"   Name: {player_data.name}")
        print(f"   Age: {player_data.age}")
        print(f"   Jersey: {player_data.jersey_number}")
        print(f"   Jersey Type: {type(player_data.jersey_number)}")
        print(f"   Jersey is None: {player_data.jersey_number is None}")
        print(f"   Jersey == '': {player_data.jersey_number == ''}")
```

### Step 2: Test with Frontend
1. Start frontend: `npm run dev`
2. Start backend with debug logging enabled
3. Fill registration form with jersey numbers
4. Submit form
5. Check backend console for `📥 Player` logs

### Step 3: Verify DB Insert
```python
# After player insert
print(f"✅ Player inserted ID: {player.id}")
print(f"✅ Jersey in DB: {player.jersey_number}")

# Then verify in DB:
SELECT id, name, jersey_number FROM players LIMIT 1;
```

**Expected result:**
```
 id │   name    │ jersey_number
────┼───────────┼────────────────
  1 │ Player 1  │ 7
```

---

## 📊 Troubleshooting Decision Tree

```
Frontend submits form
         ↓
Does backend receive the request? (Check logs)
    ├─ NO → Network/CORS issue
    │       • Check backend is running
    │       • Check CORS headers
    │       • Check API endpoint URL
    │
    └─ YES → Check payload content
         ↓
         Does payload contain "jersey_number" key?
             ├─ NO → Frontend issue (but verified it does!)
             │       • Frontend sends: ✅ Correct
             │
             └─ YES → Check Pydantic model
                  ↓
                  Can Pydantic parse jersey_number field?
                      ├─ NO → Model field name mismatch
                      │       • Expected: jersey_number
                      │       • Actual: ??? (check model definition)
                      │
                      └─ YES → Check DB insert
                           ↓
                           Is jersey_number passed to DB model?
                               ├─ NO → Insertion logic bug
                               │       • Check create_player() function
                               │       • Verify jersey_number= parameter
                               │
                               └─ YES → Check DB column
                                    ↓
                                    Does DB column exist?
                                        ├─ NO → Run migration
                                        │       ALTER TABLE players ADD COLUMN jersey_number VARCHAR(3) NOT NULL;
                                        │
                                        └─ YES → Check constraint
                                             ↓
                                             Column is NOT NULL?
                                                 ├─ NO → Change constraint
                                                 │       ALTER TABLE players ALTER COLUMN jersey_number SET NOT NULL;
                                                 │
                                                 └─ YES → Should work!
                                                      ✅ Value should be inserted
                                                      If still fails → Check value is not empty
```

---

## 🔍 Common Backend Issues

### Issue 1: Field Name Mismatch
```python
# ❌ WRONG
class PlayerRegistration(BaseModel):
    jerseyNumber: str  # Pydantic receives snake_case but expects camelCase!
```

**Fix:**
```python
# ✅ CORRECT
class PlayerRegistration(BaseModel):
    jersey_number: str  # Matches frontend snake_case
```

---

### Issue 2: Field Not Passed to DB
```python
# ❌ WRONG
player = Player(
    name=data.name,
    age=data.age,
    # Missing: jersey_number=data.jersey_number
)
```

**Fix:**
```python
# ✅ CORRECT
player = Player(
    name=data.name,
    age=data.age,
    jersey_number=data.jersey_number,  # Add this!
)
```

---

### Issue 3: NULL Column Definition
```sql
-- ❌ WRONG
ALTER TABLE players ADD COLUMN jersey_number VARCHAR(3);  -- Allows NULL

-- ✅ CORRECT
ALTER TABLE players ADD COLUMN jersey_number VARCHAR(3) NOT NULL;  -- NO NULL
```

---

### Issue 4: Value is Empty String
```python
# ❌ WRONG
player.jersey_number = ""  # Empty string gets inserted, then...
# Actually empty string is NOT null, so shouldn't cause issue
# But still bad!

# ✅ CORRECT
# Frontend validation ensures: /^\d{1,3}$/
# Backend fallback: jersey_number || "01"
# Result: Always has value
```

---

## ✅ Verification Commands

### Test Frontend Payload
```bash
# 1. Start frontend
npm run dev

# 2. Open browser DevTools (F12)

# 3. Go to Console tab

# 4. Fill form and submit

# 5. Look for: 📤 Registration Payload - Players jersey_number validation:
#    Should show: Player 1: jersey_number="7"
```

### Test Backend Receives Data
```bash
# 1. Add logging (as shown above)

# 2. Start backend with logging enabled

# 3. Submit from frontend

# 4. Check backend console for:
#    📥 Player 1: {..., jersey_number='7', ...}
```

### Test DB Insert
```bash
# After successful submission:
SELECT 
    id, 
    name, 
    jersey_number 
FROM players 
ORDER BY id DESC 
LIMIT 5;

# Should show:
# id │      name      │ jersey_number
# ────────────────────────────────────
#  11 │ Player 1       │ 7
#  12 │ Player 2       │ 8
#   ...
```

---

## 🎯 Summary

| Component | Status | Key Field |
|-----------|--------|-----------|
| **Frontend** | ✅ Correct | Sends `"jersey_number": "7"` |
| **API Contract** | ✅ Correct | `jersey_number: str` in Pydantic |
| **Route Handler** | ⏳ TBD | Must parse and log jersey_number |
| **DB Model** | ⏳ TBD | Must have jersey_number column |
| **Insert Logic** | ⏳ TBD | Must pass jersey_number to insert |
| **Database** | ⏳ TBD | Must have jersey_number NOT NULL |

---

## 📝 Next Steps

1. **Add debug logging** to backend registration route
2. **Submit test form** from frontend
3. **Check backend logs** for jersey_number values
4. **Verify DB insert** works without constraint violation
5. **Deploy updated backend** with fixes

**If you need help debugging backend, run the debug logging and share the output!**

---

*Frontend Verified Correct: November 12, 2025*
*Ready for Backend Integration Testing*
