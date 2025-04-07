import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProductManagement from "./pages/ProductManagement";
import StockOverview from "./pages/StockOverview";
import type { Product } from "./types";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://stock-management-qsaf.onrender.com/products/getproducts");
      if (response.ok) {
        const data = await response.json();
        console.log("GetData", data);
        setProducts(data);
      } else {
        console.error("Failed to fetch products from backend");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      const response = await fetch("https://stock-management-qsaf.onrender.com/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`https://stock-management-qsaf.onrender.com/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`https://stock-management-qsaf.onrender.com/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateStock = async (productId: string, quantity: number) => {
    try {
      // POST /purchase endpoint to update stock
      const response = await fetch("https://stock-management-qsaf.onrender.com/purchase/purchaseStock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProductManagement
                products={products}
                onAdd={addProduct}
                onUpdate={updateProduct}
                onDelete={deleteProduct}
              />
            }
          />
          <Route
            path="stock"
            element={<StockOverview products={products} updateStock={updateStock} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
