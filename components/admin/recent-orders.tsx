"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/context/store-context";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { Clock, CheckCircle, XCircle, Loader } from "lucide-react";

const STATUS_ICONS = {
  pending: Clock,
  processing: Loader,
  completed: CheckCircle,
  cancelled: XCircle,
};

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  processing: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
};

export function RecentOrders() {
  const { orders } = useStore();
  
  // Get the 5 most recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-[#00AEEF]" size={24} />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock size={40} className="mx-auto mb-2 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const StatusIcon = STATUS_ICONS[order.status] || Clock;
              return (
                <div
                  key={order.id || order.orderId}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#003366]/10 dark:bg-[#00AEEF]/10">
                      <StatusIcon 
                        size={20} 
                        className={order.status === "completed" ? "text-green-500" : 
                                   order.status === "cancelled" ? "text-red-500" :
                                   order.status === "processing" ? "text-blue-500" : "text-yellow-500"}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items - {formatDate(new Date(order.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(order.total)}</p>
                    <Badge className={STATUS_COLORS[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
