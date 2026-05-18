"use client";

import { CHART_DATA } from "@/lib/constants";
import { formatCurrency } from "@/lib/helpers";
import { DollarSign, TrendingDown, TrendingUp, Users, Package, ShoppingCart } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
}

function StatCard({ title, value, icon, trend, trendUp, gradient }: StatCardProps) {
  return (
    <div className={`${gradient} text-white p-6 rounded-2xl shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
        {trend && (
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${trendUp ? "bg-green-400/30" : "bg-red-400/30"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-white/80 text-sm font-medium">{title}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}

export function FinancialStats() {
  const totalRevenue = CHART_DATA.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = CHART_DATA.reduce((sum, d) => sum + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={<DollarSign size={24} />}
        trend="+12.5%"
        trendUp={true}
        gradient="bg-gradient-to-br from-[#00AEEF] to-[#0095cc]"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<TrendingDown size={24} />}
        trend="+8.2%"
        trendUp={false}
        gradient="bg-gradient-to-br from-rose-500 to-rose-600"
      />
      <StatCard
        title="Net Profit"
        value={formatCurrency(netProfit)}
        icon={<TrendingUp size={24} />}
        trend={`${profitMargin}%`}
        trendUp={true}
        gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
      />
      <StatCard
        title="Orders (YTD)"
        value="1,847"
        icon={<ShoppingCart size={24} />}
        trend="+18.3%"
        trendUp={true}
        gradient="bg-gradient-to-br from-[#003366] to-[#004488]"
      />
    </div>
  );
}
