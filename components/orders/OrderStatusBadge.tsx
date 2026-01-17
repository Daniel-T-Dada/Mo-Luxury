

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Package, Truck } from "lucide-react";

interface Props {
    status: string;
}

export function OrderStatusBadge({ status }: Props) {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; className?: string }> = {
        pending: {
            variant: "outline",
            icon: Clock,
            className: "text-yellow-600 border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
        },
        processing: {
            variant: "secondary",
            icon: Package,
            className: "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
        },
        shipped: {
            variant: "secondary",
            icon: Truck,
            className: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
        },
        delivered: {
            variant: "default",
            icon: CheckCircle2,
            className: "bg-green-600 hover:bg-green-700"
        },
        cancelled: {
            variant: "destructive",
            icon: CheckCircle2,
            className: ""
        },
    };

    // Default to pending if status is unknown
    const config = styles[status.toLowerCase()] || styles.pending;
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={`gap-1.5 py-1 px-3 capitalize ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {status}
        </Badge>
    );
}