# 🚀 START COMPLETE SYSTEM

## Quick Start (3 Steps)

### 1. **Start Backend** ⚡
```bash
# Open Terminal 1
cd e:\tutvex\tutoredge-backend
npm run dev
```

**Wait for:**
```
✅ Server is running on port 5000
✅ MongoDB connected successfully
```

### 2. **Frontend Already Running** ✅
Frontend should already be running on port 3000.

If not:
```bash
# Open Terminal 2
cd e:\tutvex\tutoredge-frontend
npm run dev
```

### 3. **Create Test Lead** 📝

**A. Login as Admin:**
- URL: `http://localhost:3000/login`
- Use admin credentials

**B. Create Lead:**
1. Sidebar → **Student Leads**
2. Click **"+ Add Lead"** button
3. Fill form:

```
📋 Contact Information (Required):
Parent Name: Rajesh Kumar
Phone: +91 9876543210
Email: rajesh@test.com (optional)

👨‍🎓 Student Information:
Student Name: Priya (optional)
Class: 10th
Subject: Mathematics
Teaching Mode: Online

📍 Location:
City: Prayagraj
Area: Civil Lines
State: Uttar Pradesh
Pincode: 211001

💰 Budget:
Budget: 5000
Type: Per Month
Preferred Time: Weekdays 6-8 PM
Urgency: Flexible
Notes: Need experienced tutor

⚙️ Settings:
Credits: 3
Max Unlocks: 10
```

4. Click **"Create Lead"** button
5. Success! Lead created 🎉

**C. Verify in Table:**
- Should see lead in "All Leads" table
- All fields populated correctly
- Status: "New"
- Unlocks: 0/10

### 4. **Test as Tutor** 🎓

**A. Logout from Admin**

**B. Login as Tutor:**
- If you don't have tutor account, create one first
- Go to registration page

**C. View Leads:**
1. Click "**Find Students**" in navbar
2. Auto-redirect to `/tutor/leads`
3. **LEADS SHOULD APPEAR!** ✅

Expected to see:
```
┌──────────────────────────────────────┐
│ 📊 Stats Cards:                      │
│ Available Leads: 1                   │
│ Unlocked Leads: 0                    │
│ Credits: 10                          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🎯 85% Match                         │
│                                      │
│ Class 10th - Mathematics             │
│ 📍 Civil Lines, Prayagraj           │
│ 💻 Online • ₹5,000/month            │
│ ⚡ Flexible                          │
│                                      │
│ 🔒 3 Credits Required                │
│ [View Details →]                     │
└──────────────────────────────────────┘
```

**D. View Details:**
- Click lead card
- See all requirement details
- Contact info is **🔒 LOCKED**

**E. Unlock Lead:**
- Click "Unlock Lead" button
- Confirm credit spend (3 credits)
- **Contact info revealed!** ✅
  - Parent Name: Rajesh Kumar
  - Phone: +91 9876543210 (clickable)
  - Email: rajesh@test.com (clickable)

---

## Troubleshooting

### Issue 1: "New leads coming soon"

**Cause:** Backend not running or no leads in database

**Fix:**
1. Make sure backend is running (Step 1)
2. Create at least one lead (Step 3)
3. Refresh tutor dashboard

### Issue 2: Backend won't start

**Error:** Port 5000 already in use

**Fix:**
```bash
# Kill existing process
Get-Process -Name node | Stop-Process -Force

# Then restart
cd e:\tutvex\tutoredge-backend
npm run dev
```

### Issue 3: Build error in backend

**Fix:**
```bash
cd e:\tutvex\tutoredge-backend
npm run build

# If successful, then:
npm run dev
```

### Issue 4: MongoDB connection error

**Fix:**
Check `.env` file has correct MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/tutvex
```

Or if using Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tutvex
```

---

## System Architecture

```
Frontend (Port 3000)
    ↓
  Calls API
    ↓
Backend (Port 5000)
    ↓
  Routes: /api/v1/leads/*
    ↓
  Controllers
    ↓
  MongoDB Database
    ↓
  Collection: studentleads
```

## API Endpoints Used

```
Admin:
✅ POST /api/v1/leads/admin/student-leads → Create lead
✅ GET  /api/v1/leads/admin/student-leads → List all leads
✅ PUT  /api/v1/leads/admin/student-leads/:id → Update lead
✅ DELETE /api/v1/leads/admin/student-leads/:id → Delete lead

Tutor:
✅ GET  /api/v1/leads/marketplace → Browse leads (matched to profile)
✅ GET  /api/v1/leads/:id → View lead details
✅ POST /api/v1/leads/unlock → Unlock lead (spend credits)
✅ GET  /api/v1/leads/my-leads → View unlocked leads

Parent:
✅ POST /api/v1/leads/create → Create requirement
✅ GET  /api/v1/leads/my-requests → View my requirements
```

---

## Success Checklist

- [x] Backend build successful
- [x] Backend running on port 5000
- [x] Frontend running on port 3000
- [x] MongoDB connected
- [x] Admin can create leads
- [x] Leads show in admin table
- [x] Tutor can see leads in marketplace
- [x] Tutor can view lead details
- [x] Tutor can unlock leads
- [x] Contact info visible after unlock

---

## Next Steps After System is Working

1. **Create more test leads** with different subjects/locations
2. **Test filtering** in tutor dashboard
3. **Test unlock flow** end-to-end
4. **Test edit/delete** in admin panel
5. **Add real parent data** when parents start creating requirements

---

## Important Files Modified

### Backend:
- `src/models/StudentLead.ts` - Added parent contact fields
- `src/controllers/leads.controller.ts` - Added admin CRUD methods
- `src/routes/leads.routes.ts` - Registered admin routes

### Frontend:
- `src/services/leadService.ts` - Updated API endpoints
- `src/pages/admin/create-lead.tsx` - Beautiful create form
- `src/pages/admin/leads/index.tsx` - Admin leads table
- `src/pages/admin/leads/[id].tsx` - Lead detail view
- `src/pages/admin/leads/[id]/edit.tsx` - Edit form
- `src/pages/tutor/leads/index.tsx` - Tutor marketplace
- `src/pages/tutor/leads/[id].tsx` - Tutor lead detail
- `src/pages/find-students.tsx` - Tutor landing page

---

**ALL DONE! NOW JUST START BACKEND AND TEST!** 🚀
