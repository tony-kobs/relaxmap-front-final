import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, logErrorResponse } from './utils';

function withCookies(response: NextResponse, backendResponse: Response) {
  const setCookies = backendResponse.headers.getSetCookie();

  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}

export async function proxyToBackend(
  request: NextRequest,
  path: string,
  init: RequestInit = {},
) {
  try {
    const backendUrl = getBackendUrl();
    const cookie = request.headers.get('cookie') ?? '';
    const headers = new Headers(init.headers);
    headers.set('Cookie', cookie);

    if (
      init.body &&
      !headers.has('Content-Type') &&
      !(init.body instanceof FormData)
    ) {
      headers.set('Content-Type', 'application/json');
    }

    const backendResponse = await fetch(`${backendUrl}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });

    if (backendResponse.status === 204) {
      return withCookies(new NextResponse(null, { status: 204 }), backendResponse);
    }

    const text = await backendResponse.text();
    let data: unknown = text;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    return withCookies(
      NextResponse.json(data, { status: backendResponse.status }),
      backendResponse,
    );
  } catch (error) {
    logErrorResponse(error);
    return NextResponse.json(
      { message: 'Backend is unavailable' },
      { status: 503 },
    );
  }
}
