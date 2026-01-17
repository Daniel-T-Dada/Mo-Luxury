"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";

export interface Order {
    id: number;
    total: number;
    status: string;
    date: string; // Mapped from createdAt
    items: Array<{
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
        product: {
            name: string;
            image: string;
            price: number;
            category: string;
        };
    }>;
    shipping: {
        address: string;
        city: string;
        phone?: string; // Made optional to match type safety
    };
}

export function useOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Don't fetch if no user
        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                // ✅ CLEAN URL: Sorting is now handled by the Backend
                const data = await apiRequest(`/orders?userId=${user.id}`);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    return { orders, isLoading, user };
}