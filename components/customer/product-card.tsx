"use client";

import { useState } from "react";
import { useStore } from "@/context/store-context";
import { Product } from "@/lib/types";
import { formatCurrency, getProductPrice, getProductVariants, getImageSrc } from "@/lib/helpers";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const variants = getProductVariants(product);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);

  const unitPrice = getProductPrice(product, selectedVariant);
  const hasDiscount = quantity >= 10;
  const finalPrice = hasDiscount ? unitPrice * 0.95 : unitPrice;
  const displayPrice = formatCurrency(finalPrice);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full group">
      {/* Product Image */}
      <div className="h-48 bg-muted flex items-center justify-center p-4 relative overflow-hidden">
        <img
          src={getImageSrc(product.image)}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/400x400/003366/white?text=SKY+INK";
          }}
        />
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            5% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#003366] dark:text-[#00AEEF] line-clamp-1">{product.name}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{product.category}</span>
        </div>

        {/* Variant Selection */}
        <div className="mb-4">
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full p-2.5 text-sm bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
          >
            {variants.map((variant) => (
              <option key={variant} value={variant}>
                {variant}
                {product.hasPrinting && variant === "With Printing" && ` (+${formatCurrency(product.printingPrice || 0)})`}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center border border-input rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          {hasDiscount && (
            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full font-medium">
              5% bulk discount
            </span>
          )}
        </div>

        {/* Price and Add Button */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
          <div>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through block">{formatCurrency(unitPrice)}</span>
            )}
            <span className="text-2xl font-black text-[#00AEEF]">{displayPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-[#003366] hover:bg-[#00AEEF] text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-200 hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
