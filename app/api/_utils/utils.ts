const BACKEND_URL = process.env.BACKEND_URL;

export function getBackendUrl() {
  if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not configured');
  }

  return BACKEND_URL.replace(/\/$/, '');
}

export function logErrorResponse(errorObj: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.dir(errorObj, { depth: null });
}
