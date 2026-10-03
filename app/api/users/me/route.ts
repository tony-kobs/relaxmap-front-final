import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/users/me', {
    method: 'GET',
  });
}

export async function PATCH(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  const body = contentType.includes('multipart/form-data')
    ? await request.formData()
    : await request.text();
  return proxyToBackend(request, '/users/me', {
    method: 'PATCH',
    body,
  });
}
