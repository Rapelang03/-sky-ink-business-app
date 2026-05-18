"use client";

import { useState } from "react";
import { useStore } from "@/context/store-context";
import { Product, ProductFormData } from "@/lib/types";
import { formatCurrency, getImageSrc } from "@/lib/helpers";
import { PRODUCT_CATEGORIES, PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Edit, Trash2, Plus, X, AlertCircle, Package } from "lucide-react";

const initialFormData: ProductFormData = {
  name: "",
  category: "Apparel",
  basePrice: "",
  printingPrice: "",
  hasPrinting: false,
  variants: ["Without Printing", "With Printing"],
  variantPrices: {},
  image: PLACEHOLDER_IMAGE,
};

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [variantPricesText, setVariantPricesText] = useState('{"Standard": 0}');

  const resetForm = () => {
    setFormData(initialFormData);
    setVariantPricesText('{"Standard": 0}');
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice?.toString() || "",
      printingPrice: product.printingPrice?.toString() || "",
      hasPrinting: !!product.hasPrinting,
      variants: product.variants || ["Without Printing", "With Printing"],
      variantPrices: product.variantPrices || {},
      image: product.image || PLACEHOLDER_IMAGE,
    });
    setVariantPricesText(JSON.stringify(product.variantPrices || {}, null, 2));
    setShowModal(true);
  };

  const handleSave = () => {
    const productData: Omit<Product, "id"> = {
      name: formData.name,
      category: formData.category,
      image: formData.image || PLACEHOLDER_IMAGE,
      ...(formData.hasPrinting
        ? {
            basePrice: parseFloat(formData.basePrice) || 0,
            printingPrice: parseFloat(formData.printingPrice) || 0,
            hasPrinting: true,
            variants: formData.variants,
          }
        : {
            variantPrices: formData.variantPrices,
          }),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleVariantPricesChange = (text: string) => {
    setVariantPricesText(text);
    try {
      const parsed = JSON.parse(text);
      setFormData((prev) => ({ ...prev, variantPrices: parsed }));
    } catch {
      // Invalid JSON, ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00AEEF]/10 rounded-xl">
            <Package className="text-[#00AEEF]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Product Management</h2>
            <p className="text-sm text-muted-foreground">{products.length} products in catalog</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00AEEF] hover:bg-[#0095cc] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={getImageSrc(product.image)}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded-lg bg-muted"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{product.name}</p>
                    {product.hasPrinting && (
                      <span className="text-xs text-[#00AEEF] bg-[#00AEEF]/10 px-2 py-0.5 rounded-full">
                        Printing Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-muted rounded-full text-sm">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {product.basePrice ? formatCurrency(product.basePrice) : "Varies"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-[#00AEEF] hover:bg-[#00AEEF]/10 rounded-lg transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value || PLACEHOLDER_IMAGE })}
                  className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-muted rounded-xl cursor-pointer hover:bg-accent transition-colors">
                <input
                  type="checkbox"
                  checked={formData.hasPrinting}
                  onChange={(e) => setFormData({ ...formData, hasPrinting: e.target.checked })}
                  className="w-5 h-5 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <span className="font-medium">Has printing option?</span>
              </label>

              {formData.hasPrinting ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price (M)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Printing Price (M)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.printingPrice}
                      onChange={(e) => setFormData({ ...formData, printingPrice: e.target.value })}
                      className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Variant Prices (JSON format)
                  </label>
                  <textarea
                    placeholder='{"Standard": 180, "Premium": 300}'
                    value={variantPricesText}
                    onChange={(e) => handleVariantPricesChange(e.target.value)}
                    className="w-full p-3.5 bg-muted border border-input rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none font-mono text-sm"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={!formData.name}
                  className="flex-1 py-3.5 bg-[#00AEEF] hover:bg-[#0095cc] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Product
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3.5 bg-muted hover:bg-accent rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertCircle size={28} />
              <h3 className="text-xl font-bold">Confirm Delete</h3>
            </div>
            <p className="text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deleteConfirm.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-muted hover:bg-accent rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
