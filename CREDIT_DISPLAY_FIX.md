# Credit Display Fix - Dashboard Issue Resolution

## Problem
Dashboard me credit properly fetch nahi ho raha tha. Screen pe "0 available" dikha raha tha jabki database me 2 credits available the.

## Root Cause Analysis

### Issue 1: Backend API Response Structure
`/wallet/summary` endpoint (`getEarningsSummary` function) me credit fields properly return nahi ho rahe the:

**Before (Incorrect):**
```typescript
credits: {
  available: creditWallet.availableCredits,  // Wrong key name
  used: creditWallet.usedCredits,             // Wrong key name
  totalEarned: creditWallet.totalEarned,
  totalPurchased: creditWallet.totalPurchased,
  // Missing: freeCreditsAvailable, freeCreditsTotal, purchasedCreditsAvailable
}
```

**After (Fixed):**
```typescript
credits: {
  availableCredits: creditWallet.availableCredits,              // ✅ Correct
  usedCredits: creditWallet.usedCredits,                        // ✅ Correct
  totalEarned: creditWallet.totalEarned,
  totalPurchased: creditWallet.totalPurchased,
  freeCreditsAvailable: creditWallet.freeCreditsAvailable || 0,  // ✅ Added
  freeCreditsTotal: creditWallet.freeCreditsTotal || 3,          // ✅ Added
  purchasedCreditsAvailable: creditWallet.purchasedCreditsAvailable || 0, // ✅ Added
}
```

### Issue 2: Frontend Credit Extraction
`/tutor/leads/index.tsx` me credit extraction logic improve kiya:

**Before:**
```typescript
setCreditBalance(creditsRes.data?.data?.availableCredits || creditsRes.data?.availableCredits || 0);
```

**After:**
```typescript
const creditData = creditsRes.data?.data || creditsRes.data;
const availableCredits = creditData?.availableCredits ?? 0;
console.log("Credit Data:", creditData);
console.log("Available Credits:", availableCredits);
setCreditBalance(availableCredits);
```

## Files Modified

### Backend
1. **`tutoredge-backend/src/services/wallet.service.ts`**
   - Fixed `getEarningsSummary()` to return proper credit field names
   - Added missing fields: `freeCreditsAvailable`, `freeCreditsTotal`, `purchasedCreditsAvailable`

### Frontend
2. **`tutoredge-frontend/src/pages/tutor/leads/index.tsx`**
   - Improved credit extraction logic with better error handling
   - Added console logs for debugging

## API Endpoints Affected

### `/wallet/summary` (GET)
**Response Structure (Fixed):**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "availableBalance": 0,
      "totalEarned": 0,
      "totalWithdrawn": 0,
      "totalCommissionPaid": 0
    },
    "credits": {
      "availableCredits": 2,
      "usedCredits": 1,
      "totalEarned": 3,
      "totalPurchased": 0,
      "freeCreditsAvailable": 2,
      "freeCreditsTotal": 3,
      "purchasedCreditsAvailable": 0
    },
    "conversions": {
      "active": 0,
      "total": 0
    }
  }
}
```

### `/wallet/credits` (GET)
**Response Structure (Already Working):**
```json
{
  "success": true,
  "data": {
    "availableCredits": 2,
    "usedCredits": 1,
    "freeCreditsAvailable": 2,
    "freeCreditsTotal": 3,
    "purchasedCreditsAvailable": 0,
    "totalPurchased": 0
  }
}
```

## How Credit System Works

### Credit Types
1. **Free Credits**: 3 credits given by default when tutor registers
2. **Purchased Credits**: Credits bought through subscription plans

### Credit Deduction Logic
- Free credits are used FIRST
- Once free credits are exhausted, purchased credits are used
- Implemented in `lead.service.ts` → `unlockLead()` function

### Database Schema
**LeadCreditWallet Model:**
```typescript
{
  tutorId: ObjectId,
  availableCredits: 2,          // Total (free + purchased)
  usedCredits: 1,               // Total used
  totalEarned: 3,               // Total ever received (free)
  totalPurchased: 0,            // Total purchased
  freeCreditsAvailable: 2,      // Free credits remaining
  freeCreditsTotal: 3,          // Total free credits given
  purchasedCreditsAvailable: 0  // Purchased credits remaining
}
```

## Pages Using Credit Display

1. **Dashboard Home** (`/tutor/dashboard`)
   - Yellow card showing credit breakdown
   - Uses `/wallet/summary` endpoint
   
2. **Find Students** (`/tutor/leads`)
   - Stats card showing available credits
   - Uses `/wallet/credits` endpoint
   
3. **Credits Page** (`/tutor/credits`)
   - Detailed credit purchase page
   - Uses `/wallet/credits` endpoint

## Testing Steps

1. **Backend:**
   ```bash
   cd tutoredge-backend
   npm run build
   # Restart server (if not auto-reloading)
   ```

2. **Frontend:**
   ```bash
   cd tutoredge-frontend
   # No build needed - Next.js auto-reloads
   ```

3. **Verify:**
   - Open browser console
   - Navigate to `/tutor/dashboard`
   - Check credit display (should show 2 available)
   - Navigate to `/tutor/leads`
   - Check credit display in stats (should show 2 available)
   - Check console logs for "Credit Data" and "Available Credits"

## Expected Results

### Dashboard Yellow Card:
```
Lead Credits
2 available

Free Credits: 2/3
Used: 1

[Progress bar showing green portion]
```

### Leads Page Stats:
```
Available Credits
2
```

## Future Improvements

1. Add real-time credit updates using WebSocket
2. Add credit expiry notifications
3. Add credit purchase history timeline
4. Add credit usage analytics

## Status
✅ Backend fixed and compiled
✅ Frontend updated with better error handling
✅ Credit display should now work correctly
⏳ User needs to restart backend server if not auto-reloading
⏳ User needs to refresh browser and check

---
**Date:** September 21, 2026
**Issue:** Credit not fetching from database
**Resolution:** Fixed API response structure and frontend extraction logic
