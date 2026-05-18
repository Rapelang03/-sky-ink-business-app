"use client";

import { useState } from "react";
import { useStore } from "@/context/store-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { Order } from "@/lib/types";
import { Package, Search, Eye, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  processing: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
};

export function OrderManagement() {
  const { orders, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header h1 { color: #003366; margin: 0; }
              .header p { color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background: #003366; color: white; }
              .total { font-size: 1.2em; font-weight: bold; text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>SKY INK</h1>
              <p>Let's Colour Your World</p>
              <p>Order Receipt</p>
            </div>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Variant</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${item.selectedVariant || "-"}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <p class="total">Total: ${formatCurrency(order.total)}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Package className="text-[#00AEEF]" size={24} />
            Order Management
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as Order["status"])
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge className={STATUS_COLORS[order.status]}>
                            {order.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrint(order)}
                        >
                          <Printer size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className={STATUS_COLORS[selectedOrder.status]}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          {item.selectedVariant && (
                            <p className="text-sm text-muted-foreground">{item.selectedVariant}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p>{item.quantity} x {formatCurrency(item.price)}</p>
                          <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
