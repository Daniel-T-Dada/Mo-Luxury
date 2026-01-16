import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    const body = await request.json();

    // 1. Forward registration to json-server
    const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json({ message: data }, { status: res.status });
    }

    // 2. Set the HttpOnly Cookie (Same as Login)
    const token = data.accessToken;
    const user = data.user;

    (await cookies()).set({
        name: "session_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Optional: Set Role cookie for middleware checks
    (await cookies()).set({
        name: "user_role",
        value: user.role,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user });
}