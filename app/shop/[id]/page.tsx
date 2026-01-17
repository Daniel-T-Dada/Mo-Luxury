import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, getProductPrice } from "@/lib/utils"; // 👈 New Price Logic
import { getProductById } from "@/lib/services/products";
import { ProductForm } from "@/components/product/ProductForm"; // 👈 New Client Form

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
    // 1. Fetch Data
    const { id } = await params;
    const product = await getProductById(id);

    

    // 2. Handle 404
    if (!product) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/shop">
                    <Button>Back to Shop</Button>
                </Link>
            </div>
        );
    }

    // 3. Calculate Real Price (Check for active Flash Sales)
    const { final, original, isOnSale, discountPercentage } = getProductPrice(product);

    // 👇 TEMPORARY DEBUGGING
    console.log("DEBUG PRODUCT:", {
        name: product.name,
        hasCampaign: !!product.campaign,
        campaignActive: product.campaign?.isActive,
        startDate: product.campaign?.startDate,
        endDate: product.campaign?.endDate,
        serverTime: new Date(),
        calculatedSale: isOnSale
    });

    return (
        <div className="container px-4 py-8 max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/shop" className="mb-6 inline-block">
                <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="h-4 w-4" /> Back to Shop
                </Button>
            </Link>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-16">

                {/* LEFT: Image Section */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-muted aspect-3/4 md:aspect-square group">
                    {/* Sale Badge */}
                    {isOnSale && (
                        <Badge variant="destructive" className="absolute top-4 left-4 z-10 px-3 py-1 text-sm font-bold shadow-sm">
                            -{discountPercentage}% OFF
                        </Badge>
                    )}

                    {/* Optimized Image */}
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        priority // Load this image immediately
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* RIGHT: Details Section */}
                <div className="flex flex-col justify-center">

                    {/* Header Info */}
                    <div className="mb-6">
                        <div className="flex gap-2 mb-3">
                            <Badge variant="secondary" className="capitalize px-3 py-1">
                                {product.gender}
                            </Badge>
                            <Badge variant="outline" className="capitalize px-3 py-1">
                                {product.category}
                            </Badge>
                            {/* Show Age Group only if it's for kids */}
                            {product.ageGroup === 'kids' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Kids
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl font-extrabold text-foreground md:text-5xl leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        {/* Ratings (Static for now) */}
                        <div className="mt-3 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground font-medium">(4.9 reviews)</span>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 flex items-baseline gap-4">
                        <p className="text-4xl font-bold text-primary">
                            {formatCurrency(final)}
                        </p>
                        {isOnSale && (
                            <div className="flex flex-col items-start">
                                <p className="text-lg text-muted-foreground line-through decoration-destructive/50">
                                    {formatCurrency(original)}
                                </p>
                                <p className="text-xs text-destructive font-medium animate-pulse">
                                    Flash Sale Active!
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator className="mb-8" />

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                            {product.description || `Elevate your style with the ${product.name}. Crafted with premium materials designed for comfort and durability.`}
                        </p>
                    </div>

                    {/* Interactive Form (Size, Color, Add to Cart) */}
                    <div className="mt-auto">
                        <ProductForm product={product} />
                    </div>

                </div>
            </div>
        </div>
    );
}