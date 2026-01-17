import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1. GET: Fetch User Cart
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json([]);

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: Number(userId) },
      include: {
        product: {
          include: {
            campaign: true, // 👈 Needed for Flash Sales
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. POST: Add to Cart (Used by Merge function & Add to Cart button)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, quantity, selectedSize, selectedColor } = body;

    // Check if duplicate
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: Number(userId),
        productId: Number(productId),
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return NextResponse.json(updated);
    } else {
      const newItem = await prisma.cartItem.create({
        data: {
          userId: Number(userId),
          productId: Number(productId),
          quantity: quantity,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
        },
      });
      return NextResponse.json(newItem);
    }
  } catch (error) {
    return NextResponse.json({ error: "Add failed" }, { status: 500 });
  }
}