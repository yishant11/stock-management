export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantityInStock: number;
  description: string;
  sold?: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  quantityInStock: number;
  description: string;
  imageUrl?: string;
}

export type SortField =
  | "name"
  | "category"
  | "price"
  | "quantityInStock"
  | "sold";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  category: string;
  search: string;
  stockStatus: "all" | "inStock" | "lowStock" | "outOfStock";
}
