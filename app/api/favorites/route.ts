import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch Favorites
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const expand = searchParams.get("_expand");

    if (!userId) return NextResponse.json([]);

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: Number(userId) },
            include: {
                // If frontend asks for product details (Favorites Page), give it.
                // Otherwise (Context), just give the IDs (implied).
                product: expand === "product"
            }
        });

        // Optimization: If we just need IDs for the Context
        if (!expand) {
            return NextResponse.json(favorites.map(f => f.productId));
        }

        return NextResponse.json(favorites);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

// POST: Toggle Favorite (Add/Remove)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, productId } = body;

        // 1. Check if it exists
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: { // Uses the @@unique constraint
                    userId: Number(userId),
                    productId: Number(productId)
                }
            }
        });

        if (existing) {
            // 2. Remove if exists
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ action: "removed", productId });
        } else {
            // 3. Add if new
            await prisma.favorite.create({
                data: {
                    userId: Number(userId),
                    productId: Number(productId)
                }
            });
            return NextResponse.json({ action: "added", productId });
        }
    } catch (error) {
        return NextResponse.json({ error: "Toggle failed" }, { status: 500 });
    }
}