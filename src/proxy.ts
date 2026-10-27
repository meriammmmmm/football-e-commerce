import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from '@/lib/adminAuth';

/**
 * Files the admin app needs before anyone can unlock it. The service worker,
 * the web manifest and the icons have to stay reachable, otherwise the app
 * cannot be installed on a phone.
 */
const PUBLIC_ADMIN_PATHS = ['/admin/manifest.webmanifest', '/admin/sw.js'];
const PUBLIC_ADMIN_PREFIXES = ['/admin/icons/'];

function isPublicAdminAsset(pathname: string): boolean {
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return true;
  return PUBLIC_ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Keeps the admin area behind the PIN. This is an optimistic check that decides
 * what to show; the API routes verify the session again before any write.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();
  if (isPublicAdminAsset(pathname)) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifyAdminToken(token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};
