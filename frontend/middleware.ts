import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /tile to /tiles/tile so content-series tile with link_to_single_type works
  if (pathname === '/tile') {
    return NextResponse.redirect(new URL('/tiles/tile', request.url));
  }
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/connect/discord/redirect',
    '/auth/callback',
    '/auth/error',
    '/auth/success'
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, let the client-side auth check handle it
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};