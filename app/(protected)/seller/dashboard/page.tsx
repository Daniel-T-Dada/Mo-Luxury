"use client";

import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSellerDashboard } from "@/hooks/use-seller-dashboard";
import ProductList from "@/components/seller/ProductList";
import { DashboardStats } from "@/components/seller/DashboardStats";

export default function SellerDashboard() {
    const {
        products,
        totalRevenue,
        totalOrders,
        totalProducts, // 👈 New field
        isLoading,
        deleteProduct,
        user
    } = useSellerDashboard();

    if (!user || isLoading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
                    <p className="text-muted-foreground">Monitor your sales and manage your inventory.</p>
                </div>
                <Link href="/seller/products/add">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add New Product
                    </Button>
                </Link>
            </div>

            <DashboardStats
                totalRevenue={totalRevenue}
                totalOrders={totalOrders}
                totalProducts={totalProducts}
            />

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">My Inventory</h2>
                <ProductList
                    products={products}
                    onDelete={(id) => {
                        if (confirm("Are you sure you want to delete this product?")) {
                            deleteProduct(id);
                        }
                    }}
                />
            </div>
        </div>
    );
}