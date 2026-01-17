import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
            <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center text-center">
                    <div className="mb-6 rounded-full bg-primary/10 p-6 ring-4 ring-primary/5">
                        <CheckCircle2 className="h-16 w-16 text-primary" />
                    </div>

                    <h1 className="mb-2 text-3xl font-bold tracking-tight">Order Confirmed!</h1>
                    <p className="mb-8 text-muted-foreground text-lg">
                        Thank you for your purchase. We have received your order and are getting it ready!
                    </p>

                    <div className="flex w-full flex-col gap-3 sm:flex-row justify-center">
                        <Link href="/orders" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full gap-2">
                                <Package className="h-4 w-4" /> View Order
                            </Button>
                        </Link>
                        <Link href="/shop" className="w-full sm:w-auto">
                            <Button className="w-full gap-2">
                                <ShoppingBag className="h-4 w-4" /> Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}