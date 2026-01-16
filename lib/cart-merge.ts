

import { apiRequest } from "@/lib/api";

export async function mergeLocalCart(userId: number) {
    // 1. Get local items
    const localCartJson = localStorage.getItem("cart");
    if (!localCartJson) return;

    try {
        const localCart = JSON.parse(localCartJson);
        if (!Array.isArray(localCart) || localCart.length === 0) return;

        // 2. Upload each item to the server
        // We map each local item to a POST request promise
        const uploadPromises = localCart.map((item) =>
            apiRequest("/carts", {
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    productId: item.id, // In local cart, the item ID is the product ID
                    quantity: item.quantity
                })
            }).catch(err => console.error("Failed to merge item", item.name, err))
        );

        // 3. Wait for all uploads to finish
        await Promise.all(uploadPromises);

        // 4. Clear local storage so we don't merge them again next time
        localStorage.removeItem("cart");

    } catch (error) {
        console.error("Error during cart merge:", error);
    }
}