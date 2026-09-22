# 🔍 DEBUG: "New leads coming soon" Issue

## Problem
Tutor dashboard shows "New leads coming soon" instead of actual student leads.

## Root Causes & Solutions

### 1. **Backend Not Running** ⚠️ (Most Likely)

**Check:**
```bash
# Check if backend is running
# You should see it running on port 5000
```

**Solution:**
```bash
cd e:\tutvex\tutoredge-backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Database connected successfully
```

---

### 2. **No Leads Created Yet** 📝

**Check:**
- Login as admin → Student Leads
- Is table empty?

**Solution:**
Create test leads:
1. Admin login
2. Go to **Student Leads** → **+ Add Lead**
3. Fill form with test data:
   - Parent Name: `Test Parent`
   - Phone: `+91 9876543210`
   - Class: `10th`
   - Subject: `Mathematics`
   - Budget: `5000`
   - City: `Prayagraj`
4. Click **Create Lead**

---

### 3. **Database Connection Issue** 🗄️

**Check `.env` file:**
```env
# tutoredge-backend/.env
MONGODB_URI=mongodb://localhost:27017/tutvex
# OR
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tutvex
```

**Solution:**
- Make sure MongoDB is running
- Check connection string is correct
- Verify database name matches

---

### 4. **API Route Mismatch** 🔗

**Check:**
Backend routes should be:
```
✅ POST /api/v1/leads/admin/student-leads (Create)
✅ GET /api/v1/leads/admin/student-leads (List all for admin)
✅ GET /api/v1/leads/marketplace (List for tutors)
```

**Verify in backend terminal:**
Look for route registration logs when server starts.

---

### 5. **Tutor Not Logged In** 🔐

**Check:**
- Is tutor actually logged in?
- Check browser console for auth errors

**Solution:**
1. Login as tutor
2. Go to `/find-students`
3. Should auto-redirect to `/tutor/leads`

---

## Step-by-Step Testing

### Step 1: Verify Backend is Running
```bash
cd e:\tutvex\tutoredge-backend
npm run dev
```

**Look for:**
```
✅ Server running on port 5000
✅ MongoDB connected
✅ Routes registered: /api/v1/leads
```

### Step 2: Create Test Lead (Admin)
1. Open browser: `http://localhost:3000`
2. Login as admin
3. Sidebar → **Student Leads**
4. Click **+ Add Lead**
5. Fill form:

```
Parent Contact:
- Name: Rajesh Kumar
- Phone: +91 9876543210
- Email: rajesh@test.com

Student Info:
- Name: Priya
- Class: 10th
- Subject: Mathematics
- Mode: Online

Location:
- City: Prayagraj
- Area: Civil Lines

Budget:
- Amount: 5000
- Type: Per Month

Requirements:
- Time: Weekdays 6-8 PM
- Urgency: Flexible
- Notes: Need experienced tutor

Lead Settings:
- Credits: 3
- Max Unlocks: 10
```

6. Click **Create Lead**
7. Verify it appears in "All Leads" table

### Step 3: Check Lead in Database

**Option A: MongoDB Compass**
```
Database: tutvex
Collection: studentleads
```

**Option B: Mongo Shell**
```bash
mongosh
use tutvex
db.studentleads.find().pretty()
```

**Expected Output:**
```json
{
  "_id": ObjectId("..."),
  "parentName": "Rajesh Kumar",
  "parentPhone": "+91 9876543210",
  "studentClass": "10th",
  "subject": "Mathematics",
  "status": "new",
  "budget": 5000,
  "location": {
    "city": "Prayagraj",
    "area": "Civil Lines"
  }
}
```

### Step 4: Test Tutor Can See Leads

1. **Logout from admin**
2. **Login as tutor** (or create new tutor account)
3. Click **"Find Students"** in navbar
4. Auto-redirect to `/tutor/leads`
5. **Should see the leads!**

Expected view:
```
┌─────────────────────────────────────────┐
│  Find Your Next Student                 │
│  Discover tutoring requirements matched │
└─────────────────────────────────────────┘

Stats Cards:
┌──────────┐ ┌──────────┐ ┌──────────┐
│Available │ │Unlocked  │ │Credits   │
│Leads     │ │Leads     │ │          │
│    1     │ │    0     │ │    10    │
└──────────┘ └──────────┘ └──────────┘

Lead Card:
┌────────────────────────────────────────┐
│ 🎯 85% Match                           │
│                                        │
│ Class 10th - Mathematics               │
│ 📍 Civil Lines, Prayagraj             │
│ 💻 Online • ₹5,000/month              │
│ ⚡ Flexible                            │
│                                        │
│ 🔒 3 Credits Required                  │
│ [View Details →]                       │
└────────────────────────────────────────┘
```

---

## Common Errors & Fixes

### Error 1: "Failed to load leads"
**Cause:** Backend not running or API endpoint wrong

**Fix:**
```bash
# 1. Check backend is running
cd e:\tutvex\tutoredge-backend
npm run dev

# 2. Check logs for errors
# Look for port conflicts, MongoDB connection issues
```

### Error 2: Empty Array Returned
**Cause:** No leads in database or query filters too strict

**Fix:**
```javascript
// In tutoredge-backend/src/controllers/leads.controller.ts
// Check getMarketplaceLeads method

async getMarketplaceLeads(req, reply) {
  try {
    const tutorId = (req as any).user.id;
    
    // Temporarily remove all filters to see ALL leads
    const leads = await StudentLead.find({ 
      status: { $in: ["new", "active"] },
      totalUnlocks: { $lt: this.maxUnlocks }
    }).lean();
    
    console.log("📊 Found leads:", leads.length); // Should log count
    
    reply.send({ success: true, data: leads });
  } catch (error) {
    console.error("❌ Error:", error);
    reply.status(500).send({ success: false, message: error.message });
  }
}
```

### Error 3: Authentication Failed
**Cause:** Tutor not properly logged in

**Fix:**
1. Logout completely
2. Clear browser cache/cookies
3. Login again as tutor
4. Check localStorage has token:
   ```javascript
   // Browser console:
   localStorage.getItem('token')
   // Should show JWT token
   ```

### Error 4: 404 Not Found
**Cause:** API route not registered

**Fix:**
Check `tutoredge-backend/src/app.ts`:
```typescript
// Should have this line:
app.register(leadsRoutes, { prefix: "/api/v1/leads" });
```

---

## Quick Test API Endpoints

### Test 1: Health Check
```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health -Method GET
```

### Test 2: Get All Leads (Admin)
Open browser console and run:
```javascript
fetch('http://localhost:5000/api/v1/leads/admin/student-leads', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Admin leads:', d))
```

### Test 3: Get Marketplace Leads (Tutor)
```javascript
fetch('http://localhost:5000/api/v1/leads/marketplace', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Tutor marketplace:', d))
```

---

## Complete System Flow

```
1. Admin creates lead
   ↓
   POST /api/v1/leads/admin/student-leads
   ↓
   Saved to StudentLead collection in MongoDB
   ↓
   status: "new"

2. Lead appears in admin table
   ↓
   GET /api/v1/leads/admin/student-leads
   ↓
   Returns all leads

3. Tutor visits /find-students
   ↓
   Auto-redirect to /tutor/leads
   ↓
   GET /api/v1/leads/marketplace
   ↓
   Backend filters leads:
     - status: new or active
     - totalUnlocks < maxUnlocks
     - not expired
   ↓
   Returns matched leads to tutor

4. Tutor sees lead cards
   ↓
   Can click to view details
   ↓
   Can unlock with credits
```

---

## Checklist Before Asking for Help

- [ ] Backend is running (`npm run dev` in tutoredge-backend)
- [ ] MongoDB is connected (check backend logs)
- [ ] At least one lead created via admin panel
- [ ] Lead status is "new" or "active"
- [ ] Tutor is logged in (check localStorage.token)
- [ ] Browser console shows no errors
- [ ] Checked Network tab in DevTools for API responses

---

## Expected Success

✅ **Admin Panel:**
- Create lead → Success toast
- Lead appears in table with all data
- Can view, edit, delete lead

✅ **Tutor Dashboard:**
- Visit `/find-students` → Auto-redirect to `/tutor/leads`
- See stats cards (Available Leads > 0)
- See lead cards with details
- Can click "View Details"
- Contact info hidden (🔒 locked)

✅ **Unlock Flow:**
- Click lead → View details
- Click "Unlock Lead" button
- Confirm credit spend
- Contact info revealed (phone, email clickable)

---

## Still Not Working?

Run these commands and share output:

```bash
# 1. Check backend status
cd e:\tutvex\tutoredge-backend
npm run dev

# 2. Check MongoDB
mongosh
use tutvex
db.studentleads.countDocuments()

# 3. Check one lead
db.studentleads.findOne()
```

Take screenshot of:
1. Admin "All Leads" table
2. Tutor "/tutor/leads" page
3. Browser console (F12 → Console tab)
4. Network tab (F12 → Network → Filter: leads)
