const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Fetch wrapper for connecting to the custom backend API.
 * Uses NEXT_PUBLIC_API_URL as the base URL.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Retrieve token from local storage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed [${url}]: ${response.status} ${response.statusText}`);
  }

  // Handle No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
