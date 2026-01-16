

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";

export interface Order {
    id: number;
    total: number;
    status: string;
    date: string;
    items: Array<{
        product: {
            name: string;
            image: string;
            price: number; // <--- Added this line
        };
        quantity: number;
    }>;
    shipping: {
        address: string;
        city: string;
    };
}

export function useOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const data = await apiRequest(`/orders?userId=${user.id}&_sort=date&_order=desc`);
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