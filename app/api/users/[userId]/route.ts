import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

type Context = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { userId } = await context.params;
  const path = `/users/${userId}${request.nextUrl.search}`;
  return proxyToBackend(request, path, { method: 'GET' });
}
