

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Note: params is a Promise in Next.js 15
) {
    const { id } = await params;

    try {
        await prisma.favorite.delete({
            where: { id: Number(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}