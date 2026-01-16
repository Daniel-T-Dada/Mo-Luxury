import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/users (Supports ?email=... and ?password=... for basic login)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password"); // Note: In real production, use a separate /login route and bcrypt

    const where: any = {};
    if (email) where.email = email;
    if (password) where.password = password;

    try {
        const users = await prisma.user.findMany({ where });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// POST /api/users (Register/Create)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existing) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
                role: body.role || "buyer",
            },
        });

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}