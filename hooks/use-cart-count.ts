

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export function useCartCount() {
    const { user } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        // 1. Define the fetcher logic
        const fetchCount = async () => {
            if (!user) {
                // GUEST: Read LocalStorage
                const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
                setCount(localCart.length);
            } else {
                // USER: Fetch from Backend
                // Note: json-server returns the array, so we check .length
                try {
                    // We assume your 'carts' endpoint returns all items for the user
                    // Optimization: Ideally backend returns { count: 5 }, but json-server is simple.
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts?userId=${user.id}`);
                    const data = await res.json();
                    setCount(data.length);
                } catch (e) {
                    console.error(e);
                }
            }
        };

        fetchCount();

        // 2. Listen for "storage" events (triggered by our useCartAction hook)
        const handleStorageChange = () => fetchCount();
        window.addEventListener("storage", handleStorageChange);

        // Custom event for when we add via API (since storage event is only for localstorage)
        window.addEventListener("cart-updated", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("cart-updated", handleStorageChange);
        };
    }, [user]); // Re-run if user logs in/out

    return count;
}