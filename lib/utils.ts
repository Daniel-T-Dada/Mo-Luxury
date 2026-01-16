import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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