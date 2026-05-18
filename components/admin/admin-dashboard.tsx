"use client";

import { useState } from "react";
import { FinancialStats } from "./financial-stats";
import { RevenueChart } from "./revenue-chart";
import { CategoryChart } from "./category-chart";
import { OrderTrendsChart } from "./order-trends-chart";
import { ProductManagement } from "./product-management";
import { OrderManagement } from "./order-management";
import { RecentOrders } from "./recent-orders";
import { InventoryAlerts } from "./inventory-alerts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Star,
  Settings,
} from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-[#003366] dark:text-[#00AEEF]">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your business operations and view analytics.</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package size={16} />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Stats */}
          <FinancialStats />

          {/* AI Insight Banner */}
          <div className="bg-gradient-to-r from-[#003366] to-[#00AEEF] text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <Star className="fill-yellow-300 text-yellow-300" size={20} />
              </div>
              <span className="font-bold text-lg">AI Business Insight</span>
            </div>
            <p className="text-white/90 mt-3">
              Revenue growth of <strong>+18.2%</strong> projected for next quarter. Consider increasing apparel inventory
              before the November holiday season. Business cards and flyers show strong demand patterns.
            </p>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <CategoryChart />
          </div>

          {/* Recent Orders & Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders />
            <InventoryAlerts />
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <OrderManagement />
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <ProductManagement />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <FinancialStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <OrderTrendsChart />
          </div>
          <CategoryChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
