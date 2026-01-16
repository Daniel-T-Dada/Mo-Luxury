import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/favorites?userId=1&_expand=product
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const expand = searchParams.get("_expand"); // Check if frontend asks for product details
    const productId = searchParams.get("productId");

    if (!userId) {
        return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const where: any = {
        userId: Number(userId),
    };

    if (productId) {
        where.productId = Number(productId);
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where,
            include: {
                product: expand === "product" // Only fetch product details if requested
            }
        });
        return NextResponse.json(favorites);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }
}

// POST /api/favorites
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check if already exists to prevent duplicates
        const existing = await prisma.favorite.findFirst({
            where: {
                userId: body.userId,
                productId: body.productId
            }
        });

        if (existing) {
            return NextResponse.json(existing); // Return existing if duplicate
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: body.userId,
                productId: body.productId
            }
        });

        return NextResponse.json(favorite);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
    }
}