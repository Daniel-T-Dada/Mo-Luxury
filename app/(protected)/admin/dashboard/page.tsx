"use client";

import { useAdminData } from "@/hooks/use-admin-data";
import AdminStats from "@/components/admin/AdminStats";
import OrdersTable from "@/components/admin/OrdersTable";
import ProductList from "@/components/seller/ProductList";
import { UsersTable } from "@/components/admin/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  const {
    orders,
    products,
    users,
    stats, // 👈 New Structure
    isLoading,
    user,
    deleteProduct
  } = useAdminData();

  if (!user || isLoading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">Manage your platform, users, and inventory.</p>
        </div>

        <Link href="/seller/products/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <AdminStats
        revenue={stats.totalRevenue}
        ordersCount={stats.ordersCount}
        productsCount={stats.productsCount}
        usersCount={stats.usersCount}
      />

      <Tabs defaultValue="orders" className="w-full space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="inventory">All Inventory</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersTable orders={orders} />
        </TabsContent>

        <TabsContent value="inventory">
          <ProductList
            products={products}
            onDelete={deleteProduct}
          />
        </TabsContent>

        <TabsContent value="users">
          <UsersTable users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;