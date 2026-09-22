# TUTVEX.COM - COMPLETE SEO ISSUES ANALYSIS & FIX PLAN

**Analysis Date:** September 19, 2026  
**Domain:** https://tutvex.com  
**Total Issues:** 4 Google Search Console Problems

---

## EXECUTIVE SUMMARY

### All 4 Google Search Console Issues

| Issue # | Type | Affected URLs | Status | Priority |
|---------|------|---------------|--------|----------|
| 1 | Soft 404 | 8,150 → 1,472 | ✅ Partially Fixed | LOW |
| 2 | Page with Redirect | 3,220 | ⚠️ NEEDS FIX | HIGH |
| 3 | Alternate Page with Proper Canonical | 1,470 | ❌ BROKEN | CRITICAL |
| 4 | Not Found (404) | 179 | ⏳ PENDING ANALYSIS | MEDIUM |

### Root Cause Summary

**ALL 4 issues stem from the SAME architectural problems:**

1. ❌ **URL Generation vs Canonical Mismatch** - URLs generated one way, canonical points another way
2. ❌ **Location Config Has Spaces/Title Case** - Source data not in URL-safe format
3. ❌ **Runtime Transformation Instead of Pre-Slugified** - On-the-fly conversions cause inconsistency
4. ❌ **Middleware Fixes Symptoms, Not Root Cause** - Redirects happen because source is wrong

---

## ISSUE #3: ALTERNATE PAGE WITH PROPER CANONICAL TAG (1,470 URLs)

### What This Error Means

Google found these URLs but determined they are **alternate versions** of other pages based on the canonical tag. This means:

- The page exists (HTTP 200)
- The page has a canonical tag
- The canonical points to a **different URL** than the page itself
- Google indexes the canonical URL, not the actual URL

**Example:**
```
Page URL:     https://tutvex.com/india/Lucknow/gomti-nagar/home-tutor
Canonical:    https://tutvex.com/india/lucknow/gomti-nagar/home-tutor
                                        ↑ lowercase
Result: Google treats the first URL as an "alternate" and indexes the second
```

### Analysis of 1,470 URLs

#### Pattern 1: **Title Case in City Name** (~200-300 URLs, 15-20%)

**Examples from CSV:**
```
❌ /india/Lucknow/tedhi-pulia/become-home-tutor
❌ /india/Lucknow/bbau/one-to-one-tuition
❌ /india/Lucknow/gomti-nagar-it-park/home-tutor
❌ /india/Lucknow/eldeco-ii/home-tutor-job
❌ /india/Lucknow/aminabad/private-tutor
❌ /india/Lucknow/charbagh/private-tutor-job

✅ Should all be: /india/lucknow/...
```

**Root Cause:**
```typescript
// In lucknow.ts line 6:
slug: "Lucknow"  // ❌ Title case

// getStaticPaths generates:
city: city.slug  // Uses "Lucknow" with capital L

// Canonical tag uses:
href={`/india/${city}/${location}/${intent}`}
// Results in: /india/Lucknow/... (wrong case)
```

---

#### Pattern 2: **Spaces in URL Paths** (~50-100 URLs, 5-7%)

**Examples from CSV:**
```
❌ /india/meerut/modipuram/chemistry tutor
❌ /india/meerut/pallavpuram/coaching near me
❌ /india/meerut/modipuram/private tutor job
❌ /india/meerut/modipuram/home teacher
❌ /india/meerut/modipuram/teaching job
❌ /india/noida/Sector 63/private-tutor

✅ Should be:
/india/meerut/modipuram/chemistry-tutor
/india/meerut/modipuram/private-tutor-job
/india/noida/sector-63/private-tutor
```

**Root Cause:**
```typescript
// Intents config has:
"chemistry tutor"  // ❌ Space not hyphen
"home teacher"     // ❌ Space not hyphen

// OR location has:
"Sector 63"        // ❌ Space not hyphen

// getStaticPaths SHOULD transform but doesn't consistently
```

---

#### Pattern 3: **Trailing Slashes** (~100-150 URLs, 7-10%)

**Examples from CSV:**
```
❌ /india/jodhpur/paota/1-to-1-tuition/
❌ /india/Lucknow/raebareli-road/experienced-tutor/
❌ /india/noida/sector-143/english-tutor/
❌ /india/Lucknow/hussainganj/part-time-teaching-job/

✅ Should be (without trailing slash):
/india/jodhpur/paota/1-to-1-tuition
/india/lucknow/raebareli-road/experienced-tutor
```

**Root Cause:**
- Next.js config has no `trailingSlash` setting (defaults to false)
- Some URL generation adds trailing slash
- Canonical doesn't have trailing slash
- Creates alternate URL

---

#### Pattern 4: **Query Parameters** (~50-80 URLs, 3-5%)

**Examples from CSV:**
```
❌ /subjects?subject=ICSE&source=HOME_CARD&fromPage=/
❌ /?source=NAVBAR_LOGO&medium=website
❌ /subjects?source=NAVBAR&campaign=SUBJECTS_NAV&medium=website
❌ /kid-courses/junior-section?section=Junior Section&classRange=Class 6-8&source=...

✅ Canonical should be clean:
/subjects
/
/kid-courses/junior-section
```

**Root Cause:**
- Tracking parameters in URLs
- Google sees these as separate pages
- Canonical should point to clean URL without parameters

---

#### Pattern 5: **Properly Formatted But Still Alternate** (~900-1,000 URLs, 60-70%)

**Examples from CSV:**
```
❓ /kanpur/lajpat-nagar/home-tuition
❓ /lucknow/eldeco-ii/local-tuition-center
❓ /kanpur/rama-devi/physics-tutor
❓ /kanpur/vijay-nagar/home-tutor
❓ /lucknow/krishna-nagar/tuition-teacher
```

These look properly formatted but Google still marks them as "alternate canonical".

**Investigation Needed:**

**Possibility A: Canonical Mismatch in Route**

```typescript
// In [city]/[location]/[intent].tsx line 153-155:
<link
  rel="canonical"
  href={`https://tutvex.com/${city}/${location.toLowerCase().replace(/\s+/g, '-')}/${intent}`}
/>

// Problem: location has spaces from getStaticProps
// location = "Eldeco II" (from props)
// canonical = tutvex.com/lucknow/eldeco-ii/local-tuition-center
// BUT actual URL might be: tutvex.com/lucknow/Eldeco II/local-tuition-center
```

**Possibility B: Duplicate Routes Canonical to Each Other**

```
Route A: /kanpur/{location}/{intent}
Route B: /india/kanpur/{location}/{intent}

If both exist, they might canonical to each other or one might canonical to /india/ version
```

---

## THE CORE ARCHITECTURAL PROBLEM

### Current Flow (BROKEN):

```typescript
// 1. CONFIG (Source of Truth)
locations: ["Gomti Nagar", "Civil Lines", "Sector 63"]  // ❌ Spaces, Title Case

// 2. getStaticPaths (URL Generation)
params: {
  city: city.slug,  // "Lucknow" (Title Case)
  location: location.toLowerCase().replace(/\s+/g, '-'),  // "gomti-nagar"
  intent: intent.toLowerCase().replace(/\s+/g, '-')       // "home-tutor"
}
// Generates: /india/Lucknow/gomti-nagar/home-tutor
//                    ↑ Wrong case from slug

// 3. getStaticProps (Prepare Data for Page)
props: {
  city: "lucknow",
  location: "gomti nagar",  // ❌ Converted BACK to spaces!
  intent: "home tutor"
}

// 4. Canonical Tag (Rebuild URL)
href={`/india/${city}/${location}/${intent}`}
// Uses "gomti nagar" with spaces!
// Results in: /india/lucknow/gomti nagar/home tutor ❌

// 5. Middleware (Band-aid Fix)
// Redirects /gomti%20nagar → /gomti-nagar (301 redirect)

// 6. Final Result
// URL generated: /india/Lucknow/gomti-nagar/home-tutor (from getStaticPaths)
// Canonical:     /india/lucknow/gomti nagar/home tutor (from template)
// Middleware redirects canonical spaces to hyphens
// But case mismatch remains: Lucknow vs lucknow
// = GOOGLE SEES AS ALTERNATE URL
```

### The Problem:

1. **Config has human-readable format** (spaces, title case)
2. **getStaticPaths transforms** to URL-safe
3. **getStaticProps converts BACK** to human-readable
4. **Canonical rebuilds** from human-readable (creates wrong URL)
5. **Middleware** redirects the wrong URL (creates redirect count)
6. **Result:** URL ≠ Canonical = Alternate page status

---

## CORRECT ARCHITECTURE

### What Should Happen:

```typescript
// 1. CONFIG (Single Source of Truth with BOTH formats)
locations: [
  { name: "Gomti Nagar", slug: "gomti-nagar" },
  { name: "Civil Lines", slug: "civil-lines" },
  { name: "Sector 63", slug: "sector-63" }
]
city: {
  name: "Lucknow",
  slug: "lucknow"  // ✅ lowercase
}

// 2. getStaticPaths (Use Pre-Defined Slugs)
params: {
  city: city.slug,      // "lucknow" (from config)
  location: loc.slug,   // "gomti-nagar" (from config)
  intent: intent.slug   // "home-tutor" (from config)
}
// Generates: /india/lucknow/gomti-nagar/home-tutor ✅

// 3. getStaticProps (Pass SLUG for URL, NAME for display)
props: {
  city: {
    slug: "lucknow",
    name: "Lucknow"
  },
  location: {
    slug: "gomti-nagar",
    name: "Gomti Nagar"
  },
  intent: {
    slug: "home-tutor",
    name: "Home Tutor"
  }
}

// 4. Canonical Tag (Use Slug)
href={`/india/${city.slug}/${location.slug}/${intent.slug}`}
// Results in: /india/lucknow/gomti-nagar/home-tutor ✅

// 5. Display in UI (Use Name)
<h1>{intent.name} in {location.name}, {city.name}</h1>
// Shows: "Home Tutor in Gomti Nagar, Lucknow" ✅

// 6. Middleware (Safety Net Only)
// Catches any malformed URLs from old links
// But 99% of traffic never hits middleware

// 7. Final Result
// URL:       /india/lucknow/gomti-nagar/home-tutor
// Canonical: /india/lucknow/gomti-nagar/home-tutor
// Display:   "Home Tutor in Gomti Nagar, Lucknow"
// = GOOGLE SEES AS CANONICAL URL ✅
```

---

## ISSUE #2: PAGE WITH REDIRECT (3,220 URLs)

### Connection to Canonical Issue

The **3,220 redirect URLs** are caused by the SAME architectural problem:

1. Source generates URLs with spaces/title case
2. Middleware catches them and redirects (301) to correct format
3. Result: 3,220 URLs that redirect

**These should NOT exist as redirects.** They should be prevented at source.

### Examples:

```
❌ /india/meerut/vidya knowledge park/tutor near me
   ↓ 301 Redirect via Middleware
✅ /india/meerut/vidya-knowledge-park/tutor-near-me

Problem: URL was generated with spaces, middleware fixes it
Solution: Don't generate URL with spaces in the first place
```

---

## ISSUE #1: SOFT 404 (8,150 → 1,472 URLs)

### Status: Partially Fixed

- Changed `fallback: "blocking"` to `fallback: false` ✅
- Added `notFound: true` for invalid combinations ✅
- Count reduced from 8,150 to 1,472 ✅

### Remaining 1,472:

Likely caused by:
1. Old URLs in Google's index from before fix
2. External backlinks to invalid URLs
3. Some invalid combinations still returning 200

**Action:** Wait for Google to recrawl, verify all invalid combinations return 404.

---

## ISSUE #4: NOT FOUND (404) - 179 URLs

### Analysis Pending

Need CSV file with actual 404 URLs to analyze.

**Expected patterns:**
1. Genuinely deleted pages (valid 404)
2. Typos in URLs (valid 404)
3. Old URL structures that should redirect to new (needs 301)
4. Broken internal links (needs fixing)
5. Invalid programmatic combinations (valid 404)

**Action:** Awaiting CSV upload for detailed analysis.

---

## UNIFIED FIX PLAN

### Phase 1: Fix Config Files (Source of Truth)

**Priority:** CRITICAL  
**Impact:** Fixes Issues #2 and #3

#### 1.1 Update All City Config Files

**Files to update:**
- `src/components/seoIndia/locations/up/lucknow.ts`
- `src/components/seoIndia/locations/up/meerut.ts`
- `src/components/seoIndia/locations/up/noida.ts`
- `src/components/seoIndia/locations/up/agra.ts`
- `src/components/seoIndia/locations/up/banaras.ts`
- `src/components/seoIndia/locations/delhi/delhi.ts`
- `src/components/seoIndia/locations/rajasthan/jaipur.ts`
- `src/components/seoIndia/locations/rajasthan/jodhpur.ts`
- All other city files

**Change format from:**
```typescript
export const city = {
  name: "Lucknow",
  slug: "Lucknow",  // ❌ Title case
  locations: [
    "Gomti Nagar",   // ❌ String with spaces
    "Civil Lines",
    "Sector 63"
  ]
}
```

**To:**
```typescript
export const city = {
  name: "Lucknow",
  slug: "lucknow",  // ✅ lowercase
  locations: [
    { name: "Gomti Nagar", slug: "gomti-nagar" },
    { name: "Civil Lines", slug: "civil-lines" },
    { name: "Sector 63", slug: "sector-63" }
  ]
}
```

#### 1.2 Update Intents Config

**Files:**
- `src/components/seoIndia/intents.ts`
- `src/components/seo/seo.config.ts`

**Change from:**
```typescript
export const INTENTS = {
  tutorSearch: [
    "home tutor",     // ❌ Spaces
    "home tuition",
    "private tutor"
  ]
}
```

**To:**
```typescript
export const INTENTS = {
  tutorSearch: [
    { name: "Home Tutor", slug: "home-tutor" },
    { name: "Home Tuition", slug: "home-tuition" },
    { name: "Private Tutor", slug: "private-tutor" }
  ]
}
```

---

### Phase 2: Update Route Files

**Priority:** CRITICAL  
**Impact:** Fixes canonical implementation

#### 2.1 Update `/india/[city]/[location]/[intent].tsx`

**Changes needed:**
1. Update getStaticPaths to use `.slug` from config
2. Update getStaticProps to pass both name and slug
3. Update canonical to use slug
4. Update display to use name

#### 2.2 Update `/[city]/[location]/[intent].tsx`

Same changes as above.

#### 2.3 Update `/allahabad/[location]/[intent].tsx`

Same changes as above.

#### 2.4 Update all city index pages

Ensure they use lowercase slugs in canonical.

---

### Phase 3: Update Sitemap Generation

**File:** `scripts/generate-sitemap.js`

**Changes:**
1. Import slugify utility
2. Use `.slug` from config instead of transforming strings
3. Validate all URLs before adding to sitemap
4. Remove any URLs with spaces, title case, or trailing slashes

---

### Phase 4: Add Next.js Config

**File:** `next.config.js`

**Add:**
```javascript
module.exports = {
  trailingSlash: false,  // Explicitly set
  // ... rest of config
}
```

---

### Phase 5: Internal Link Audit

**Action:** Search for internal links that might generate wrong URLs

**Files to check:**
- All components with `<Link href=` 
- All `router.push()` calls
- Footer links
- Navigation links
- Breadcrumbs

---

### Phase 6: Middleware (Keep as Safety Net)

**File:** `src/middleware.ts`

**Status:** Already correct ✅

Keep middleware as-is for handling:
- Old external links
- Typos
- Edge cases

But 99% of traffic should never hit redirects after Phases 1-5 are complete.

---

## EXPECTED RESULTS AFTER FIX

### Issue #3 (Alternate Canonical): 1,470 → 0
- All URLs will have matching canonical tags
- No more alternate page warnings

### Issue #2 (Redirects): 3,220 → ~50
- Most redirects eliminated at source
- Only edge cases hit middleware
- Remaining ~50 are old external links (acceptable)

### Issue #1 (Soft 404): 1,472 → 0
- Google recrawls and sees 404s are proper 404s
- Old invalid URLs drop from index

### Issue #4 (404): Analysis pending CSV

---

## TESTING COMMANDS

### Test Canonical Implementation:

```bash
# Test that URL and canonical match
curl -s https://tutvex.com/india/lucknow/gomti-nagar/home-tutor | grep -o 'rel="canonical"[^>]*'

# Should return:
# rel="canonical" href="https://tutvex.com/india/lucknow/gomti-nagar/home-tutor"
```

### Test No Redirects:

```bash
# Should return 200, not 301/302
curl -I https://tutvex.com/india/lucknow/gomti-nagar/home-tutor

# Output should show:
# HTTP/2 200
```

### Test Invalid URLs Return 404:

```bash
# Should return 404
curl -I https://tutvex.com/india/lucknow/invalid-location/home-tutor

# Output should show:
# HTTP/2 404
```

### Test Case Sensitivity Redirect:

```bash
# Should redirect to lowercase
curl -IL https://tutvex.com/india/Lucknow/gomti-nagar/home-tutor

# Should show:
# HTTP/2 301
# Location: https://tutvex.com/india/lucknow/gomti-nagar/home-tutor
# HTTP/2 200
```

---

## DEPLOYMENT CHECKLIST

### Before Deployment:

- [ ] Backup all config files
- [ ] Backup all route files
- [ ] Create git branch for changes
- [ ] Test locally with `npm run build`

### After Code Changes:

- [ ] Run `npm run build` - verify no errors
- [ ] Check build output for correct # of static pages
- [ ] Run `npm run generate-sitemap`
- [ ] Inspect sitemap.xml - all URLs should be lowercase-hyphenated
- [ ] Test 10-20 sample URLs locally

### After Deployment:

- [ ] Test 50 URLs from CSV in production
- [ ] Verify canonical tags match URLs
- [ ] Verify no 301 redirects on valid URLs
- [ ] Monitor server logs for redirect rate
- [ ] Check Google Search Console after 24 hours

### Google Search Console Validation:

- [ ] Wait 7 days for Google to recrawl
- [ ] Click "Validate Fix" for Issue #3 (Alternate Canonical)
- [ ] Click "Validate Fix" for Issue #2 (Page with Redirect)
- [ ] Monitor validation progress
- [ ] Expect 4-6 weeks for full index update

---

## TIMELINE ESTIMATE

| Phase | Time | Complexity |
|-------|------|------------|
| Phase 1: Update Configs | 3-4 hours | Medium |
| Phase 2: Update Routes | 4-5 hours | High |
| Phase 3: Update Sitemap | 1-2 hours | Low |
| Phase 4: Next Config | 5 minutes | Low |
| Phase 5: Link Audit | 2-3 hours | Medium |
| Testing | 2-3 hours | Medium |
| **Total Development** | **12-17 hours** | |
| Google Recrawl | 1-2 weeks | - |
| Full Index Update | 4-6 weeks | - |

---

## PRIORITY RANKING

1. **CRITICAL - Phase 1 & 2** (Config + Routes)
   - Fixes canonical issue (#3)
   - Fixes redirect issue (#2)
   - **DO THIS FIRST**

2. **HIGH - Phase 3** (Sitemap)
   - Ensures Google only finds correct URLs
   - Prevents new issues

3. **MEDIUM - Phase 5** (Link Audit)
   - Prevents internal bad links
   - User experience improvement

4. **LOW - Phase 4** (Next Config)
   - Explicit setting (already defaults correctly)
   - Nice to have

---

## CONCLUSION

All 4 Google Search Console issues stem from **one architectural problem:**

> Config files contain human-readable data (spaces, title case) instead of URL-safe slugs, causing URL generation, canonical tags, and redirects to be inconsistent.

**The fix is systematic:**
1. Add `.slug` properties to all config data
2. Use slugs for URLs, keep names for display
3. Canonical always uses slug
4. Middleware catches edge cases only

**Result:**
- Issue #3 (Canonical): 1,470 → 0 ✅
- Issue #2 (Redirects): 3,220 → ~50 ✅  
- Issue #1 (Soft 404): 1,472 → 0 ✅
- Issue #4 (404): Analyze CSV then fix ⏳

**Implementation: 12-17 hours development + 1-2 weeks Google recrawl**

---

**END OF ANALYSIS**
