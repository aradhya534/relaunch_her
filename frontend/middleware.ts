import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || 'relaunch_her_nextauth_secret_key_2026' 
  });
  
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  
  // Returner protected paths
  const isReturnerRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/assessment') || 
                          pathname.startsWith('/courses') || 
                          pathname.startsWith('/jobs');

  // Employer protected paths
  const isEmployerRoute = pathname.startsWith('/employer');

  if (!token) {
    // Redirect guest users trying to access dashboards/features to login
    if (isReturnerRoute || isEmployerRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const role = token.role as string;

  // Redirect logged-in users trying to access login/signup
  if (isAuthPage) {
    if (role === 'EMPLOYER') {
      return NextResponse.redirect(new URL('/employer/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Cross-role boundary redirects
  if (role === 'RETURNER' && isEmployerRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (role === 'EMPLOYER' && isReturnerRoute) {
    return NextResponse.redirect(new URL('/employer/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/assessment/:path*',
    '/courses/:path*',
    '/jobs/:path*',
    '/employer/:path*',
  ],
};
