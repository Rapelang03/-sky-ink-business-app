"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/store-context";
import { formatCurrency } from "@/lib/helpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Monthly order data (simulated)
const generateMonthlyData = (orders: { total: number; createdAt: Date }[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  // Generate last 6 months of data
  return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
    const baseOrders = 15 + Math.floor(Math.random() * 20);
    const baseRevenue = 5000 + Math.floor(Math.random() * 10000);
    return {
      month,
      orders: baseOrders + orders.length * (index + 1),
      revenue: baseRevenue + orders.reduce((sum, o) => sum + o.total, 0) * ((index + 1) / 6),
    };
  });
};

export function OrderTrendsChart() {
  const { orders } = useStore();
  const data = generateMonthlyData(orders);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-[#00AEEF]" size={24} />
          Order Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                yAxisId="left"
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tickFormatter={(value) => `M${(value / 1000).toFixed(0)}k`}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [
                  name === "revenue" ? formatCurrency(value) : value,
                  name === "revenue" ? "Revenue" : "Orders"
                ]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#003366"
                strokeWidth={2}
                dot={{ fill: "#003366" }}
                name="Orders"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#00AEEF"
                strokeWidth={2}
                dot={{ fill: "#00AEEF" }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
