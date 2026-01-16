// lib/fetcher.ts (Conceptual Code)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher(endpoint: string, options: RequestInit = {}) {
    // 1. Get token if it exists (for protected routes)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // 2. Set default headers
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // Attach token if we have one
        ...options.headers,
    };

    // 3. Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 4. Handle Errors (Fetch doesn't throw on 4xx or 5xx automatically)
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    // 5. Return JSON
    return response.json();
}