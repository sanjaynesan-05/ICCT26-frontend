# 🎨 ICCT26 Design System & Styling Guide

## Design Philosophy

The ICCT26 design system emphasizes:
- **Professional** - Enterprise-quality visual standards
- **Energetic** - Cricket tournament excitement
- **Modern** - Contemporary web design trends
- **Accessible** - WCAG 2.1 AA compliance
- **Responsive** - Mobile-first approach

---

## Color Palette

### Primary Colors

```css
/* Navy Blue - Primary brand color */
--color-primary: #002B5C
rgb(0, 43, 92)

/* Midnight Navy - Secondary brand color */
--color-secondary: #0D1B2A
rgb(13, 27, 42)

/* Bright Gold - Accent color */
--color-accent: #FFCC29
rgb(255, 204, 41)
```

### Background Colors

```css
/* Dark Background Start */
--color-bg-start: #001C40
rgb(0, 28, 64)

/* Dark Background End */
--color-bg-end: #002B5C
rgb(0, 43, 92)

/* Background Gradient */
background: linear-gradient(135deg, #001C40 0%, #002B5C 100%)
```

### Text Colors

```css
/* Primary Text - White */
--color-text-primary: #FFFFFF
rgb(255, 255, 255)

/* Secondary Text - Light Gray */
--color-text-secondary: #B0B0B0
rgb(176, 176, 176)

/* Muted Text - Gray */
--color-text-muted: #6B7280
rgb(107, 114, 128)
```

### Status Colors

```css
/* Success - Green */
--color-success: #4CAF50
rgb(76, 175, 80)

/* Error - Red */
--color-error: #F44336
rgb(244, 67, 54)

/* Warning - Yellow */
--color-warning: #FFC107
rgb(255, 193, 7)

/* Info - Blue */
--color-info: #2196F3
rgb(33, 150, 243)
```

### UI Colors

```css
/* Glass Background */
background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(10px)

/* Glass Border */
border: 1px solid rgba(255, 255, 255, 0.2)

/* Overlay Dark */
background: rgba(0, 0, 0, 0.5)

/* Hover State */
background: rgba(255, 204, 41, 0.1)
```

---

## Typography

### Font Families

```css
/* Headings - Bold, Impact */
--font-heading: 'Bebas Neue', Impact, 'Arial Black', sans-serif
font-weight: 700
letter-spacing: 0.05em

/* Subheadings - Clean, Modern */
--font-subheading: 'Quicksand', Verdana, Geneva, sans-serif
font-weight: 600
letter-spacing: 0.02em

/* Body Text - Readable */
--font-body: 'Manrope', -apple-system, BlinkMacSystemFont, 
            'Segoe UI', Roboto, Oxygen, Ubuntu, Arial, sans-serif
font-weight: 400
letter-spacing: 0.01em
```

### Font Sizes

```css
/* Display - Hero Titles */
--text-9xl: 8rem     /* 128px */
--text-8xl: 6rem     /* 96px */
--text-7xl: 4.5rem   /* 72px */

/* Headings */
--text-6xl: 3.75rem  /* 60px - H1 */
--text-5xl: 3rem     /* 48px - H2 */
--text-4xl: 2.25rem  /* 36px - H3 */
--text-3xl: 1.875rem /* 30px - H4 */
--text-2xl: 1.5rem   /* 24px - H5 */
--text-xl: 1.25rem   /* 20px - H6 */

/* Body Text */
--text-lg: 1.125rem  /* 18px - Large body */
--text-base: 1rem    /* 16px - Default */
--text-sm: 0.875rem  /* 14px - Small */
--text-xs: 0.75rem   /* 12px - Extra small */
```

### Font Weights

```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Line Heights

```css
--leading-none: 1
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2
```

---

## Spacing System

### Scale (Tailwind-based)

```css
0: 0px
1: 0.25rem   /* 4px */
2: 0.5rem    /* 8px */
3: 0.75rem   /* 12px */
4: 1rem      /* 16px */
5: 1.25rem   /* 20px */
6: 1.5rem    /* 24px */
8: 2rem      /* 32px */
10: 2.5rem   /* 40px */
12: 3rem     /* 48px */
16: 4rem     /* 64px */
20: 5rem     /* 80px */
24: 6rem     /* 96px */
32: 8rem     /* 128px */
```

### Component Spacing

```css
/* Padding */
.card-padding: p-6          /* 24px */
.section-padding: py-16     /* 64px vertical */
.container-padding: px-4    /* 16px on mobile */

/* Margins */
.section-margin: my-12      /* 48px vertical */
.element-margin: mb-4       /* 16px bottom */

/* Gaps */
.grid-gap: gap-6           /* 24px */
.flex-gap: gap-4           /* 16px */
```

---

## Border Radius

```css
--radius-none: 0
--radius-sm: 0.125rem    /* 2px */
--radius-default: 0.25rem /* 4px */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-3xl: 1.5rem     /* 24px */
--radius-full: 9999px    /* Circular */
```

### Usage

```css
/* Cards */
.card {
  border-radius: 1rem; /* radius-2xl */
}

/* Buttons */
.button {
  border-radius: 0.5rem; /* radius-lg */
}

/* Inputs */
.input {
  border-radius: 0.375rem; /* radius-md */
}

/* Pills/Badges */
.badge {
  border-radius: 9999px; /* radius-full */
}
```

---

## Shadows

### Shadow Levels

```css
/* Small - Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Default - Standard elevation */
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
          0 1px 2px 0 rgba(0, 0, 0, 0.06)

/* Medium - Card elevation */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Large - Modal/Drawer */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Extra Large - Popover */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* 2X Large - Dialog */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Glass Shadow

```css
.glass-shadow {
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
}
```

---

## Animations

### Keyframe Animations

```css
/* Float Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Glow Animation */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 204, 41, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 204, 41, 0.8); }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Scroll Animation (Carousel) */
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll {
  animation: scroll 25s linear infinite;
}

/* Pulse Slow */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Transition Timings

```css
/* Duration */
--duration-75: 75ms
--duration-100: 100ms
--duration-150: 150ms
--duration-200: 200ms
--duration-300: 300ms
--duration-500: 500ms
--duration-700: 700ms
--duration-1000: 1000ms

/* Easing Functions */
--ease-linear: linear
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Component Transitions

```css
/* Hover Transitions */
.button {
  transition: all 0.3s ease-in-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Page Transitions */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-out;
}
```

---

## Component Styles

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #FFCC29 0%, #FFB700 100%);
  color: #0D1B2A;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 204, 41, 0.4);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #FFCC29;
  font-weight: 600;
  padding: 0.875rem 1.875rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 204, 41, 0.1);
  border-color: #FFD84D;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #FFCC29;
  border: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(255, 204, 41, 0.1);
}
```

### Cards

```css
/* Glass Card */
.card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* Solid Card */
.card-solid {
  background: #0D1B2A;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 204, 41, 0.1);
}

/* Hover Effect */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 204, 41, 0.3);
}
```

### Inputs

```css
/* Text Input */
.input-text {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: #FFFFFF;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input-text:focus {
  outline: none;
  border-color: #FFCC29;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(255, 204, 41, 0.1);
}

.input-text::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Input Error State */
.input-error {
  border-color: #F44336;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}
```

### Badges

```css
/* Status Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-scheduled {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.badge-live {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
  animation: pulse-slow 2s infinite;
}

.badge-completed {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}
```

### Progress Bars

```css
/* Progress Container */
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}

/* Progress Fill */
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFCC29 0%, #FFB700 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Animated Progress */
.progress-animated {
  background: linear-gradient(
    90deg,
    #FFCC29 0%,
    #FFD84D 50%,
    #FFCC29 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Gradients

### Background Gradients

```css
/* Primary Gradient */
.gradient-primary {
  background: linear-gradient(135deg, #001C40 0%, #002B5C 100%);
}

/* Gold Gradient */
.gradient-gold {
  background: linear-gradient(135deg, #FFCC29 0%, #FFB700 100%);
}

/* Glass Gradient */
.gradient-glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}

/* Overlay Gradient */
.gradient-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
```

### Text Gradients

```css
.text-gradient {
  background: linear-gradient(135deg, #FFCC29 0%, #FFB700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Responsive Breakpoints

```css
/* Extra Small Devices (phones, 360px and up) */
@media (min-width: 360px) { /* xs */ }

/* Small Devices (phones, 640px and up) */
@media (min-width: 640px) { /* sm */ }

/* Medium Devices (tablets, 768px and up) */
@media (min-width: 768px) { /* md */ }

/* Large Devices (desktops, 1024px and up) */
@media (min-width: 1024px) { /* lg */ }

/* Extra Large Devices (large desktops, 1280px and up) */
@media (min-width: 1280px) { /* xl */ }

/* 2X Large Devices (larger desktops, 1536px and up) */
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Custom Scrollbar

**File**: [`src/styles/scrollbar.css`](../src/styles/scrollbar.css)

```css
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0D1B2A;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FFCC29 0%, #FFB700 100%);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #FFD84D;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #FFCC29 #0D1B2A;
}
```

---

## Accessibility

### Focus States

```css
/* Keyboard Focus Indicator */
*:focus-visible {
  outline: 2px solid #FFCC29;
  outline-offset: 2px;
}

/* Custom Focus Rings */
.focus-ring {
  transition: box-shadow 0.2s ease;
}

.focus-ring:focus {
  box-shadow: 0 0 0 3px rgba(255, 204, 41, 0.3);
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Print Styles

```css
@media print {
  * {
    background: white !important;
    color: black !important;
  }
  
  .no-print {
    display: none !important;
  }
  
  a[href]:after {
    content: " (" attr(href) ")";
  }
}
```

---

*Complete design system reference for ICCT26 application*
