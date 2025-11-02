# 🎮 Cricket Loader - Quick Customization Guide

## 🎯 Common Customizations

### 1. Change Loader Duration
**File:** `src/App.tsx`
```tsx
// Current: 5.5 seconds
setTimeout(() => setLoading(false), 5500)

// Fast (3 seconds)
setTimeout(() => setLoading(false), 3000)

// Slow (8 seconds)
setTimeout(() => setLoading(false), 8000)
```

**File:** `src/components/CricketLoader.tsx`
```tsx
// Progress speed (lower = faster)
}, 45); // Current: 45ms per increment

// Faster
}, 30); // ~3 seconds

// Slower  
}, 60); // ~6 seconds
```

---

### 2. Modify Loading Messages
**File:** `src/components/CricketLoader.tsx` (Line ~16)
```tsx
const taglines = [
  "Warming up the pitch...",      // Replace with your text
  "Setting the field...",          // Replace with your text
  "Getting ready to bowl...",      // Replace with your text
  "Match starting soon!",          // Replace with your text
];

// Example: Custom messages
const taglines = [
  "Loading tournament data...",
  "Preparing the field...",
  "Almost ready to play!",
  "Let's go! 🏏",
];
```

---

### 3. Adjust Colors

#### Gold Accent Color
```tsx
// Find and replace in CricketLoader.tsx:
#FFCC29 → #YOUR_COLOR  // Primary gold
#FFD65C → #YOUR_COLOR  // Light gold
```

#### Background Colors
```tsx
// Stadium gradient:
from-[#001C40] → from-[#YOUR_COLOR]  // Dark blue
via-[#002B5C]  → via-[#YOUR_COLOR]   // Medium blue
to-[#0D1B2A]   → to-[#YOUR_COLOR]    // Navy
```

#### Popular Color Schemes
```tsx
// Red Theme (IPL RCB Style)
#FFCC29 → #D32F2F (Red)
#002B5C → #212121 (Dark)

// Green Theme (Pakistan/CSK Style)
#FFCC29 → #00FF00 (Neon Green)
#002B5C → #1B5E20 (Dark Green)

// Purple Theme (KKR Style)
#FFCC29 → #9C27B0 (Purple)
#002B5C → #4A148C (Dark Purple)
```

---

### 4. Change Number of Floating Sparks
**File:** `src/components/CricketLoader.tsx` (Line ~53)
```tsx
// Current: 12 sparks
const sparks = Array.from({ length: 12 }, (_, i) => i);

// More sparks (20)
const sparks = Array.from({ length: 20 }, (_, i) => i);

// Less sparks (6)
const sparks = Array.from({ length: 6 }, (_, i) => i);

// No sparks
const sparks = [];
```

---

### 5. Adjust Ball Speed & Physics
**File:** `src/components/CricketLoader.tsx` (Line ~183)
```tsx
transition={{ 
  type: "spring", 
  stiffness: 90,  // Higher = faster (try 120)
  damping: 12     // Lower = more bounce (try 8)
}}

// Fast & Bouncy
stiffness: 120, damping: 8

// Slow & Smooth
stiffness: 60, damping: 20
```

---

### 6. Disable Flash Effect
**File:** `src/components/CricketLoader.tsx`

**Option A:** Remove flash completely
```tsx
// Comment out lines ~251-263 (the flash AnimatePresence block)
```

**Option B:** Make flash subtle
```tsx
animate={{ opacity: [0, 0.3, 0] }}  // Instead of [0, 1, 0]
```

---

### 7. Change Logo Text
**File:** `src/components/CricketLoader.tsx` (Line ~91-96)
```tsx
<motion.h1>
  ICCT26  {/* Change this */}
</motion.h1>
<motion.p>
  CRICKET TOURNAMENT  {/* Change this */}
</motion.p>

// Example:
<motion.h1>
  TOURNAMENT 2026
</motion.h1>
<motion.p>
  Powered by Your Name
</motion.p>
```

---

### 8. Adjust for Mobile Sizing
**File:** `src/components/CricketLoader.tsx`
```tsx
// Logo size (Line ~91)
text-7xl sm:text-8xl md:text-9xl
// Change to:
text-5xl sm:text-6xl md:text-8xl  // Smaller

// Ball size (Line ~175)
w-9 h-9 sm:w-12 sm:h-12
// Change to:
w-7 h-7 sm:w-10 sm:h-10  // Smaller

// Progress bar width (Line ~109)
w-72 sm:w-80 md:w-96
// Change to:
w-64 sm:w-72 md:w-80  // Narrower
```

---

### 9. Add Sound (Optional)

**Step 1:** Add audio file to `public/stadium-ambient.mp3`

**Step 2:** Replace loader in `App.tsx`:
```tsx
import CricketLoaderEnhanced from './components/CricketLoaderEnhanced'

// In render:
<CricketLoaderEnhanced enableSound={true} />
```

---

### 10. Disable Animations (Performance Mode)

**Reduce Effects:**
```tsx
// Remove floating sparks (Line ~55)
{/* Comment out the sparks.map section */}

// Remove floodlight animations (Line ~61-75)
{/* Comment out the motion.div floodlights */}

// Disable shimmer (Line ~137-142)
{/* Comment out the shimmer motion.div */}
```

---

## 🎨 Pre-Built Color Themes

### Copy & Paste These

#### 🔴 Red Thunder (RCB Style)
```tsx
// Gold → Red
#FFCC29 → #EF4444
#FFD65C → #F87171
// Blue → Black
#002B5C → #1F2937
#001C40 → #111827
```

#### 🟢 Emerald Blaze (CSK Style)
```tsx
// Gold → Yellow
#FFCC29 → #FBBF24
#FFD65C → #FCD34D
// Blue → Yellow-Green
#002B5C → #65A30D
#001C40 → #3F6212
```

#### 🟣 Royal Purple (KKR Style)
```tsx
// Gold → Purple
#FFCC29 → #A855F7
#FFD65C → #C084FC
// Blue → Deep Purple
#002B5C → #4C1D95
#001C40 → #2E1065
```

#### 🔵 Azure Storm (MI Style)
```tsx
// Gold → Sky Blue
#FFCC29 → #38BDF8
#FFD65C → #7DD3FC
// Blue → Deep Blue
#002B5C → #1E3A8A
#001C40 → #1E293B
```

---

## 🚀 Performance Tips

### For Low-End Devices
1. Reduce sparks to 6
2. Remove blur effects (`blur-xl` → remove)
3. Disable shimmer animation
4. Use simple solid colors instead of gradients

### For Fast Load Times
1. Set duration to 3000ms
2. Increase progress interval to 30ms
3. Remove delay transitions

---

## 🐛 Common Issues & Fixes

### Issue: Loader disappears too quickly
**Fix:** Increase timeout in `App.tsx`
```tsx
setTimeout(() => setLoading(false), 8000) // Longer
```

### Issue: Ball doesn't roll smoothly
**Fix:** Adjust spring physics
```tsx
stiffness: 120, damping: 10
```

### Issue: Logo text looks small on mobile
**Fix:** Increase mobile font size
```tsx
text-6xl sm:text-8xl  // Instead of text-7xl
```

### Issue: Progress bar too narrow
**Fix:** Increase width
```tsx
w-80 sm:w-96 md:w-[500px]
```

### Issue: Flash too bright/sudden
**Fix:** Reduce opacity
```tsx
opacity: [0, 0.5, 0]  // Instead of [0, 1, 0]
```

---

## 📱 Responsive Breakpoints

Tailwind breakpoints used in the loader:
- `default` - Mobile (<640px)
- `sm:` - Tablet (≥640px)
- `md:` - Desktop (≥768px)

Example:
```tsx
text-3xl      // Mobile: 30px
sm:text-4xl   // Tablet: 36px
md:text-5xl   // Desktop: 48px
```

---

## ✨ Advanced: Add Confetti at 100%

Add this at Line ~240 (before percentage counter):
```tsx
{progress === 100 && (
  <motion.div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: 0, x: window.innerWidth / 2, opacity: 1 }}
        animate={{
          y: window.innerHeight,
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 500,
          opacity: 0,
          rotate: Math.random() * 720,
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-2 h-2 bg-[#FFCC29] rounded-full"
      />
    ))}
  </motion.div>
)}
```

---

**Need more help? Check `LOADER_IMPLEMENTATION.md` for full documentation!**
