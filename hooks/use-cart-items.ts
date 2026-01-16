

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface CartItem {
    id: number; // This is the ID of the CART ENTRY, not the product
    productId: number;
    quantity: number;
    product: { // Expanded details
        name: string;
        price: number;
        image: string;
        category: string;
    };
}

export function useCartItems() {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 1. Fetch Items
    const fetchCart = async () => {
        setIsLoading(true);
        try {
            if (!user) {
                // GUEST: Read LocalStorage
                // Note: In localStorage, we store the whole object, so we map it to match the DB structure
                const local = JSON.parse(localStorage.getItem("cart") || "[]");
                const formatted = local.map((item: any) => ({
                    id: item.id, // For guest, cartId = productId roughly
                    productId: item.id,
                    quantity: item.quantity,
                    product: item // The item itself contains the details
                }));
                setItems(formatted);
            } else {
                // USER: Fetch from Backend with _expand
                // GET /carts?userId=1&_expand=product
                const data = await apiRequest(`/carts?userId=${user.id}&_expand=product`);
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to load cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
        // Listen for updates (from adding items elsewhere)
        window.addEventListener("cart-updated", fetchCart);
        return () => window.removeEventListener("cart-updated", fetchCart);
    }, [user]);

    // 2. Remove Item
    const removeItem = async (cartId: number, productId: number) => {
        // Optimistic Update
        setItems((prev) => prev.filter((item) => item.id !== cartId && item.productId !== productId));

        try {
            if (!user) {
                // GUEST
                const local = JSON.parse(localStorage.getItem("cart") || "[]");
                const newLocal = local.filter((item: any) => item.id !== productId);
                localStorage.setItem("cart", JSON.stringify(newLocal));
            } else {
                // USER
                await apiRequest(`/carts/${cartId}`, { method: "DELETE" });
            }
            // Notify Nav to update badge
            window.dispatchEvent(new Event("cart-updated"));
            window.dispatchEvent(new Event("storage"));
            router.refresh();
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to remove item");
            fetchCart(); // Revert on error
        }
    };

    // 3. Update Quantity (Simple Toggle)
    const updateQuantity = async (cartId: number, productId: number, newQty: number) => {
        if (newQty < 1) return;

        // Optimistic
        setItems((prev) =>
            prev.map(item => (item.id === cartId || (item.productId === productId && !user))
                ? { ...item, quantity: newQty }
                : item
            )
        );

        try {
            if (!user) {
                // GUEST
                const local = JSON.parse(localStorage.getItem("cart") || "[]");
                const target = local.find((item: any) => item.id === productId);
                if (target) target.quantity = newQty;
                localStorage.setItem("cart", JSON.stringify(local));
            } else {
                // USER
                await apiRequest(`/carts/${cartId}`, {
                    method: "PATCH", // Use PATCH to only update quantity
                    body: JSON.stringify({ quantity: newQty }),
                });
            }
            window.dispatchEvent(new Event("cart-updated"));
            window.dispatchEvent(new Event("storage"));
        } catch (error) {
            console.error(error);
            fetchCart();
        }
    };

    return { items, isLoading, removeItem, updateQuantity };
}