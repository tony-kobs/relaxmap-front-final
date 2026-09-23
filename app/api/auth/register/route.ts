import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

export async function POST(request: NextRequest) {
  const body = await request.text();
  return proxyToBackend(request, '/auth/register', {
    method: 'POST',
    body,
  });
}
