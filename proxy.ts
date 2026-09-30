import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register'];

function clearAuthCookies(response: NextResponse) {
  const expired = { path: '/', maxAge: 0 };
  response.cookies.set('accessToken', '', expired);
  response.cookies.set('refreshToken', '', expired);
  response.cookies.set('sessionId', '', expired);
  return response;
}

function applySetCookies(response: NextResponse, setCookies: string[]) {
  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }
  return response;
}

async function checkBackendSession(request: NextRequest, backendUrl: string) {
  try {
    const res = await fetch(`${backendUrl}/auth/session`, {
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    const setCookies = res.headers.getSetCookie();
    const data = (await res.json()) as { success?: boolean };
    return { success: Boolean(data.success), setCookies };
  } catch {
    return { success: false, setCookies: [] as string[] };
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');

  const isPrivateRoute =
    pathname === '/locations/add' ||
    /^\/locations\/[^/]+\/edit$/.test(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Do not trust a stale accessToken: validate/refresh before bouncing
  // authenticated users away from login/register (avoids /profile spinner loop).
  if (isPublicRoute && (accessToken || refreshToken) && backendUrl) {
    const { success, setCookies } = await checkBackendSession(request, backendUrl);

    if (success) {
      return applySetCookies(
        NextResponse.redirect(new URL('/profile', request.url)),
        setCookies,
      );
    }

    return clearAuthCookies(NextResponse.next());
  }

  if (!accessToken) {
    if (refreshToken && backendUrl) {
      const { success, setCookies } = await checkBackendSession(request, backendUrl);

      if (success) {
        return applySetCookies(NextResponse.next(), setCookies);
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/locations/add', '/locations/:locationId/edit'],
};
