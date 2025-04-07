// src/types.ts

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number; // Must be here
  itemsSold: number; // Must be here
  description: string;
  imageUrl: string;
};

export type ProductFormData = {
  name: string;
  category: string;
  price: number;
  stockQuantity: number; // Must be here as well
  description: string;
  imageUrl: string;
};

export type SortField = keyof Pick<
  Product,
  "name" | "category" | "price" | "stockQuantity" | "itemsSold"
>;

export type SortConfig = {
  field: SortField;
  direction: "asc" | "desc";
};

export type FilterConfig = {
  category: string;
  search: string;
  stockStatus: "all" | "inStock" | "lowStock" | "outOfStock";
};
