import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        // Run these queries in parallel for speed
        const [ordersCount, productsCount, usersCount, revenueAgg] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.user.count(),
            prisma.order.aggregate({
                _sum: { total: true },
            }),
        ]);

        // Calculate Financials
        const totalRevenue = revenueAgg._sum.total || 0;

        // Hardcoded logic for demo: Admin gets 10% commission on everything + 100% of their own sales.
        // In a real app, you'd query OrderItems specifically. For now, let's estimate Platform Gross.
        const platformFees = totalRevenue * 0.10;

        return NextResponse.json({
            ordersCount,
            productsCount,
            usersCount,
            totalRevenue,
            platformFees
        });
    } catch (error) {
        return NextResponse.json({ error: "Stats failed" }, { status: 500 });
    }
}