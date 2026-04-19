import { withAuth } from 'next-auth/middleware';
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token && !token.error;
    const { pathname } = req.nextUrl;

    const isAuthPage =
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register');

    const isPublicRoute = pathname === '/';

    if (isAuthPage) {
      if (isAuth) {
        console.log(isAuth)
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth && !isPublicRoute) {
      let from = pathname;
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
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
