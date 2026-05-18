"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CHART_DATA } from "@/lib/constants";
import { formatCurrency } from "@/lib/helpers";

export function RevenueChart() {
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Revenue vs Expenses</h3>
          <p className="text-sm text-muted-foreground">Year-to-date financial overview</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00AEEF]" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#003366]" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => `M${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Bar dataKey="revenue" fill="#00AEEF" radius={[8, 8, 0, 0]} name="Revenue" />
          <Bar dataKey="expenses" fill="#003366" radius={[8, 8, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
