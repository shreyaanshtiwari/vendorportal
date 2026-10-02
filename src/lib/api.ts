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
 * Includes a 45s timeout to handle Render backend cold starts gracefully.
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

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
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
    if (err.name === 'AbortError') {
      throw new Error('Request timed out after 45s while waiting for server response.');
    }
    throw err;
  }
}
