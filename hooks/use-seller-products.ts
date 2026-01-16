

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSellerProducts() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Protected Route Check
    useEffect(() => {
        if (user && user.role !== "seller" && user.role !== "admin") {
            router.push("/");
        }
    }, [user, router]);

    const fetchProducts = async () => {
        if (!user) return;
        try {
            const data = await apiRequest(`/products?sellerId=${user.id}`);
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const deleteProduct = async (id: number) => {
        // Optimistic UI could be added here if needed
        try {
            await apiRequest(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted");
            fetchProducts(); // Refresh list
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    return { products, isLoading, deleteProduct, user };
}