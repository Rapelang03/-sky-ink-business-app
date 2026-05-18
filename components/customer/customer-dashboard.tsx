"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/context/store-context";
import { COMPANY_NAME, COMPANY_TAGLINE } from "@/lib/constants";
import { ProductCard } from "./product-card";
import { CartSidebar } from "./cart-sidebar";
import { Truck, Shield, Star, Search } from "lucide-react";

export function CustomerDashboard() {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#00AEEF] p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">{COMPANY_NAME}.</h1>
          <p className="text-xl md:text-2xl mt-2 text-white/90 font-light">{COMPANY_TAGLINE}</p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full text-sm font-medium">
              <Truck size={18} />
              Free Delivery over M500
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-full text-sm font-medium">
              <Shield size={18} />
              Quality Guaranteed
            </div>
            <div className="flex items-center gap-2 bg-yellow-400 text-[#003366] px-4 py-2.5 rounded-full text-sm font-bold shadow-lg">
              <Star size={18} fill="currentColor" />
              5% discount on 10+ items!
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#00AEEF] text-white shadow-lg"
                  : "bg-card hover:bg-muted border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-5 py-2.5 border border-input rounded-full w-full sm:w-72 focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none bg-card transition-all"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Search className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-xl font-semibold text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}
