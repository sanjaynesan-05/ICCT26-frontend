# Backend Legacy Data Sanitization Guide

## Overview
This document provides the backend changes needed to handle legacy/incomplete file data and support partial file updates in the ICCT26 tournament system.

## ✅ Frontend Status (COMPLETED)
The frontend now includes:
- `cleanFileUrl()` helper in all admin components
- Filters out: `null`, empty objects `{}`, local file paths, data URIs
- Only accepts valid `http://` or `https://` URLs (Cloudinary)
- Gracefully displays "No File" for missing/invalid data
- `updateTeamMultipart()` and `updatePlayerMultipart()` API methods ready

---

## 🔧 Required Backend Changes

### 1. Add File URL Sanitization Helper

Add this utility function to your backend (e.g., `utils/fileHelpers.js` or similar):

```javascript
/**
 * Sanitize file URL to handle legacy data
 * Returns empty string for null, undefined, objects, or local paths
 */
const cleanFileUrl = (url) => {
  // Handle null, undefined, empty string
  if (!url || typeof url !== 'string' || url.trim() === '') return ''
  
  // Filter out objects that may have been stored incorrectly
  if (typeof url === 'object') return ''
  
  // Filter out local file paths
  if (url.startsWith('data:') || url.startsWith('file:') || 
      url.startsWith('C:') || url.startsWith('/') || url.startsWith('\\')) {
    return ''
  }
  
  // Only accept valid HTTP/HTTPS URLs (Cloudinary)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return ''
  }
  
  return url.trim()
}

module.exports = { cleanFileUrl }
```

---

### 2. Update GET /api/teams Route

Apply sanitization when returning team data:

```javascript
const { cleanFileUrl } = require('./utils/fileHelpers')

// GET /api/teams - Get all teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await Team.find()
    
    // Sanitize file URLs in response
    const sanitizedTeams = teams.map(team => {
      const teamData = team._doc || team
      return {
        ...teamData,
        paymentReceipt: cleanFileUrl(teamData.paymentReceipt),
        pastorLetter: cleanFileUrl(teamData.pastorLetter),
        groupPhoto: cleanFileUrl(teamData.groupPhoto),
      }
    })
    
    res.json({ success: true, teams: sanitizedTeams })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
```

---

### 3. Update GET /api/teams/:id Route

Apply sanitization to individual team details:

```javascript
// GET /api/teams/:id - Get team by ID
router.get('/teams/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params
    const team = await Team.findOne({ teamId })
    
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' })
    }
    
    const players = await Player.find({ teamId })
    
    // Sanitize team files
    const sanitizedTeam = {
      ...(team._doc || team),
      paymentReceipt: cleanFileUrl(team.paymentReceipt),
      pastorLetter: cleanFileUrl(team.pastorLetter),
      groupPhoto: cleanFileUrl(team.groupPhoto),
    }
    
    // Sanitize player files
    const sanitizedPlayers = players.map(player => {
      const playerData = player._doc || player
      return {
        ...playerData,
        aadharFile: cleanFileUrl(playerData.aadharFile),
        subscriptionFile: cleanFileUrl(playerData.subscriptionFile),
      }
    })
    
    res.json({ 
      success: true, 
      team: sanitizedTeam, 
      players: sanitizedPlayers 
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
```

---

### 4. Add Partial File Update Support (PUT /api/teams/:id)

Support editing teams with optional file updates:

```javascript
// PUT /api/teams/:id - Update team (with partial file updates)
router.put('/teams/:teamId', upload.fields([
  { name: 'payment_receipt', maxCount: 1 },
  { name: 'pastor_letter', maxCount: 1 },
  { name: 'group_photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const { teamId } = req.params
    const team = await Team.findOne({ teamId })
    
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' })
    }
    
    const updateData = {}
    
    // Update text fields if provided
    if (req.body.team_name) updateData.teamName = req.body.team_name
    if (req.body.church_name) updateData.churchName = req.body.church_name
    // ... other fields
    
    // Handle file updates (only if new file provided)
    if (req.files?.payment_receipt) {
      const result = await cloudinary.uploader.upload(req.files.payment_receipt[0].path, {
        folder: 'icct26/receipts'
      })
      updateData.paymentReceipt = result.secure_url
      
      // Optional: Delete old file from Cloudinary
      if (team.paymentReceipt) {
        const publicId = extractPublicId(team.paymentReceipt)
        await cloudinary.uploader.destroy(publicId)
      }
    }
    
    if (req.files?.pastor_letter) {
      const result = await cloudinary.uploader.upload(req.files.pastor_letter[0].path, {
        folder: 'icct26/letters'
      })
      updateData.pastorLetter = result.secure_url
      
      if (team.pastorLetter) {
        const publicId = extractPublicId(team.pastorLetter)
        await cloudinary.uploader.destroy(publicId)
      }
    }
    
    if (req.files?.group_photo) {
      const result = await cloudinary.uploader.upload(req.files.group_photo[0].path, {
        folder: 'icct26/photos'
      })
      updateData.groupPhoto = result.secure_url
      
      if (team.groupPhoto) {
        const publicId = extractPublicId(team.groupPhoto)
        await cloudinary.uploader.destroy(publicId)
      }
    }
    
    // Update team in database
    await Team.updateOne({ teamId }, { $set: updateData })
    
    const updatedTeam = await Team.findOne({ teamId })
    
    res.json({ 
      success: true, 
      message: 'Team updated successfully',
      team: updatedTeam 
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
```

---

### 5. Add Cloudinary Public ID Extractor

Helper function to extract public_id from Cloudinary URL for deletion:

```javascript
/**
 * Extract Cloudinary public_id from secure_url
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/icct26/receipts/abc123.jpg
 * Returns: icct26/receipts/abc123
 */
const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') return null
  
  try {
    const parts = cloudinaryUrl.split('/')
    const uploadIndex = parts.indexOf('upload')
    
    if (uploadIndex === -1) return null
    
    // Get everything after upload/v{timestamp}/
    const pathParts = parts.slice(uploadIndex + 2)
    const fullPath = pathParts.join('/')
    
    // Remove file extension
    return fullPath.replace(/\.[^/.]+$/, '')
  } catch (error) {
    console.error('Error extracting public_id:', error)
    return null
  }
}

module.exports = { cleanFileUrl, extractPublicId }
```

---

### 6. Add Player Update Route (PUT /api/players/:id)

Similar pattern for updating individual players:

```javascript
// PUT /api/players/:id - Update player (with partial file updates)
router.put('/players/:playerId', upload.fields([
  { name: 'aadhar_file', maxCount: 1 },
  { name: 'subscription_file', maxCount: 1 }
]), async (req, res) => {
  try {
    const { playerId } = req.params
    const player = await Player.findOne({ playerId })
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' })
    }
    
    const updateData = {}
    
    // Update text fields if provided
    if (req.body.name) updateData.name = req.body.name
    if (req.body.role) updateData.role = req.body.role
    
    // Handle file updates (only if new file provided)
    if (req.files?.aadhar_file) {
      const result = await cloudinary.uploader.upload(req.files.aadhar_file[0].path, {
        folder: 'icct26/aadhar'
      })
      updateData.aadharFile = result.secure_url
      
      if (player.aadharFile) {
        const publicId = extractPublicId(player.aadharFile)
        await cloudinary.uploader.destroy(publicId)
      }
    }
    
    if (req.files?.subscription_file) {
      const result = await cloudinary.uploader.upload(req.files.subscription_file[0].path, {
        folder: 'icct26/subscriptions'
      })
      updateData.subscriptionFile = result.secure_url
      
      if (player.subscriptionFile) {
        const publicId = extractPublicId(player.subscriptionFile)
        await cloudinary.uploader.destroy(publicId)
      }
    }
    
    // Update player in database
    await Player.updateOne({ playerId }, { $set: updateData })
    
    const updatedPlayer = await Player.findOne({ playerId })
    
    res.json({ 
      success: true, 
      message: 'Player updated successfully',
      player: updatedPlayer 
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
```

---

## 📋 Test Scenarios

After implementing these changes, test:

### ✅ Legacy Data Handling
- [ ] Old team with `null` files → displays "No File" in admin panel
- [ ] Old team with `{}` objects → displays "No File"
- [ ] Old team with local paths (`C:\uploads\...`) → displays "No File"
- [ ] Old team with data URIs (`data:image/...`) → displays "No File"
- [ ] New team with Cloudinary URLs → displays thumbnails/previews correctly

### ✅ Partial File Updates
- [ ] Edit team, update only payment receipt → other files unchanged
- [ ] Edit team, update all files → all files replaced with new Cloudinary URLs
- [ ] Edit team, update no files → all original URLs preserved
- [ ] Edit player, update only aadhar → subscription unchanged
- [ ] Old Cloudinary files deleted when replaced (if cleanup enabled)

### ✅ API Response Validation
- [ ] GET /api/teams returns sanitized file URLs
- [ ] GET /api/teams/:id returns sanitized team and player files
- [ ] PUT /api/teams/:id accepts multipart/form-data
- [ ] PUT /api/players/:id accepts multipart/form-data
- [ ] No crashes on malformed/legacy data

---

## 🎯 Summary

**Frontend Changes (✅ COMPLETED):**
- Added `cleanFileUrl()` sanitization in AdminDashboard, TeamDetail, PlayerDetail
- Added `updateTeamMultipart()` and `updatePlayerMultipart()` API methods
- Displays "No File" for missing/invalid URLs
- Image thumbnails for valid Cloudinary URLs

**Backend Changes (📝 TO BE IMPLEMENTED):**
1. Add `cleanFileUrl()` utility function
2. Sanitize file URLs in GET /api/teams response
3. Sanitize file URLs in GET /api/teams/:id response
4. Add PUT /api/teams/:id route with partial file update support
5. Add PUT /api/players/:id route with partial file update support
6. Add `extractPublicId()` helper for Cloudinary cleanup (optional)
7. Implement old file deletion when new file uploaded (optional)

**Key Benefits:**
- Backward compatible with legacy data
- Graceful degradation for missing files
- Support for editing teams without re-uploading all files
- Clean separation: only valid Cloudinary URLs displayed
- No frontend crashes from malformed backend data
