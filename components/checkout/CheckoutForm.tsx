

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

interface CheckoutFormProps {
    user: any;
    formData: { address: string; city: string; phone: string };
    setFormData: (data: any) => void;
}

export function CheckoutForm({ user, formData, setFormData }: CheckoutFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" /> Shipping Details
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user?.name || ""} disabled className="bg-muted text-muted-foreground" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        placeholder="08012345678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="focus-visible:ring-primary"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        placeholder="123 Street Name"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="focus-visible:ring-primary"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="city">City / State</Label>
                    <Input
                        id="city"
                        placeholder="Lagos"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        className="focus-visible:ring-primary"
                    />
                </div>
            </CardContent>
        </Card>
    );
}