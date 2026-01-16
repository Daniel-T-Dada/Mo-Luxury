


import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6 dark:bg-green-900">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                Thank you for your purchase. We have received your order and are processing it.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/orders">
                    <Button variant="outline">View Order</Button>
                </Link>
                <Link href="/shop">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
}