

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = [
    { label: "All", value: null }, // Removes filter
    { label: "Men", value: "male" },
    { label: "Women", value: "female" },
    { label: "Kids", value: "kids" }, 
    { label: "Unisex", value: "unisex" },
];

const ShopFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentGender = searchParams.get("gender");

    const handleFilter = (gender: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (gender) {
            params.set("gender", gender);
        } else {
            params.delete("gender");
        }

        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {FILTERS.map((filter) => (
                <Button
                    key={filter.label}
                    variant={currentGender === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilter(filter.value)}
                    className={cn(
                        "rounded-full px-6 transition-all",
                        currentGender === filter.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted"
                    )}
                >
                    {filter.label}
                </Button>
            ))}
        </div>
    );
}
export default ShopFilters;