import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db"; // Use our DB connection
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existingUser) {
            return NextResponse.json({ message: "Email already taken" }, { status: 400 });
        }

        // 2. Create the User in Neon
        // FIX: Hash the password before saving to Neon
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                role: "buyer", // Default to buyer, or use body.role if your form allows selecting it
            }
        });

        // 3. Generate Token (Same logic as Login)
        // We create the token manually since json-server-auth is gone
        const tokenPayload = JSON.stringify({ id: user.id, email: user.email });
        const token = Buffer.from(tokenPayload).toString("base64");

        // 4. Set Cookies
        const cookieStore = await cookies();

        // HttpOnly Cookie
        cookieStore.set({
            name: "session_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        // Public Role Cookie
        cookieStore.set({
            name: "user_role",
            value: user.role,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        // 5. Return User (Remove password from response)
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: "Registration failed" }, { status: 500 });
    }
}