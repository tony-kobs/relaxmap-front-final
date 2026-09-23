import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/users/me', {
    method: 'GET',
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend(request, '/users/me', {
    method: 'PATCH',
    body,
  });
}
