

import { Calendar, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Order } from "@/hooks/use-orders";

export function OrderCard({ order }: { order: Order }) {
    return (
        <Card className="overflow-hidden border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/40 p-4">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-base font-medium text-foreground">
                        Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(order.date).toLocaleDateString()}
                    </div>
                </div>
                <Badge
                    variant={order.status === "delivered" ? "default" : "secondary"}
                    className="capitalize"
                >
                    {order.status}
                </Badge>
            </CardHeader>

            <CardContent className="p-4">
                <ScrollArea className="max-h-[200px]">
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                    <img
                                        src={item.product.image || "https://placehold.co/100"}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-1 justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-foreground line-clamp-1">
                                            {item.product.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {formatCurrency(item.product.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <Separator className="my-4 bg-border" />

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>
                        {order.shipping.address}, {order.shipping.city}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="bg-muted/20 p-4">
                <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(order.total)}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}