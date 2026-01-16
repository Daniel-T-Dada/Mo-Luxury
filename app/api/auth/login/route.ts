import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("🔍 Login Attempt:", body.email); // Log the email being tried

    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user) {
        console.log("❌ User not found in database");
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("✅ User found. ID:", user.id);
    // console.log("🔑 Stored Hash:", user.password); // Uncomment if you really need to check the hash

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    const isPlainMatch = user.password === body.password;

    console.log("🔒 Bcrypt Match:", isPasswordValid);
    console.log("📝 Plain Text Match:", isPlainMatch);

    if (!isPasswordValid && !isPlainMatch) {
      console.log("⛔ Password mismatch");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("🎉 Login Successful!");

    // ... (Keep your Token and Cookie logic exactly as it was) ...
    // ... Copy the rest of the file from the previous step ...
    
    // --- Re-pasting the token logic for clarity ---
    const tokenPayload = JSON.stringify({ id: user.id, email: user.email });
    const token = Buffer.from(tokenPayload).toString("base64");

    const cookieStore = await cookies();
    cookieStore.set({
        name: "session_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set({
        name: "user_role",
        value: user.role,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error("💥 Login Error Detailed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}