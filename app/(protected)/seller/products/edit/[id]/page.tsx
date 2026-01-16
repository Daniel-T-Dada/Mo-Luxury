


import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api"; // You might need a server-side fetch helper or just use fetch directly
import { ProductForm } from "@/components/seller/ProductForm";
import { DashboardBackButton } from "@/components/shared/DashboardBackButton";

// Server Component
export default async function EditProductPage({ params }: { params: { id: string } }) {
    // Fetch existing data
    const { id } = await params
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let product = null;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
        if (res.ok) product = await res.json();
    } catch (error) {
        console.error("Failed to load product", error);
    }

    if (!product) {
        return <div className="p-8 text-center">Product not found</div>;
    }

    return (
        <div className="container mx-auto max-w-lg px-4 py-8">
            <div className="mb-6 flex items-center gap-4">
                <DashboardBackButton />
                <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
            </div>

            <ProductForm initialData={product} />
        </div>
    );
}