

import { ProductForm } from "@/components/seller/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardBackButton } from "@/components/shared/DashboardBackButton";

export default function AddProductPage() {
    return (
        <div className="container mx-auto max-w-lg px-4 py-8">
            <div className="mb-6 flex items-center gap-4">
                <DashboardBackButton />
                <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
            </div>

            <ProductForm />
        </div>
    );
}