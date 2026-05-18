"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/store-context";
import { formatCurrency } from "@/lib/helpers";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Package } from "lucide-react";

const COLORS = ["#003366", "#00AEEF", "#10b981", "#f59e0b", "#ef4444"];

export function CategoryChart() {
  const { products } = useStore();

  // Calculate sales by category (simulated based on product count and price)
  const categoryData = products.reduce((acc, product) => {
    const category = product.category;
    const price = product.basePrice || 
      (product.variantPrices ? Object.values(product.variantPrices)[0] : 0);
    
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, count: 0 };
    }
    acc[category].value += price * 10; // Simulated sales
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const data = Object.values(categoryData);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="text-[#00AEEF]" size={24} />
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">
                {item.name}: {item.count} products
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
