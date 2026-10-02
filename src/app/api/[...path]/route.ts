import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL || process.env.BACKEND_API_URL || 'https://swaddesh.onrender.com';

async function handleProxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;
    const targetUrl = `${backendUrl.replace(/\/$/, '')}${pathname}${search}`;

    const hopByHopHeaders = new Set([
        'host',
        'origin',
        'referer',
        'content-length',
        'connection',
        'keep-alive',
        'transfer-encoding',
        'expect',
        'accept-encoding',
    ]);

    const headers = new Headers();
    request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (!hopByHopHeaders.has(lowerKey)) {
            headers.set(key, value);
        }
    });

    // Explicitly set allowed origin for Spring Boot @CrossOrigin
    headers.set('Origin', 'https://swaddesh.in');

    const method = request.method;
    const hasBody = method !== 'GET' && method !== 'HEAD';

    let bodyData: Uint8Array | undefined = undefined;
    if (hasBody) {
        try {
            const buf = await request.arrayBuffer();
            if (buf && buf.byteLength > 0) {
                bodyData = new Uint8Array(buf);
            }
        } catch (e) {
            console.warn('[PROXY_WARN] Failed to read request body:', e);
        }
    }

    const maxRetries = (method === 'GET' || method === 'HEAD') ? 2 : 1;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const fetchOptions: any = {
                method,
                headers,
                redirect: 'manual',
                signal: AbortSignal.timeout(45000),
            };
            if (bodyData) {
                fetchOptions.body = bodyData;
                fetchOptions.duplex = 'half';
            }

            const backendResponse = await fetch(targetUrl, fetchOptions);

            // If Render is cold-starting, it may return 502 or 503 briefly; wait and retry
            if ((backendResponse.status === 502 || backendResponse.status === 503 || backendResponse.status === 504) && attempt < maxRetries) {
                console.warn(`[API_PROXY_RETRY] ${method} ${targetUrl} returned ${backendResponse.status}. Retrying in 1.5s (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise(r => setTimeout(r, 1500));
                continue;
            }

            const resBody = await backendResponse.arrayBuffer();
            const responseHeaders = new Headers(backendResponse.headers);
            responseHeaders.delete('content-encoding');
            responseHeaders.delete('content-length');

            return new Response(resBody, {
                status: backendResponse.status,
                statusText: backendResponse.statusText,
                headers: responseHeaders,
            });
        } catch (err: any) {
            lastError = err;
            if (attempt < maxRetries) {
                console.warn(`[API_PROXY_RETRY] ${method} ${targetUrl} error: ${err?.message}. Retrying in 1.5s...`);
                await new Promise(r => setTimeout(r, 1500));
                continue;
            }
        }
    }

    console.error(`[API_PROXY_ERROR] ${method} ${targetUrl}:`, lastError);

    return NextResponse.json(
        { error: 'Backend gateway connection failed', message: lastError?.message },
        { status: 502 }
    );
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const HEAD = handleProxy;
export const OPTIONS = handleProxy;
