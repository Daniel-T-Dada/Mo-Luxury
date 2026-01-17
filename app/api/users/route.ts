import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/users
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    const where: any = {};
    if (email) where.email = email;
    if (password) where.password = password;

    try {
        const users = await prisma.user.findMany({
            where,
            orderBy: {
                createdAt: 'desc' // 👈 Show newest users at the top for Admin
            },
            // 👇 SECURITY UPDATE: Only return safe fields!
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                // We deliberately exclude 'password' here
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// POST /api/users (Register) - Stays the same, this is good.
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const existing = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existing) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password, // In a real app, hash this!
                name: body.name,
                role: body.role || "buyer",
            },
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}