// Resolve API URL dynamically:
// - In browser (client-side): use relative '/api' so Next.js rewrites proxy same-origin requests
// - On server (SSR): use BACKEND_URL or fallback to production backend
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  const backend = process.env.BACKEND_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://swaddesh.onrender.com' 
      : 'http://127.0.0.1:8080');
  return backend.endsWith('/api') ? backend : `${backend}/api`;
};

/**
 * Fetch wrapper for connecting to the backend API.
 * Uses relative '/api' in the browser to route through Next.js reverse proxy.
 * Includes cold-start detection and a 45s timeout for Render backend cold starts.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  // Retrieve token and vendor ID from localStorage if available
  let token: string | null = null;
  let vendorId: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('vendor_token');
    vendorId = localStorage.getItem('swaddesh_vendor_id');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(vendorId ? { 'X-Vendor-Id': vendorId } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  // 45s AbortController timeout for Render cold start tolerance
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  // If request takes > 3.5s, signal that Render backend might be cold-starting
  let coldStartTimer: any = null;
  if (typeof window !== 'undefined') {
    coldStartTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('server-cold-starting'));
    }, 3500);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);
    if (coldStartTimer) clearTimeout(coldStartTimer);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('server-awake'));
    }

    if (!response.ok) {
      if ((response.status === 502 || response.status === 503 || response.status === 504) && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('server-cold-starting'));
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || `Request failed (${response.status})`;
      throw new Error(errorMsg);
    }

    // Handle No Content responses
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (coldStartTimer) clearTimeout(coldStartTimer);
    if (err.name === 'AbortError') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('server-cold-starting'));
      }
      throw new Error('Request timed out after 45s while waiting for server response.');
    }
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}
