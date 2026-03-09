import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  if (request.nextUrl.pathname === '/cv/pdf') {
    headers.set('x-is-pdf-route', 'true');
  }
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: '/cv/pdf' };
