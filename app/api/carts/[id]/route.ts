import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 👇 Update the Type Definition here
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // 1. Change type to Promise
) {
    const { id } = await params; // 2. Await the params

    try {
        await prisma.cartItem.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}

// 👇 Do the same for PATCH
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // 1. Change type to Promise
) {
    const { id } = await params; // 2. Await the params
    const body = await req.json();

    try {
        const updated = await prisma.cartItem.update({
            where: { id: Number(id) },
            data: { quantity: body.quantity }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}