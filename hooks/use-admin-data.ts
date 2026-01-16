"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const COMMISSION_RATE = 0.10; // 10% Commission on 3rd party sales

export function useAdminData() {
    const { user } = useAuth();
    const router = useRouter();

    const [data, setData] = useState({
        orders: [],
        products: [],
        users: [],
        financials: {
            grossVolume: 0,      // Total money passed through platform
            adminSales: 0,       // Sales of Admin's own items
            commissions: 0,      // 10% of other sellers' items
            totalEarnings: 0     // adminSales + commissions
        }
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== "admin") {
            router.push("/");
        }
    }, [user, router]);

    
        
        const fetchData = async () => {
            if (!user || user.role !== "admin") return;
            try {
                const [orders, products, users] = await Promise.all([
                    apiRequest("/orders?_sort=date&_order=desc"),
                    apiRequest("/products"),
                    apiRequest("/users")
                ]);

                // --- CALCULATE COMMISSIONS ---
                let grossVolume = 0;
                let adminSales = 0;
                let commissions = 0;

                orders.forEach((order: any) => {
                    grossVolume += order.total; // Total checkout value

                    order.items.forEach((item: any) => {
                        const itemTotal = item.product.price * item.quantity;

                        if (item.product.sellerId === user.id) {
                            // 1. Direct Sale (Admin is seller)
                            adminSales += itemTotal;
                        } else {
                            // 2. Commission Sale (Someone else is seller)
                            commissions += (itemTotal * COMMISSION_RATE);
                        }
                    });
                });

                setData({
                    orders,
                    products,
                    users,
                    financials: {
                        grossVolume,
                        adminSales,
                        commissions,
                        totalEarnings: adminSales + commissions
                    }
                });

            } catch (error) {
                console.error("Admin data error", error);
            } finally {
                setIsLoading(false);
            }
        };
    useEffect(() => {
        fetchData();
    }, [user]);

    const deleteProduct = async (id: number) => {
        if (!confirm("Admin: Are you sure you want to delete this product?")) return;
        try {
            await apiRequest(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted successfully");
            // Re-fetch data to update the UI without reloading page
            fetchData();
        } catch (e) {
            toast.error("Failed to delete product");
        }
    };

    return { ...data, isLoading, user, deleteProduct };
}