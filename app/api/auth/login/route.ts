import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend(request, '/auth/login', {
    method: 'POST',
    body,
  });
}
