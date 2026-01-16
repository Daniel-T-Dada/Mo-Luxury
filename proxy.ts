// proxy.ts (or middleware.ts if on older Next.js)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Your Phone's IP
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Only intercept API calls (excluding our own auth routes)
    if (pathname.startsWith("/api/proxy")) {
        // Remove "/api/proxy" prefix to get the real endpoint (e.g., /products)
        const targetPath = pathname.replace("/api/proxy", "");

        // 2. Prepare the destination URL
        const destinationUrl = new URL(targetPath, BACKEND_URL);
        destinationUrl.search = request.nextUrl.search; // Preserve query params

        // 3. Create a new Headers object to inject the token
        const requestHeaders = new Headers(request.headers);
        const token = request.cookies.get("session_token")?.value;

        if (token) {
            requestHeaders.set("Authorization", `Bearer ${token}`);
        }

        // 4. Rewrite the response (Forward the request silently)
        return NextResponse.rewrite(destinationUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Allow other requests to pass through
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/proxy/:path*"],
};