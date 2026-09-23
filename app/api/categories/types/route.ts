import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

export async function GET(request: NextRequest) {
  const path = `/categories/types${request.nextUrl.search}`;
  return proxyToBackend(request, path, { method: 'GET' });
}
