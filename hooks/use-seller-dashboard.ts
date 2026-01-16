

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSellerDashboard() {
    const { user } = useAuth();
    const router = useRouter();

    const [data, setData] = useState({
        products: [],
        totalRevenue: 0,
        totalOrders: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.role !== "seller" && user.role !== "admin")) {
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch My Products
                const myProducts = await apiRequest(`/products?sellerId=${user.id}`);

                // 2. Fetch ALL Orders (json-server limitation: we must fetch all to filter)
                // In a real DB, you would do: GET /orders?items.product.sellerId=1
                const allOrders = await apiRequest("/orders");

                // 3. Calculate Revenue
                let revenue = 0;
                let orderCount = 0;

                allOrders.forEach((order: any) => {
                    let hasMyProduct = false;

                    order.items.forEach((item: any) => {
                        // Check if this specific item belongs to ME
                        if (item.product.sellerId === user.id) {
                            revenue += item.product.price * item.quantity;
                            hasMyProduct = true;
                        }
                    });

                    if (hasMyProduct) orderCount++;
                });

                setData({
                    products: myProducts,
                    totalRevenue: revenue,
                    totalOrders: orderCount
                });

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const deleteProduct = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await apiRequest(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted");
            // Reload logic would go here or use a reload trigger
            window.location.reload();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return { ...data, deleteProduct, isLoading, user };
}