// SKY INK Business Constants

export const COMPANY_NAME = "SKY INK";
export const COMPANY_TAGLINE = "Let's Colour Your World";
export const COMPANY_LOCATION = "Maseru, Lesotho";

// Currency formatting
export const CURRENCY_SYMBOL = "M";
export const CURRENCY_CODE = "LSL"; // Lesotho Loti

// Default placeholder image
export const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/003366/white?text=SKY+INK";

// Product categories
export const PRODUCT_CATEGORIES = [
  "Apparel",
  "Accessories", 
  "Printing",
  "Services",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// Default products for initial state
export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "T-Shirt",
    category: "Apparel" as ProductCategory,
    image: "/assets/tshirt.jpg",
    basePrice: 100,
    hasPrinting: true,
    printingPrice: 50,
    variants: ["Without Printing", "With Printing"],
  },
  {
    id: 2,
    name: "V-Neck",
    category: "Apparel" as ProductCategory,
    image: "/assets/vneck.jpg",
    basePrice: 45,
    hasPrinting: true,
    printingPrice: 30,
    variants: ["Without Printing", "With Printing"],
  },
  {
    id: 3,
    name: "Hoodie",
    category: "Apparel" as ProductCategory,
    image: "/assets/hoodie.jpg",
    basePrice: 50,
    hasPrinting: true,
    printingPrice: 50,
    variants: ["Without Printing", "With Printing"],
  },
  {
    id: 4,
    name: "Cap",
    category: "Accessories" as ProductCategory,
    image: "/assets/cap.jpg",
    basePrice: 70,
    hasPrinting: true,
    printingPrice: 30,
    variants: ["Without Printing", "With Printing"],
  },
  {
    id: 5,
    name: "Coffee Mug",
    category: "Accessories" as ProductCategory,
    image: "/assets/mugs.jpg",
    basePrice: 45,
    hasPrinting: true,
    printingPrice: 20,
    variants: ["Without Printing", "With Printing"],
  },
  {
    id: 6,
    name: "Flyers (100 pcs)",
    category: "Printing" as ProductCategory,
    image: "/assets/flyer.jpg",
    variantPrices: { "A5 Flyers": 150, "A4 Flyers": 250, "A3 Flyers": 400 },
  },
  {
    id: 7,
    name: "Photocopying (per page)",
    category: "Services" as ProductCategory,
    image: "/assets/photocopying.jpg",
    variantPrices: { "Black & White": 1, Color: 3.5 },
  },
  {
    id: 8,
    name: "Document Binding",
    category: "Services" as ProductCategory,
    image: "/assets/binding.jpg",
    variantPrices: { "Spiral Binding": 25, "Thermal Binding": 40, "Hard Cover": 80 },
  },
  {
    id: 9,
    name: "Large Format Poster",
    category: "Printing" as ProductCategory,
    image: "/assets/poster.jpg",
    variantPrices: { A2: 200, A1: 350, A0: 500 },
  },
  {
    id: 10,
    name: "Business Cards (100 pcs)",
    category: "Printing" as ProductCategory,
    image: "/assets/businesscard.jpg",
    variantPrices: { Standard: 180, Premium: 300, Luxury: 500 },
  },
];

// Demo credentials
export const DEMO_CREDENTIALS = {
  admin: { email: "admin@skyink.com", password: "admin123" },
  customer: { email: "customer@skyink.com", password: "customer123" },
};

// Chart data for admin dashboard
export const CHART_DATA = [
  { month: "Jan", revenue: 24000, expenses: 18000 },
  { month: "Feb", revenue: 28000, expenses: 19500 },
  { month: "Mar", revenue: 32000, expenses: 21000 },
  { month: "Apr", revenue: 30000, expenses: 22000 },
  { month: "May", revenue: 35000, expenses: 23500 },
  { month: "Jun", revenue: 40000, expenses: 25000 },
];

// Storage keys
export const STORAGE_KEYS = {
  USER: "skyink_user",
  THEME: "skyink_theme",
  PRODUCTS: "skyink_products",
  CART: "skyink_cart",
  ORDERS: "skyink_orders",
} as const;
