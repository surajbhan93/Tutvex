import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for URL Normalization and Redirect Handling
 * 
 * Fixes:
 * 1. Blocks invalid [city]/[location] placeholder URLs
 * 2. Redirects space URLs to hyphenated versions
 * 3. Removes trailing slashes
 * 4. Normalizes to lowercase for SEO routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. BLOCK INVALID PLACEHOLDER URLs
  // These should NEVER exist as actual URLs
  if (pathname.includes('[city]') || pathname.includes('[location]') || pathname.includes('[intent]')) {
    console.warn(`[Middleware] Blocked placeholder URL: ${pathname}`);
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // 2. REDIRECT SPACE URLs TO HYPHENATED (301 Permanent)
  // Example: /india/noida/sector%2063 → /india/noida/sector-63
  if (pathname.includes('%20') || pathname.includes(' ')) {
    const normalizedPath = pathname
      .replace(/%20/g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();
    
    const url = request.nextUrl.clone();
    url.pathname = normalizedPath;
    
    console.log(`[Middleware] 301 Redirect: ${pathname} → ${normalizedPath}`);
    return NextResponse.redirect(url, { status: 301 });
  }

  // 3. REMOVE TRAILING SLASHES (301 Permanent)
  // Example: /path/ → /path
  // Exception: Keep trailing slash for homepage
  if (pathname.endsWith('/') && pathname.length > 1) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    
    console.log(`[Middleware] 301 Redirect (trailing slash): ${pathname} → ${url.pathname}`);
    return NextResponse.redirect(url, { status: 301 });
  }

  // 4. NORMALIZE TO LOWERCASE FOR PROGRAMMATIC SEO ROUTES
  // Only for specific route patterns
  const seoRoutePatterns = [
    '/india/',
    '/allahabad/',
    '/lucknow/',
    '/kanpur/',
    '/country/',
  ];

  const isSeoRoute = seoRoutePatterns.some(pattern => pathname.startsWith(pattern));

  if (isSeoRoute) {
    const lowerPath = pathname.toLowerCase();
    
    // If path has uppercase letters, redirect to lowercase
    if (pathname !== lowerPath) {
      const url = request.nextUrl.clone();
      url.pathname = lowerPath;
      
      console.log(`[Middleware] 301 Redirect (case): ${pathname} → ${lowerPath}`);
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // 5. LOG VALID REQUESTS (for debugging - remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Valid request: ${pathname}`);
  }

  return NextResponse.next();
}

/**
 * Middleware Configuration
 * Specifies which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|sitemap.xml|robots.txt).*)',
  ],
};
