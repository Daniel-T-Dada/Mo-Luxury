import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // 👇 REMOVED THE STRICT CHECK HERE
    // if (!userId) { return NextResponse.json({ error: "User ID required" }, { status: 400 }); }

    try {
        // 1. Build the filter dynamically
        const whereClause: any = {};
        if (userId) {
            whereClause.userId = Number(userId);
        }

        // 2. Fetch Orders (Either specific user's OR all of them)
        const orders = await prisma.order.findMany({
            where: whereClause, // If empty, it fetches everything
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // 3. Format the data
        const formattedOrders = orders.map(order => ({
            ...order,
            date: order.createdAt.toISOString(),
            shipping: {
                address: order.shippingAddress,
                city: order.shippingCity,
                phone: order.shippingPhone
            }
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST remains the same...
export async function POST(req: Request) {
    // ... your existing POST logic
    try {
        const body = await req.json();
        const { userId, items, total, shipping } = body;

        // Transaction: Create Order -> Create OrderItems -> Clear Cart
        const result = await prisma.$transaction(async (tx) => {
            // A. Create the Order
            const newOrder = await tx.order.create({
                data: {
                    userId: Number(userId),
                    total: total,
                    status: "processing",
                    shippingAddress: shipping.address,
                    shippingCity: shipping.city,
                    shippingPhone: shipping.phone,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId, // OR item.product.id depending on what you pass
                            quantity: item.quantity,
                            price: item.product.price, // Save the CURRENT price
                            selectedSize: item.selectedSize,
                            selectedColor: item.selectedColor,
                        })),
                    },
                },
            });

            // B. Clear the User's Cart
            await tx.cartItem.deleteMany({
                where: { userId: Number(userId) },
            });

            // C. Decrease Stock (Optional, but good practice)
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        sold: { increment: item.quantity }
                    }
                });
            }

            return newOrder;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}