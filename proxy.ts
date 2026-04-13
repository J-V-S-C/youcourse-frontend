import { withAuth } from 'next-auth/middleware';
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = 
      req.nextUrl.pathname.startsWith('/forgot-password') || 
      req.nextUrl.pathname.startsWith('/login') || 
      req.nextUrl.pathname.startsWith('/register');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, 
    },
  }
);

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  return (authMiddleware as any)(req, event);
}

export const config = {
  // Removi login e register do lookahead negativo para que o proxy os intercepte
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
  ],
};
