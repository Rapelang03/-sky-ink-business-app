"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS, DEFAULT_PRODUCTS } from "@/lib/constants";
import { Product, CartItem, Order } from "@/lib/types";
import { getProductPrice, calculateDiscount, generateOrderId, formatDate } from "@/lib/helpers";
import { useAuth } from "./auth-context";

interface StoreContextType {
  // Products
  products: Product[];
  setProducts: (products: Product[] | ((prev: Product[]) => Product[])) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: string, quantity: number) => void;
  removeFromCart: (cartId: number) => void;
  updateCartQuantity: (cartId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  totalDiscount: number;
  cartItemCount: number;

  // Orders
  orders: Order[];
  checkout: () => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useLocalStorage<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  const [orders, setOrders] = useLocalStorage<Order[]>(STORAGE_KEYS.ORDERS, []);

  // Product management
  const addProduct = (product: Omit<Product, "id">) => {
    setProducts((prev) => {
      const newId = Math.max(...prev.map((p) => p.id), 0) + 1;
      return [...prev, { ...product, id: newId }];
    });
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Cart management
  const addToCart = (product: Product, variant: string, quantity: number) => {
    const unitPrice = getProductPrice(product, variant);
    const { discount, finalUnitPrice } = calculateDiscount(unitPrice, quantity);
    const totalPrice = finalUnitPrice * quantity;

    const cartItem: CartItem = {
      cartId: Date.now() + Math.random(),
      id: product.id,
      name: product.name,
      variant,
      quantity,
      unitPrice,
      discount,
      finalUnitPrice,
      totalPrice,
      image: product.image,
    };

    setCart((prev) => [...prev, cartItem]);
  };

  const removeFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId !== cartId) return item;
        const { discount, finalUnitPrice } = calculateDiscount(item.unitPrice, newQuantity);
        return {
          ...item,
          quantity: newQuantity,
          discount,
          finalUnitPrice,
          totalPrice: finalUnitPrice * newQuantity,
        };
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0) * (item.quantity || 0), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout
  const checkout = (): Order | null => {
    if (cart.length === 0) return null;

    const now = new Date();
    const customerName = user?.email?.split("@")[0] || "Customer";
    
    const order: Order = {
      id: `ORD-${Date.now()}`,
      orderId: generateOrderId(),
      date: formatDate(now),
      createdAt: now,
      customerName: customerName.charAt(0).toUpperCase() + customerName.slice(1),
      items: cart.map((item) => {
        const product = products.find(p => p.id === item.id);
        return {
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          total: item.totalPrice,
          product: product || { id: item.id, name: item.name, category: "Apparel" as const, image: item.image },
          selectedVariant: item.variant,
          price: item.finalUnitPrice,
        };
      }),
      discount: totalDiscount,
      total: cartTotal,
      status: "pending",
    };

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  // Update order status (admin only)
  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const value: StoreContextType = {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    totalDiscount,
    cartItemCount,
    orders,
    checkout,
    updateOrderStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
