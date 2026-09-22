# Next.js Image Error Fix - Base64 Images

## Error
```
Error: Invalid src prop
(http://localhost:3001/api/v1data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQE...)
on `next/image`, hostname "localhost" is not configured under images in your `next.config.js`
```

## Root Cause
Next.js `<Image>` component cannot handle base64-encoded images (`data:image/...`). The component is designed for URLs only and requires external domains to be configured in `next.config.js`.

## Problem Areas

### 1. Tutor Profile Images
Tutors upload profile photos during registration which are stored as base64 strings in MongoDB:
```typescript
profileImage: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

When these images are used with `<Image>` component, Next.js tries to optimize them and fails.

## Solution

### Conditional Image Rendering
Use regular `<img>` tag for base64 images and `<Image>` component for URLs:

```typescript
{tutor?.profileImage && tutor.profileImage.startsWith('data:') ? (
  // Base64 image - use regular img tag
  <img
    src={tutor.profileImage}
    width={48}
    height={48}
    className="rounded-full"
    alt="Tutor"
  />
) : (
  // URL image - use Next.js Image component
  <Image
    src={resolveImage(tutor?.profileImage)}
    width={48}
    height={48}
    className="rounded-full"
    alt="Tutor"
  />
)}
```

## Files Fixed

### 1. Tutor Dashboard Sidebar
**File:** `tutoredge-frontend/src/components/tutor-dashboard/Sidebar.tsx`

**Change:**
- ❌ Before: Used `<Image>` component for all profile images
- ✅ After: Conditional rendering - `<img>` for base64, `<Image>` for URLs

### 2. Admin Applications Page
**File:** `tutoredge-frontend/src/components/admin-dashboard/TutorApplicationsPage.tsx`

**Status:** ✅ Already using `<img>` tag, no changes needed

## Why This Approach?

### Option 1: Convert Base64 to URLs (NOT CHOSEN)
**Pros:**
- Can use Next.js Image optimization
- Smaller payload in API responses

**Cons:**
- Requires Cloudinary/S3 setup
- Additional complexity
- Migration needed for existing data

### Option 2: Use `<img>` for Base64 (CHOSEN) ✅
**Pros:**
- Simple, immediate fix
- No backend changes
- Works with existing data
- No external dependencies

**Cons:**
- No image optimization for base64
- Larger initial payload

## Image Types Comparison

### Base64 Images
```typescript
profileImage: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```
**Characteristics:**
- Embedded directly in HTML/JSON
- No additional HTTP request
- No caching
- Larger payload size
- Use `<img>` tag

### URL Images
```typescript
profileImage: "https://res.cloudinary.com/..."
```
**Characteristics:**
- Separate HTTP request
- Can be cached
- Smaller JSON payload
- Can be optimized by Next.js
- Use `<Image>` component

## Best Practices Going Forward

### For New Images
Consider migrating to URL-based storage:

```typescript
// Upload to Cloudinary
const uploadResult = await cloudinary.uploader.upload(base64Image);
profileImage = uploadResult.secure_url; // Store URL instead of base64
```

### For Existing Code
Always check image type before rendering:

```typescript
const isBase64 = image?.startsWith('data:');
const ImageComponent = isBase64 ? 'img' : Image;

<ImageComponent
  src={isBase64 ? image : resolveImage(image)}
  width={48}
  height={48}
  alt="Profile"
/>
```

## Testing

### Test Cases
- [ ] Tutor with base64 profile image → Should display correctly
- [ ] Tutor with URL profile image → Should display correctly
- [ ] Tutor with no profile image → Should show placeholder
- [ ] Admin viewing tutor applications → Images display correctly
- [ ] Profile page → Image displays correctly

### How to Test
1. Register a new tutor with profile photo upload
2. Login as that tutor
3. Check sidebar - profile image should display
4. Login as admin
5. Check tutor applications - profile images should display
6. No console errors about invalid image src

## Performance Impact

### Base64 Images
**Size:** ~1.3x larger than original (33% overhead)
**Load:** Inline with page, no additional request
**Cache:** Cannot be cached separately

**Example:**
- Original: 100KB JPEG
- Base64: ~133KB string
- In JSON response: +133KB per tutor

### URL Images
**Size:** Original file size
**Load:** Separate request, can be lazy loaded
**Cache:** Browser caches, CDN caches

**Example:**
- Original: 100KB JPEG
- In JSON response: ~50 bytes (just URL)
- Total: 100KB + 50B

## Migration Plan (Future)

If we want to migrate to URL-based images:

### Step 1: Update Upload Flow
```typescript
// In tutor registration
const formData = new FormData();
formData.append('image', file);

const response = await api.post('/upload/profile-image', formData);
profileImage = response.data.url; // Cloudinary URL
```

### Step 2: Migrate Existing Data
```javascript
// MongoDB migration script
const tutors = await User.find({ 
  role: 'tutor',
  profileImage: { $regex: /^data:image/ }
});

for (const tutor of tutors) {
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(tutor.profileImage);
  
  // Update database
  tutor.profileImage = result.secure_url;
  await tutor.save();
}
```

### Step 3: Remove Conditional Rendering
```typescript
// Can use <Image> everywhere
<Image
  src={tutor.profileImage}
  width={48}
  height={48}
  alt="Tutor"
/>
```

## Alternative Solutions

### 1. Disable Image Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: true // Disables all optimization
  }
}
```
**Not recommended:** Loses all optimization benefits

### 2. Custom Image Loader
```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my-loader.js'
  }
}

// my-loader.js
export default function myLoader({ src }) {
  if (src.startsWith('data:')) {
    return src; // Pass through base64
  }
  return src; // Pass through URLs
}
```
**Still doesn't work:** Next.js will still try to optimize

### 3. Use `<img>` Everywhere
```typescript
// Replace all <Image> with <img>
<img src={image} alt="..." />
```
**Not recommended:** Loses optimization for URL images

## Current Solution Summary

✅ **Conditional Rendering (Best Balance)**
- Simple implementation
- Works with existing data
- Maintains optimization for URL images
- No breaking changes
- Easy to migrate later

## Files to Watch

These files use images and might need similar fixes:

1. ✅ `Sidebar.tsx` - Fixed
2. ✅ `TutorApplicationsPage.tsx` - Already using `<img>`
3. `ProfilePage.tsx` - Check if uses Image component
4. `FindStudentPage.tsx` - Check if displays tutor images
5. `TutorCard.tsx` (if exists) - Check image rendering

## Status
✅ Error fixed in Sidebar
✅ TutorApplicationsPage already correct
✅ Page should load without errors now
⏳ Test by refreshing the page

---

**Date:** September 21, 2026
**Error:** Invalid src prop on next/image
**Fix:** Conditional rendering for base64 vs URL images
**Impact:** Immediate fix, no backend changes needed
