/**
 * Application Configuration
 * Global settings and constants for the entire application
 */

import type { AppConfig } from '../types'

/**
 * Main Application Configuration
 */
export const APP_CONFIG: AppConfig = {
  tournamentName: 'ICCT26',
  tournamentYear: 2026,
  countdownTargetDate: '2026-01-24T00:00:00',
  registrationFee: 2000,
  upiId: 'icct26@upi',
  contactEmail: 'contact@icct26.org',
  socialMedia: {
    instagram: 'https://instagram.com/icct26',
    facebook: 'https://facebook.com/icct26',
    youtube: 'https://youtube.com/@icct26',
    whatsapp: '+919876543210',
  },
}

/**
 * Color Palette Configuration
 */
export const COLOR_PALETTE = {
  primary: '#002B5C', // Deep Royal Blue
  secondary: '#0D1B2A', // Midnight Navy
  accent: '#FFCC29', // Bright Gold
  bgStart: '#0A0E27',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
}

/**
 * Typography Configuration
 */
export const TYPOGRAPHY = {
  fontFamily: {
    heading: 'Poppins, sans-serif',
    subheading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
}

/**
 * Routes Configuration
 */
export const ROUTES = {
  home: '/',
  schedule: '/schedule',
  registration: '/registration',
  rules: '/rules',
  contact: '/contact',
}

/**
 * Animation Configuration
 */
export const ANIMATIONS = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  delay: {
    small: 0.1,
    medium: 0.2,
    large: 0.3,
  },
}

/**
 * API Configuration (for future use)
 */
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'https://api.icct26.org',
  timeout: 30000,
  retries: 3,
}

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  enableRegistration: true,
  enableLiveScore: false,
  enableGallery: false,
  enableTeamLeaderboard: false,
}

/**
 * Get configuration value by key
 */
export const getConfigValue = <T extends keyof AppConfig>(key: T): AppConfig[T] => {
  return APP_CONFIG[key]
}

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature]
}
