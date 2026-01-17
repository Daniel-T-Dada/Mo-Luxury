import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId) return NextResponse.json({ error: "Seller ID required" }, { status: 400 });

    try {
        // 1. Fetch ALL items sold by this seller
        const soldItems = await prisma.orderItem.findMany({
            where: {
                product: { sellerId: Number(sellerId) }
            },
            select: {
                price: true,
                quantity: true
            }
        });

        // 2. Calculate Revenue (Price * Qty)
        const totalRevenue = soldItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalOrders = soldItems.length; // Number of items sold

        // 3. Count Inventory
        const totalProducts = await prisma.product.count({
            where: { sellerId: Number(sellerId) }
        });

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            totalProducts
        });
    } catch (error) {
        return NextResponse.json({ error: "Seller stats failed" }, { status: 500 });
    }
}