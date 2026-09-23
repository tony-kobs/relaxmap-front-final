import { NextRequest } from 'next/server';
import { proxyToBackend } from '../_utils/proxy';

export async function GET(request: NextRequest) {
  const path = `/locations${request.nextUrl.search}`;
  return proxyToBackend(request, path, { method: 'GET' });
}

export async function POST(request: NextRequest) {
  const path = '/locations';
  const body = await request.formData();
  return proxyToBackend(request, path, { method: 'POST', body });
}
