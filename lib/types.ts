// SKY INK Type Definitions

import { ProductCategory } from "./constants";

export type UserRole = "admin" | "customer";

export interface User {
  role: UserRole;
  email?: string;
}

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  image: string;
  basePrice?: number;
  hasPrinting?: boolean;
  printingPrice?: number;
  variants?: string[];
  variantPrices?: Record<string, number>;
}

export interface CartItem {
  cartId: number;
  id: number;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  finalUnitPrice: number;
  totalPrice: number;
  image: string;
}

export interface OrderItem {
  name: string;
  variant: string;
  quantity: number;
  total: number;
  product: Product;
  selectedVariant: string;
  price: number;
}

export interface Order {
  id: string;
  orderId: number;
  date: string;
  createdAt: Date;
  customerName: string;
  items: OrderItem[];
  discount: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  basePrice: string;
  printingPrice: string;
  hasPrinting: boolean;
  variants: string[];
  variantPrices: Record<string, number>;
  image: string;
}

export interface ProductSelection {
  variant: string;
  quantity: number;
}
