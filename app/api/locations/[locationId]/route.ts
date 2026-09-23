import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

type Context = { params: Promise<{ locationId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { locationId } = await context.params;
  const path = `/locations/${locationId}${request.nextUrl.search}`;
  return proxyToBackend(request, path, { method: 'GET' });
}

export async function PATCH(request: NextRequest, context: Context) {
  const { locationId } = await context.params;
  const path = `/locations/${locationId}`;
  const body = await request.formData();
  return proxyToBackend(request, path, { method: 'PATCH', body });
}
