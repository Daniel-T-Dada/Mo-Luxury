

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Next.js 15+ syntax
) {
    const { id } = await params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) } // Convert string "1" to number 1
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}