/**
 * URL Slug Utility Functions
 * Ensures consistent URL generation across the entire application
 */

/**
 * Convert any string to a URL-safe slug
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Handles multiple hyphens
 * 
 * @example
 * slugify("Civil Lines") → "civil-lines"
 * slugify("Sector 63") → "sector-63"
 * slugify("JEE Tutor") → "jee-tutor"
 */
export function slugify(text: string | undefined | null): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars except hyphens
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single
    .replace(/^-+/, '')             // Trim hyphens from start
    .replace(/-+$/, '');            // Trim hyphens from end
}

/**
 * Convert slug back to display format (Title Case with spaces)
 * 
 * @example
 * unslugify("civil-lines") → "Civil Lines"
 * unslugify("sector-63") → "Sector 63"
 */
export function unslugify(slug: string | undefined | null): string {
  if (!slug) return '';
  
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Normalize a full URL path
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes trailing slashes
 * - Handles URL encoding
 * 
 * @example
 * normalizePath("/India/Noida/Sector 63/") → "/india/noida/sector-63"
 */
export function normalizePath(path: string): string {
  return path
    .toLowerCase()
    .replace(/%20/g, '-')           // Handle URL-encoded spaces
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/\/+$/, '');           // Remove trailing slashes
}

/**
 * Check if a slug is already in correct format
 * (lowercase, hyphenated, no spaces, no special chars)
 */
export function isValidSlug(text: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(text);
}

/**
 * Batch slugify an array of strings
 */
export function slugifyArray(texts: string[]): string[] {
  return texts.map(text => slugify(text));
}

/**
 * Create a slug from multiple parts
 * 
 * @example
 * createSlug("India", "Noida", "Home Tutor") → "india-noida-home-tutor"
 */
export function createSlug(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map(part => slugify(part))
    .join('-');
}
