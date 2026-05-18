"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/store-context";
import { formatCurrency } from "@/lib/helpers";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";

export function InventoryAlerts() {
  const { products } = useStore();
  
  // Simulated inventory data (in a real app, this would come from backend)
  const inventoryData = products.map(product => ({
    ...product,
    stock: Math.floor(Math.random() * 50),
    lowStockThreshold: 10,
  }));

  const lowStockItems = inventoryData.filter(item => item.stock <= item.lowStockThreshold);
  const topSelling = [...products].slice(0, 3);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" size={24} />
          Inventory Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Low Stock Items */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingDown size={16} />
              Low Stock Items
            </h4>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">All items well stocked</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">{item.stock} left</p>
                      <p className="text-xs text-muted-foreground">Reorder soon</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Selling */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Package size={16} />
              Top Selling Products
            </h4>
            <div className="space-y-2">
              {topSelling.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#003366] text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-medium text-sm">{item.name}</p>
                  </div>
                  <p className="font-semibold text-[#00AEEF]">
                    {formatCurrency(item.basePrice || Object.values(item.variantPrices || {})[0] || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
