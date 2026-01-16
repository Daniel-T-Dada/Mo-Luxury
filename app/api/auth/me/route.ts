import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        // 1. Get the session token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Decode the token (Reverse of what we did in Login)
        const decodedStr = Buffer.from(token, "base64").toString("utf-8");
        const sessionData = JSON.parse(decodedStr);

        // 3. Fetch User from DB to ensure they still exist
        const user = await prisma.user.findUnique({
            where: { id: sessionData.id }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 401 });
        }

        // 4. Return user info
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }
}