"use client";

import { useState } from "react";
import { useStore } from "@/context/store-context";
import { formatCurrency, getImageSrc } from "@/lib/helpers";
import { Order } from "@/lib/types";
import { ShoppingCart, X, Trash2, Plus, Minus, RefreshCw, Printer, CheckCircle } from "lucide-react";

export function CartSidebar() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, totalDiscount, cartItemCount, checkout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const order = checkout();
    if (order) {
      setLastOrder(order);
    }
    setIsCheckingOut(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-[#00AEEF] hover:bg-[#0095cc] p-4 rounded-full shadow-2xl z-40 transition-all duration-200 hover:scale-105"
        aria-label="Open cart"
      >
        <ShoppingCart size={26} className="text-white" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#003366] w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center shadow">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-card h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <p className="text-sm text-muted-foreground">
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageSrc(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.variant}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                          className="p-1 border border-input rounded hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                          className="p-1 border border-input rounded hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {item.discount > 0 && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                          5% bulk discount applied
                        </p>
                      )}
                      <p className="text-[#00AEEF] font-bold mt-1">{formatCurrency(item.totalPrice)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-border bg-muted/30">
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-sm mb-3">
                    <span>Bulk Discount</span>
                    <span className="font-medium">-{formatCurrency(totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-5">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-3xl font-black text-[#00AEEF]">{formatCurrency(cartTotal)}</span>
                </div>
                <button
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#003366] hover:bg-[#00AEEF] text-white rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {lastOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setLastOrder(null)} />
          <div className="relative bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#003366] dark:text-[#00AEEF]">Order Confirmed!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order #{lastOrder.orderId} | {lastOrder.date}
              </p>
            </div>

            {/* Order Items */}
            <div className="space-y-2 my-6 max-h-48 overflow-auto border-t border-b border-border py-4">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">
                    {item.product?.name || item.name} ({item.selectedVariant || item.variant}) x{item.quantity}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.total || item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Order Total */}
            {lastOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-sm mb-2">
                <span>Discount</span>
                <span>-{formatCurrency(lastOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">TOTAL</span>
              <span className="text-3xl font-black text-[#00AEEF]">{formatCurrency(lastOrder.total)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#003366] hover:bg-[#00AEEF] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Print Receipt
              </button>
              <button
                onClick={() => setLastOrder(null)}
                className="flex-1 py-3 bg-muted hover:bg-accent rounded-xl font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
