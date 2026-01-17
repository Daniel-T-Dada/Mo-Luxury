import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/lib/db";
import { Campaign, Product } from "./generated/prisma/browser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0, // No decimal if whole number (cleaner)
    maximumFractionDigits: 0, // Change to 2 if you want to see kobo (e.g. ₦1,500.50)
  }).format(amount);
}



// Helper type: A product that includes its campaign relation
type ProductWithCampaign = Product & { campaign?: Campaign | null };

export function getProductPrice(product: ProductWithCampaign) {
  const now = new Date();

  // 1. Check if product has a campaign attached
  if (product.campaign && product.campaign.isActive) {

    // 2. Check if we are inside the date window
    const start = new Date(product.campaign.startDate);
    const end = new Date(product.campaign.endDate);

    if (now >= start && now <= end) {
      // 3. Calculate Discount
      const discountAmount = product.price * (product.campaign.discount / 100);
      return {
        original: product.price,
        final: product.price - discountAmount,
        discountPercentage: product.campaign.discount,
        isOnSale: true
      };
    }
  }

  // No sale? Return normal price.
  return {
    original: product.price,
    final: product.price,
    discountPercentage: 0,
    isOnSale: false
  };
}