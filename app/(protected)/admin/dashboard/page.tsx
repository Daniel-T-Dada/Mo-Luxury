"use client";

import { useAdminData } from "@/hooks/use-admin-data";
import AdminStats from "@/components/admin/AdminStats";
import OrdersTable from "@/components/admin/OrdersTable";
import ProductList from "@/components/seller/ProductList";
import { UsersTable } from "@/components/admin/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  // The hook provides everything: data AND actions
  const {
    orders,
    products,
    users,
    financials,
    isLoading,
    user,
    deleteProduct // We get the function from here now
  } = useAdminData();

  if (!user || isLoading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <Link href="/seller/products/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Note: We use financials.totalEarnings for the main revenue stat */}
      <AdminStats
        revenue={financials.totalEarnings}
        ordersCount={orders.length}
        productsCount={products.length}
        usersCount={users.length}
      />

      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="inventory">All Inventory</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersTable orders={orders} />
        </TabsContent>

        <TabsContent value="inventory">
          <ProductList
            products={products}
            onDelete={deleteProduct} // Pass the hook function directly
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