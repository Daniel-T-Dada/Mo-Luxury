import { apiRequest } from "@/lib/api";

export async function processCheckout(userId: number, items: any[], total: number, shipping: any) {
    // Call our new Next.js API
    const response = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
            userId,
            items,
            total,
            shipping,
        }),
    });

    return response;
}