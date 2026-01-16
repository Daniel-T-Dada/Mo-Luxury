import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/orders (Supports ?userId=... and sorting)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const sort = searchParams.get("_sort"); // Support json-server style sorting if needed

    const where = userId ? { userId: Number(userId) } : {};

    try {
        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: { product: true } // Include product details in the order items
                }
            },
            orderBy: {
                date: 'desc' // Default to newest first
            }
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST /api/orders (Create Order + Items)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Ensure body.items exists and map it correctly for Prisma
        // Assuming body.items is: [{ productId: 1, quantity: 2 }, ...]
        const orderItems = body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        const order = await prisma.order.create({
            data: {
                userId: body.userId,
                total: body.total,
                status: "pending",
                shipping: body.shipping ? JSON.stringify(body.shipping) : null, // Handle shipping address if schema allows, or skip
                items: {
                    create: orderItems // This magic line creates all items automatically!
                }
            },
            include: {
                items: true // Return the created items in the response
            }
        });
        
        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}