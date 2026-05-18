// SKY INK Helper Functions

import { CURRENCY_SYMBOL, PLACEHOLDER_IMAGE } from "./constants";
import { Product } from "./types";

/**
 * Format a number as currency (Lesotho Loti)
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return `${CURRENCY_SYMBOL}0.00`;
  }
  return `${CURRENCY_SYMBOL}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get the price for a product variant
 */
export function getProductPrice(product: Product | null | undefined, variant: string): number {
  if (!product) return 0;

  // Check for variant prices (e.g., Flyers, Business Cards)
  if (product.variantPrices?.[variant]) {
    return product.variantPrices[variant];
  }

  // Check for printing option
  if (product.hasPrinting) {
    if (variant === "With Printing") {
      return (product.basePrice || 0) + (product.printingPrice || 0);
    }
    return product.basePrice || 0;
  }

  return product.basePrice || 0;
}

/**
 * Get the default variant for a product
 */
export function getDefaultVariant(product: Product): string {
  if (product.variants && product.variants.length > 0) {
    return product.variants[0];
  }
  if (product.variantPrices) {
    const keys = Object.keys(product.variantPrices);
    return keys.length > 0 ? keys[0] : "Standard";
  }
  if (product.hasPrinting) {
    return "Without Printing";
  }
  return "Standard";
}

/**
 * Get all available variants for a product
 */
export function getProductVariants(product: Product): string[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants;
  }
  if (product.variantPrices) {
    return Object.keys(product.variantPrices);
  }
  if (product.hasPrinting) {
    return ["Without Printing", "With Printing"];
  }
  return ["Standard"];
}

/**
 * Calculate discount (5% for 10+ items)
 */
export function calculateDiscount(unitPrice: number, quantity: number): { discount: number; finalUnitPrice: number } {
  if (quantity >= 10) {
    const discount = unitPrice * 0.05;
    return { discount, finalUnitPrice: unitPrice - discount };
  }
  return { discount: 0, finalUnitPrice: unitPrice };
}

/**
 * Generate a random order ID
 */
export function generateOrderId(): number {
  return Math.floor(Math.random() * 900000) + 100000;
}

/**
 * Get image source with fallback
 */
export function getImageSrc(src: string | undefined | null): string {
  return src || PLACEHOLDER_IMAGE;
}

/**
 * Format date for display
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleString();
}
