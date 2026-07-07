import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy
 * Injects a request header x-is-admin into the incoming request.
 * The Server component root layout (src/app/layout.tsx) reads this request header
 * to determine whether to render the storefront app bar / footer chrome.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const isAdmin = request.nextUrl.pathname.startsWith('/admin') ? '1' : '0';
  requestHeaders.set('x-is-admin', isAdmin);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    // Run on all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
