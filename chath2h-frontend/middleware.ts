import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  let cookie = request.cookies.get('H2H_auth_cookie');

  if (request.url.startsWith('http://localhost')) {
    return NextResponse.next();
  }

  if (!cookie?.value && request.url.includes('dashboard')) {
    return NextResponse.redirect(new URL('/authorization', request.url));
  }

  if (
    (!cookie?.value && !request.url.includes('register')) ||
    (cookie?.value && request.url.includes('register'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat',
    '/dashboard',
    '/dashboard/my-profile',
    '/dashboard/my-tokens',
    '/dashboard/my-work',
    '/mailbox',
    '/register'
  ]
};
