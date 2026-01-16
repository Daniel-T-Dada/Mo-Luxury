

// We no longer need the proxy. We point directly to our own API routes.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Logic: Ensure the endpoint starts with '/'
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    // Request goes to: http://localhost:3000/api/products (or whatever your domain is)
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Handle cases where the server returns text instead of JSON (like 404 or 500)
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Request failed");
    }

    // Handle empty responses (like 204 No Content from DELETE)
    if (response.status === 204) return null;

    return response.json();
}