# Contact Access Debugging Guide

## Issue
Contact access request fail ho raha hai.

## Debugging Steps

### 1. Browser Console Check
Open browser console (F12) and check for:
- ✅ `Requesting contact access for leadId: ...` 
- ✅ `Full unlock object: ...`
- ❌ Any errors?

### 2. Network Tab Check
Open Network tab and look for:
- Request: `POST /leads/{leadId}/request-contact-access`
- Status: Should be 200
- Response: Check error message if 400/500

### 3. Backend Console Check
Backend terminal should show:
```
🔵 Contact Access Request: { tutorId: '...', leadId: '...' }
🔵 requestContactAccess called: { leadId: '...', tutorId: '...' }
🔍 Unlock found: YES
✅ Contact access marked as requested
✅ Contact access requested successfully: ...
```

## Common Errors & Solutions

### Error 1: "Lead not unlocked"
**Cause:** Unlock record not found in database

**Check:**
```javascript
// In browser console on My Leads page
console.log("Unlocked leads:", leads);
// Each lead should have unlock._id
```

**Solution:**
- Verify lead was actually unlocked (check LeadUnlock collection)
- Verify leadId matches StudentLead._id
- Verify tutorId matches current user

### Error 2: "Invalid lead ID"
**Cause:** leadId extraction failed

**Check:**
```javascript
// In handleRequestContactAccess
console.log("unlock.leadId type:", typeof unlock.leadId);
console.log("unlock.leadId:", unlock.leadId);
```

**Solution:**
Update extraction logic if leadId structure is different:
```typescript
// Option 1: String ID
if (typeof unlock.leadId === 'string') {
  leadId = unlock.leadId;
}

// Option 2: Populated object
if (unlock.leadId._id) {
  leadId = unlock.leadId._id;
}

// Option 3: MongoDB ObjectId
if (unlock.leadId.toString) {
  leadId = unlock.leadId.toString();
}
```

### Error 3: "Contact access request already pending"
**Cause:** Already requested before

**Check Database:**
```javascript
db.leadunlocks.find({
  tutorId: ObjectId("..."),
  contactAccessRequested: true,
  contactAccessGranted: false
})
```

**Solution:**
- This is expected behavior
- Wait for admin approval OR
- Reset in database if testing:
```javascript
db.leadunlocks.updateOne(
  { _id: ObjectId("...") },
  { $set: { contactAccessRequested: false } }
)
```

### Error 4: Network error / 404
**Cause:** Route not registered or backend not running

**Check:**
1. Backend is running: `http://localhost:3001`
2. Route exists: Check `leads.routes.ts`
3. Auth token is valid

**Test with curl:**
```bash
curl -X POST http://localhost:3001/leads/{leadId}/request-contact-access \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Manual Testing Script

### Step 1: Unlock a Lead
```javascript
// POST /leads/unlock
{
  "leadId": "67890..." // from marketplace
}
```

### Step 2: Check My Leads
```javascript
// GET /leads/my-leads
// Should return unlocked leads with leadId populated
```

### Step 3: Request Contact Access
```javascript
// POST /leads/{leadId}/request-contact-access
// leadId should be from StudentLead._id
```

### Step 4: Verify in Database
```javascript
db.leadunlocks.findOne({
  tutorId: ObjectId("..."),
  leadId: ObjectId("...")
})

// Should have:
// contactAccessRequested: true
// contactAccessRequestedAt: ISODate("...")
```

## Database Schema Verification

### LeadUnlock Collection
```javascript
{
  _id: ObjectId,
  leadId: ObjectId (ref: StudentLead),
  tutorId: ObjectId (ref: User),
  status: "new",
  creditsUsed: 1,
  unlockedAt: ISODate,
  // New fields:
  contactAccessRequested: false,      // ← Should exist
  contactAccessRequestedAt: null,
  contactAccessGranted: false,
  contactAccessGrantedAt: null,
  contactAccessGrantedBy: null,
  contactAccessNotes: ""
}
```

### Migration Check
If fields are missing, run migration:
```javascript
db.leadunlocks.updateMany(
  { contactAccessRequested: { $exists: false } },
  {
    $set: {
      contactAccessRequested: false,
      contactAccessGranted: false
    }
  }
)
```

## Quick Fix Commands

### Reset Contact Access (for testing)
```javascript
// MongoDB
db.leadunlocks.updateMany(
  { tutorId: ObjectId("YOUR_TUTOR_ID") },
  {
    $set: {
      contactAccessRequested: false,
      contactAccessGranted: false,
      contactAccessRequestedAt: null,
      contactAccessGrantedAt: null
    }
  }
)
```

### Grant Access Manually (for testing)
```javascript
db.leadunlocks.updateOne(
  { 
    tutorId: ObjectId("TUTOR_ID"),
    leadId: ObjectId("LEAD_ID")
  },
  {
    $set: {
      contactAccessRequested: true,
      contactAccessGranted: true,
      contactAccessGrantedAt: new Date(),
      contactAccessNotes: "Manual grant for testing"
    }
  }
)
```

## Frontend Debug Mode

Add this to My Leads page temporarily:
```typescript
useEffect(() => {
  console.log("=== MY LEADS DEBUG ===");
  console.log("Total leads:", leads.length);
  leads.forEach((unlock, i) => {
    console.log(`Lead ${i + 1}:`, {
      unlockId: unlock._id,
      leadId: unlock.leadId,
      leadIdType: typeof unlock.leadId,
      hasAccess: unlock.contactAccessGranted,
      requested: unlock.contactAccessRequested
    });
  });
}, [leads]);
```

## Admin Panel Testing

### Access Admin Page
```
http://localhost:3000/admin/leads/contact-access-requests
```

### Expected:
- List of pending requests
- Tutor details
- Lead details
- Approve/Reject buttons

### Test Approval:
1. Click "Approve Access"
2. Check backend logs
3. Verify in database
4. Refresh tutor My Leads page
5. Contact should be visible

## Still Not Working?

1. **Check Backend Logs:**
   - Any errors in terminal?
   - Are logs showing up?

2. **Check Frontend Console:**
   - Any JavaScript errors?
   - Network request successful?

3. **Check Database:**
   - LeadUnlock record exists?
   - Fields present?

4. **Restart Everything:**
   ```bash
   # Backend
   cd tutoredge-backend
   npm run dev
   
   # Frontend
   cd tutoredge-frontend
   npm run dev
   ```

5. **Clear Cache:**
   - Browser: Ctrl+Shift+R
   - API cache: Restart backend

6. **Contact Me:**
   Share:
   - Browser console screenshot
   - Network tab error
   - Backend terminal logs
   - Database record screenshot
