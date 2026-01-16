

import Link from "next/link";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ProductListProps {
    products: any[];
    onDelete: (id: number) => void;
}

const ProductList = ({ products, onDelete }: ProductListProps) => {
    return (
        <Card className="overflow-hidden border-border bg-card">
            <CardHeader>
                <CardTitle className="text-foreground">My Inventory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">
                                    <div className="flex flex-col">
                                        <span>{product.name}</span>
                                        <span className="md:hidden text-xs text-muted-foreground">{formatCurrency(product.price)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-foreground">
                                    {formatCurrency(product.price)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                                <span className="sr-only">Open menu</span>
                                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-popover border-border">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/seller/products/edit/${product.id}`} className="cursor-pointer flex items-center">
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                onClick={() => onDelete(product.id)}
                                            >
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {products.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        You haven't listed any products yet.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
export default ProductList;