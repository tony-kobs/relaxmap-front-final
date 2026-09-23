import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/auth/logout', {
    method: 'POST',
  });
}
