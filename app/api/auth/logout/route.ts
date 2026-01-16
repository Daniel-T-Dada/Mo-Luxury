import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    // Destroy the cookies
    (await cookies()).delete("session_token");
    (await cookies()).delete("user_role");

    return NextResponse.json({ message: "Logged out" });
}