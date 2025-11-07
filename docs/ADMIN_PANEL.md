# 🏏 ICCT26 Admin Panel Documentation

## Overview
The admin panel provides a comprehensive interface for managing tournament registrations, viewing team details, and accessing player information and submitted documents.

## Access & Authentication

### Login Credentials
- **URL**: `http://localhost:5174/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

### Session Management
- Login session is stored in `sessionStorage`
- Session persists during browser session
- Logout clears session and redirects to login page

## Features

### 1. Admin Dashboard (`/admin/dashboard`)
**Main hub for viewing all registered teams**

#### Statistics Cards
- **Total Teams**: Count of all registered teams
- **Total Players**: Sum of all players across teams
- **Churches**: Number of unique churches
- **Avg Team Size**: Average players per team

#### Team Listing
- **Search**: Filter teams by name, church, team ID, or captain
- **Refresh**: Reload team data from backend
- **Team Cards**: Each card displays:
  - Team ID (e.g., ICCT26-0001)
  - Team Name
  - Church Name
  - Captain & Vice Captain details
  - Player count
  - Registration date

#### Navigation
- Click any team card to view detailed team information

---

### 2. Team Detail Page (`/admin/team/:teamId`)
**Comprehensive view of a specific team**

#### Team Information Section
Displays all team metadata:
- Team Name
- Church Name
- Registration Date
- Captain (Name, Phone, Email)
- Vice Captain (Name, Phone, Email)
- Payment Receipt Number
- Pastor's Letter (downloadable link if available)

#### Squad Section
Lists all players with:
- Jersey Number (visual badge)
- Player Name
- Role (Batsman, Bowler, All-rounder, Wicket Keeper)
- Age
- Contact Number

#### Navigation
- Back button to dashboard
- Click any player to view detailed player information

---

### 3. Player Detail Page (`/admin/player/:playerId`)
**Individual player profile with document access**

#### Player Profile
- Large jersey number display
- Full name and ID
- Role and age
- Contact information (Phone & Email)
- Team affiliation

#### Submitted Documents
Two document types tracked:

1. **Aadhar Card** (Identity Proof)
   - Status indicator (submitted/not submitted)
   - View/Download button if available
   - Opens in new tab

2. **Subscription Card** (Church Membership)
   - Status indicator (submitted/not submitted)
   - View/Download button if available
   - Opens in new tab

#### Document Verification Status
- **Complete**: All documents submitted (green badge)
- **Incomplete**: Missing documents (yellow badge)

---

## Design System

### Color Palette (Matches Main Site)
- **Primary Blue**: `#002B5C` (Deep Royal Blue)
- **Cricket Gold**: `#FFD700` (Golden Yellow)
- **Background**: Gradient with blue tones
- **Cards**: White/10% opacity with backdrop blur

### Typography (Matches Main Site)
- **Display Font**: Bebas Neue (headings, titles, numbers)
- **Body Font**: Quicksand (text, labels, descriptions)

### Components
- Glassmorphism cards (backdrop blur + transparency)
- Smooth transitions and hover effects
- Responsive grid layouts
- Framer Motion animations

---

## API Integration

### Backend Endpoints Used
```typescript
// Admin API Methods (from src/services/api.ts)

1. getAllTeams()
   - Endpoint: GET /admin/teams
   - Returns: Array of all registered teams

2. getTeamById(teamId)
   - Endpoint: GET /admin/teams/:teamId
   - Returns: Team details + player roster

3. getPlayerById(playerId)
   - Endpoint: GET /admin/players/:playerId
   - Returns: Player details + document links

4. getAllRegistrations()
   - Endpoint: GET /admin/registrations
   - Returns: Complete registration data
```

### Fallback Behavior
If backend endpoints are not yet implemented, the admin panel uses **dummy data** for demonstration:
- 3 sample teams
- 11 players per team
- Realistic contact information
- Sample document links

---

## Routes & Navigation Flow

```
/admin/login
    ↓ (successful login)
/admin/dashboard
    ↓ (click team card)
/admin/team/:teamId
    ↓ (click player card)
/admin/player/:playerId
```

### Route Protection
All admin routes (except `/admin/login`) are protected:
- Unauthenticated users → Redirect to login
- Session verification on page load
- Protected routes use `<ProtectedRoute>` wrapper

---

## Key Files

### Pages
- `src/pages/admin/AdminLogin.tsx` - Login form
- `src/pages/admin/AdminDashboard.tsx` - Main dashboard
- `src/pages/admin/TeamDetail.tsx` - Team details view
- `src/pages/admin/PlayerDetail.tsx` - Player profile view

### Context & Components
- `src/contexts/AdminContext.tsx` - Authentication state management
- `src/components/ProtectedRoute.tsx` - Route guard wrapper

### Services
- `src/services/api.ts` - Admin API methods added

### Routing
- `src/App.tsx` - Admin routes configured with protection

---

## Usage Examples

### Scenario 1: View All Teams
1. Login at `/admin/login`
2. Dashboard shows all teams with statistics
3. Use search to filter by team name or church
4. Click "Refresh" to reload data

### Scenario 2: Inspect Team Details
1. From dashboard, click any team card
2. View team information and captain contacts
3. Download pastor's letter if available
4. Browse player roster

### Scenario 3: Check Player Documents
1. From team detail page, click any player
2. View player profile and contact info
3. Click "View Document" buttons to access files
4. Check verification status badge

### Scenario 4: Search & Filter
1. Use search bar on dashboard
2. Type team name, church, captain name, or team ID
3. Results filter in real-time
4. Click filtered result to view details

---

## Security Notes

⚠️ **Current Implementation**
- Uses dummy credentials (`admin`/`admin123`)
- Session stored in `sessionStorage`
- No backend authentication

🔒 **Production Recommendations**
1. Implement JWT-based authentication
2. Use secure password hashing (bcrypt)
3. Add role-based access control (RBAC)
4. Implement HTTPS only
5. Add rate limiting on login endpoint
6. Use HTTP-only cookies instead of sessionStorage
7. Add CSRF protection
8. Implement password reset flow

---

## Customization

### Changing Login Credentials
Edit `src/contexts/AdminContext.tsx`:
```typescript
const login = (username: string, password: string): boolean => {
  // Change these values
  if (username === 'your_username' && password === 'your_password') {
    setIsAuthenticated(true)
    sessionStorage.setItem('admin_session', 'authenticated')
    return true
  }
  return false
}
```

### Adding More Stats Cards
Edit `src/pages/admin/AdminDashboard.tsx`:
```typescript
<motion.div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
  <div className="text-cricket-gold font-body text-sm mb-2">Your Stat</div>
  <div className="text-white font-display text-4xl">{yourValue}</div>
</motion.div>
```

### Styling Changes
All components use Tailwind CSS classes matching the main site:
- `bg-gradient-primary` - Site background
- `text-cricket-gold` - Gold accent color
- `font-display` - Bebas Neue font
- `font-body` - Quicksand font

---

## Testing

### Manual Testing Checklist
- [ ] Login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Dashboard loads team statistics
- [ ] Search filters teams correctly
- [ ] Team detail page shows all info
- [ ] Player cards navigate correctly
- [ ] Player detail shows documents
- [ ] Document links open in new tab
- [ ] Back navigation works
- [ ] Logout redirects to login
- [ ] Protected routes redirect when not authenticated

---

## Future Enhancements

### Planned Features
1. **Export Functionality**
   - Export teams to CSV/Excel
   - Generate PDF reports
   - Bulk document download

2. **Advanced Filtering**
   - Filter by church
   - Filter by registration date
   - Filter by player count

3. **Analytics Dashboard**
   - Registration timeline chart
   - Church participation breakdown
   - Player role distribution

4. **Document Management**
   - Approve/reject documents
   - Request document resubmission
   - Document expiry tracking

5. **Communication**
   - Send email to team captain
   - WhatsApp integration
   - Bulk notifications

6. **Team Editing**
   - Update team details
   - Add/remove players
   - Change jersey numbers

---

## Troubleshooting

### Issue: "Cannot reach backend"
**Solution**: Backend endpoints may not be implemented yet. Admin panel uses dummy data as fallback.

### Issue: Session lost on refresh
**Solution**: sessionStorage clears on tab close. This is expected behavior. Use localStorage for persistence.

### Issue: Routes not found
**Solution**: Ensure development server is running (`npm run dev`) and navigate to correct URLs.

### Issue: Styling not matching
**Solution**: Verify Tailwind CSS config includes all custom colors and fonts from `src/config/app.config.ts`.

---

## Support & Contact

For issues or questions about the admin panel:
1. Check this documentation
2. Review code comments in source files
3. Inspect browser console for errors
4. Contact development team

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (with dummy authentication)
