

import { apiRequest } from "@/lib/api";

export async function processCheckout(userId: number, items: any[], total: number, shippingDetails: any) {
    try {
        // 1. Create the Order in DB
        const orderData = {
            userId,
            items, // Save snapshot of items
            total,
            status: "pending", // pending, processing, delivered
            date: new Date().toISOString(),
            shipping: shippingDetails,
        };

        await apiRequest("/orders", {
            method: "POST",
            body: JSON.stringify(orderData),
        });

        // 2. Clear the Cart (json-server requires deleting items one by one)
        // We use Promise.all to do it in parallel so it's fast
        const deletePromises = items.map((item) =>
            apiRequest(`/carts/${item.id}`, { method: "DELETE" })
        );

        await Promise.all(deletePromises);

        return { success: true };
    } catch (error) {
        console.error("Checkout failed:", error);
        throw error;
    }
}