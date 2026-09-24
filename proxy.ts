import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');

  const isPrivateRoute =
    pathname === '/locations/add' ||
    /^\/locations\/[^/]+\/edit$/.test(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!accessToken) {
    if (refreshToken && backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/auth/session`, {
          headers: {
            Cookie: request.headers.get('cookie') ?? '',
          },
          cache: 'no-store',
        });

        const setCookies = res.headers.getSetCookie();
        const data = (await res.json()) as { success?: boolean };

        if (data.success) {
          const response = isPublicRoute
            ? NextResponse.redirect(new URL('/profile', request.url))
            : NextResponse.next();

          for (const cookie of setCookies) {
            response.headers.append('Set-Cookie', cookie);
          }

          return response;
        }
      } catch {
        // session refresh failed
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/locations/add', '/locations/:locationId/edit'],
};
