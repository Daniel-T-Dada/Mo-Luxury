import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    const body = await request.json();

    // 1. Call the actual Backend
    const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json({ message: data }, { status: res.status });
    }

    // 2. Get the token
    const token = data.accessToken;
    const user = data.user;

    // 3. Set the HttpOnly Cookie
    // This is the magic part. The browser will receive this and lock it away.
    (await cookies()).set({
        name: "session_token",
        value: token,
        httpOnly: true, // JavaScript cannot read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // We also set a public cookie for the Role so the UI knows what to show
    // (This is safe because changing it manually won't give them admin access on the server)
    (await cookies()).set({
        name: "user_role",
        value: user.role,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user });
}