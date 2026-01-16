import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    // 1. If no token, user is not logged in
    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        // 2. Decode the JWT to find the User ID
        // JWT structure: Header.Payload.Signature
        // We need the Payload (middle part)
        const payloadBase64 = token.split('.')[1];

        // Convert base64 to string
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
        const payload = JSON.parse(decodedJson);

        // In json-server-auth, 'sub' usually holds the User ID as a string or number
        const userId = payload.sub;

        if (!userId) {
            throw new Error("Invalid Token Structure");
        }

        // 3. Fetch the User from Backend
        // We attach the token because the /users endpoint might be protected
        const res = await fetch(`${BACKEND_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            // If the token is invalid or user deleted, clear cookies
            cookieStore.delete("session_token");
            cookieStore.delete("user_role");
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const user = await res.json();

        // 4. Return the User
        return NextResponse.json({ user });

    } catch (error) {
        console.error("Session Check Failed:", error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}