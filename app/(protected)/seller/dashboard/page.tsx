"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSellerDashboard } from "@/hooks/use-seller-dashboard";
import ProductList  from "@/components/seller/ProductList";
import { DashboardStats } from "@/components/seller/DashboardStats";

export default function SellerDashboard() {
    const {
        products,
        totalRevenue,
        totalOrders,
        isLoading,
        deleteProduct,
        user
    } = useSellerDashboard();

    if (!user || isLoading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                <Link href="/seller/products/add">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Stats Section - Now handled entirely by the component */}
            <DashboardStats
                totalRevenue={totalRevenue}
                totalOrders={totalOrders}
                totalProducts={products.length}
            />

            {/* Inventory Section */}
            <ProductList
                products={products}
                onDelete={(id) => {
                    // Keep the confirmation logic here or move to hook depending on preference
                    // Ideally, the hook's deleteProduct should handle the confirm if you want pure logic there.
                    if (confirm("Are you sure?")) deleteProduct(id);
                }}
            />
        </div>
    );
}