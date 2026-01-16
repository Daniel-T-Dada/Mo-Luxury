

"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

// 1. Zod Validation Schema
const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    price: z.coerce.number().min(100, "Price must be at least ₦100"), // coerce handles string->number
    category: z.string().min(1, "Please select a category"),
    gender: z.enum(["male", "female", "kids", "unisex"] as const, {
        error: "Please select a gender",
    }),
    image: z.string().url("Please enter a valid image URL"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function useProductForm(existingData?: any) {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // 2. Initialize Form
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
        defaultValues: existingData || {
            name: "",
            price: 0,
            category: "",
            gender: "male",
            image: "",
        },
    });

    // 3. Submit Handler
    const onSubmit = async (values: ProductFormValues) => {
        if (!user) return;
        setIsLoading(true);

        try {
            const payload = {
                ...values,
                sellerId: user.id, // Attach current user ID
            };

            if (existingData?.id) {
                // EDIT MODE
                await apiRequest(`/products/${existingData.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
                toast.success("Product updated successfully");
            } else {
                // CREATE MODE
                await apiRequest("/products", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                toast.success("Product created successfully");
            }

            router.push("/seller/dashboard");
            router.refresh(); // Update the dashboard list
        } catch (error) {
            console.error(error);
            toast.error("Failed to save product");
        } finally {
            setIsLoading(false);
        }
    };

    return { form, onSubmit, isLoading };
}