"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSellerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState({
        products: [],
        stats: {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0
        }
    });

    // 1. Guard Clause
    useEffect(() => {
        if (user && user.role !== "seller" && user.role !== "admin") {
            router.push("/");
        }
    }, [user, router]);

    // 2. Fetch Data
    const fetchData = async () => {
        if (!user) return;

        try {
            const [stats, myProducts] = await Promise.all([
                apiRequest(`/seller/stats?sellerId=${user.id}`), // 👈 NEW SMART API
                apiRequest(`/products?sellerId=${user.id}`)      // 👈 Filtered products
            ]);

            setData({
                stats,
                products: myProducts
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // 3. Delete Action
    const deleteProduct = async (id: number) => {
        // Note: Confirm logic is usually handled in the UI component, but we can keep it here for simplicity
        try {
            await apiRequest(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted");
            fetchData(); // Re-fetch to update UI
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return {
        products: data.products,
        totalRevenue: data.stats.totalRevenue,
        totalOrders: data.stats.totalOrders,
        totalProducts: data.stats.totalProducts,
        deleteProduct,
        isLoading,
        user
    };
}