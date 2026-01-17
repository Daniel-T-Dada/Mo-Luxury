import { prisma } from "@/lib/db";
import { Product } from "../generated/prisma/client";

// 1. Get Featured (Trending) Products
export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            take: 4,                      // Limit to 4
            orderBy: { createdAt: 'desc' }, // 👈 SORTING LOGIC HERE (Newest First)
            where: {
                stock: { gt: 0 }          // Optional: Only show items in stock
            },
            include: {
                campaign: true,
            }
        });
        return products;
    } catch (e) {
        console.error("Product service error:", e);
        return [];
    }
}

// 2. Get Products with Filters (Shop Page)
export async function getProducts(filters: Record<string, string> = {}) {
    try {
        // Build the "Where" clause dynamically
        const where: any = {};

        if (filters.category) where.category = filters.category;
        if (filters.gender) where.gender = filters.gender;

        // Handle search query if you have one
        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        const products = await prisma.product.findMany({
            where: where,
            orderBy: { createdAt: 'desc' }, // Always show newest first in shop too
        });

        return products;
    } catch (e) {
        console.error("Filter error:", e);
        return [];
    }
}

// 3. Get Single Product (Product Details Page)
export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }, 
            include: {
                seller: { 
                    select: { name: true, email: true }
                },
                campaign: true,
            }
        });
        return product;
    } catch (error) {
        console.error("Failed to fetch product", error);
        return null;
    }
}

// 👇 ADD THIS NEW FUNCTION
export async function getFlashSaleProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                campaign: {
                    isActive: true, // Only fetch items with an active campaign
                },
                stock: { gt: 0 }
            },
            take: 4,
            include: {
                campaign: true, // IMPORTANT
            },
            orderBy: {
                campaign: {
                    discount: 'desc' // Show highest discounts first
                }
            }
        });
        return products;
    } catch (e) {
        console.error("Flash sale error:", e);
        return [];
    }
}