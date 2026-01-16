// All requests now go through our Next.js Proxy
const PROXY_URL = "/api/proxy";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // We request /api/proxy/products, and the Proxy forwards it to http://phone:3000/products
    const response = await fetch(`${PROXY_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }

    return response.json();
}