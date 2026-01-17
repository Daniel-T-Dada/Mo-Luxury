

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        await prisma.cartItem.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
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