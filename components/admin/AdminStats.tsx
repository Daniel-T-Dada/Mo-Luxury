

import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatsProps {
    revenue: number;
    ordersCount: number;
    productsCount: number;
    usersCount: number;
}

const AdminStats = ({ revenue, ordersCount, productsCount, usersCount }: StatsProps) => {
    const stats = [
        { label: "Total Revenue", value: formatCurrency(revenue), icon: DollarSign },
        { label: "Total Orders", value: ordersCount, icon: ShoppingBag },
        { label: "Products", value: productsCount, icon: Package },
        { label: "Users", value: usersCount, icon: Users },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default AdminStats;