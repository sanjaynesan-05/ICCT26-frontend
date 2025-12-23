# 🏆 ICCT '26 Registration Intro - Sponsor Configuration Guide

## Quick Start: Adding Your Sponsor Logos

### Step 1: Prepare Your Logos
1. Get sponsor logo images (PNG/JPG with transparent backgrounds preferred)
2. Host them on your server or CDN
3. Get the public URLs

### Step 2: Update the Component
Open [src/components/RegistrationIntro.tsx](src/components/RegistrationIntro.tsx)

Find this section (around line 16-22):
```typescript
// Sponsor logos (using placeholder images - update with actual sponsor logos)
const sponsors = [
  { name: 'Sponsor 1', src: 'https://via.placeholder.com/120x60?text=Sponsor+1' },
  { name: 'Sponsor 2', src: 'https://via.placeholder.com/120x60?text=Sponsor+2' },
  { name: 'Sponsor 3', src: 'https://via.placeholder.com/120x60?text=Sponsor+3' },
  { name: 'Sponsor 4', src: 'https://via.placeholder.com/120x60?text=Sponsor+4' },
  { name: 'Sponsor 5', src: 'https://via.placeholder.com/120x60?text=Sponsor+5' },
]
```

### Step 3: Replace with Your Sponsors
```typescript
const sponsors = [
  { name: 'Church Sponsor', src: 'https://example.com/church-logo.png' },
  { name: 'Local Business', src: 'https://example.com/business-logo.png' },
  { name: 'Sports Brand', src: 'https://example.com/sports-logo.png' },
  { name: 'Youth Organization', src: 'https://example.com/org-logo.png' },
  { name: 'Community Partner', src: 'https://example.com/partner-logo.png' },
]
```

### Step 4: (Optional) Display Logo Images
Currently the carousel shows sponsor names. To display actual images instead:

Find the carousel section (around line 228-248) and replace:
```typescript
// Current (shows text):
<p className="font-heading font-bold text-accent text-center">{s.name}</p>

// Change to (shows image):
<img 
  src={s.src} 
  alt={s.name}
  className="h-12 object-contain"
/>
```

## 📸 Logo Best Practices

### Image Specifications
- **Format**: PNG (transparent background) or JPG
- **Dimensions**: ~300x150px or any 2:1 aspect ratio
- **Size**: < 100KB per logo
- **Quality**: High resolution (72+ DPI for web)

### Hosting Options
1. **Netlify** (if using Netlify CMS)
   ```
   https://your-site.netlify.app/assets/logo-name.png
   ```

2. **Your Server**
   ```
   https://your-domain.com/images/sponsors/logo-name.png
   ```

3. **CDN** (Cloudinary, imgix)
   ```
   https://cdn.example.com/sponsors/logo-name.png
   ```

4. **Relative Path** (if in public folder)
   ```
   /sponsor-logos/logo-name.png
   ```

## 🎨 Carousel Customization

### Add More Sponsors
Simply add more objects to the array:
```typescript
const sponsors = [
  { name: 'Sponsor 1', src: '...' },
  { name: 'Sponsor 2', src: '...' },
  { name: 'Sponsor 3', src: '...' },
  { name: 'Sponsor 4', src: '...' },
  { name: 'Sponsor 5', src: '...' },
  { name: 'Sponsor 6', src: '...' },  // Add new
  { name: 'Sponsor 7', src: '...' },  // Add new
]
```

### Change Carousel Speed
Find line 54 in the useEffect (Scene 3 rotation):
```typescript
// Current (changes every 1 second):
const interval = setInterval(() => {
  setSponsor((prev) => (prev + 1) % sponsors.length)
}, 1000)  // ← Change this number

// Examples:
// 800 = faster
// 1500 = slower
```

### Adjust Scene 3 Duration
Find the timing at the top of the component (lines 29-38):
```typescript
const scene3Timer = setTimeout(() => setCurrentScene(3), 9000)
```

If you add more sponsors and want longer view time:
- Each sponsor gets ~1000ms (1 second)
- 5 sponsors = 5 seconds
- Add 1 second per sponsor

Example for 8 sponsors (8 seconds):
```typescript
// Original end was 9000
// Scene 3 starts at 4000
// Duration = 9000 - 4000 = 5000
// New duration with 8 sponsors = 8000
const scene3Timer = setTimeout(() => setCurrentScene(3), 4000)
const scene4Timer = setTimeout(() => setCurrentScene(4), 12000)  // Was 14000
const scene5Timer = setTimeout(() => setCurrentScene(5), 18000)  // Was 16000
const completeTimer = setTimeout(() => {
  setCurrentScene(6)
  onComplete()
}, 20000)  // Was 18000
```

## 📝 Example Configurations

### Minimal Setup (3 Sponsors)
```typescript
const sponsors = [
  { name: 'CSI Church', src: '/logos/csi-church.png' },
  { name: 'Local Sports Club', src: '/logos/sports-club.png' },
  { name: 'Youth Fellowship', src: '/logos/youth-org.png' },
]
```

### Full Setup (10 Sponsors)
```typescript
const sponsors = [
  { name: 'Primary Church', src: '/logos/church1.png' },
  { name: 'Secondary Church', src: '/logos/church2.png' },
  { name: 'Sports Sponsor', src: '/logos/sports.png' },
  { name: 'Local Business 1', src: '/logos/biz1.png' },
  { name: 'Local Business 2', src: '/logos/biz2.png' },
  { name: 'Youth Organization', src: '/logos/youth.png' },
  { name: 'Community Partner 1', src: '/logos/partner1.png' },
  { name: 'Community Partner 2', src: '/logos/partner2.png' },
  { name: 'Media Partner', src: '/logos/media.png' },
  { name: 'Tech Partner', src: '/logos/tech.png' },
]
```

## ✅ Testing Checklist

- [ ] Update sponsor URLs in the component
- [ ] Clear browser localStorage to see animation again:
  ```javascript
  localStorage.removeItem('icct26_intro_seen')
  ```
- [ ] Test on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile (iOS Safari, Chrome Mobile)
- [ ] Test on tablet (both orientations)
- [ ] Verify all sponsor images load correctly
- [ ] Check for image loading errors in console
- [ ] Verify carousel rotates smoothly
- [ ] Confirm timing works with your sponsor count
- [ ] Test that form appears after animation

## 🚨 Troubleshooting

### Logos not showing?
1. Check image URLs are correct
2. Verify CORS headers if using external CDN
3. Open browser DevTools → Network tab → check for 404 errors
4. Images must be publicly accessible

### Carousel not rotating?
1. Check that at least one sponsor has correct `src`
2. Verify Scene 3 is actually being shown
3. Check browser console for errors

### Timing issues?
1. Adjust the setTimeout values proportionally
2. Ensure all sponsors load quickly
3. Consider lazy-loading if using many sponsors

## 📧 Support

For issues or questions about the implementation, refer to:
- [REGISTRATION_INTRO_IMPLEMENTATION.md](REGISTRATION_INTRO_IMPLEMENTATION.md)
- Component file: [src/components/RegistrationIntro.tsx](src/components/RegistrationIntro.tsx)
- Registration page: [src/pages/Registration.tsx](src/pages/Registration.tsx)

---

**Version**: 1.0
**Last Updated**: December 24, 2025
**Status**: Ready for Production
