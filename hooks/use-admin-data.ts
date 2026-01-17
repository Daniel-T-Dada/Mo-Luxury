"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAdminData() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState({
        orders: [],
        products: [],
        users: [],
        stats: {
            ordersCount: 0,
            productsCount: 0,
            usersCount: 0,
            totalRevenue: 0
        }
    });

    // 1. Redirect if not Admin
    useEffect(() => {
        if (user && user.role !== "admin") router.push("/");
    }, [user, router]);

    // 2. Fetch Data
    const fetchData = async () => {
        if (!user || user.role !== "admin") return;

        try {
            // Parallel Fetching for speed
            const [stats, orders, products, users] = await Promise.all([
                apiRequest("/admin/stats"),
                apiRequest("/orders"), // Returns all orders (admin view)
                apiRequest("/products"), // Returns all products
                apiRequest("/users")     // Returns all users
            ]);

            setData({
                stats,
                orders,
                products,
                users
            });
        } catch (error) {
            console.error("Admin load error", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // 3. Actions
    const deleteProduct = async (id: number) => {
        if (!confirm("Admin: Delete this product?")) return;
        try {
            await apiRequest(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted");
            fetchData(); // Refresh list
        } catch (e) {
            toast.error("Delete failed");
        }
    };

    return { ...data, isLoading, user, deleteProduct };
}