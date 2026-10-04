import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../_utils/proxy';

type Context = { params: Promise<{ feedbackId: string }> };

export async function DELETE(request: NextRequest, context: Context) {
  const { feedbackId } = await context.params;
  const path = `/feedbacks/${feedbackId}`;
  return proxyToBackend(request, path, { method: 'DELETE' });
}
