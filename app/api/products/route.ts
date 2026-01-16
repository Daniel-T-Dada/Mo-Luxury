

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";


// GET /api/products (Replaces json-server GET /products)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    const limit = searchParams.get("_limit"); // Frontend sends ?_limit=4
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");

    // 2. Build the "Where" filter dynamically
    const where: any = {};
    if (sellerId) where.sellerId = Number(sellerId);
    if (category) where.category = category;
    if (gender) where.gender = gender;

    try {
        const products = await prisma.product.findMany({
            where,
            take: limit ? Number(limit) : undefined,
            orderBy: { id: 'desc' } // Newest first
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

// POST /api/products (Replaces json-server POST /products)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                price: Number(body.price),
                category: body.category,
                gender: body.gender,
                image: body.image,
                sellerId: body.sellerId,
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}