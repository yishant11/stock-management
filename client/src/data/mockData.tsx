import type { Product } from "../types";

const categories = [
  "Dairy",
  "Bakery",
  "Produce",
  "Meat",
  "Beverages",
  "Snacks",
  "Canned Goods",
  "Frozen Foods",
];

const productNames = [
  "Milk",
  "Bread",
  "Eggs",
  "Cheese",
  "Yogurt",
  "Chicken",
  "Beef",
  "Apples",
  "Bananas",
  "Oranges",
  "Pasta",
  "Rice",
  "Cereal",
  "Coffee",
  "Tea",
  "Soda",
  "Water",
  "Chips",
  "Cookies",
  "Ice Cream",
];

const descriptions = [
  "Fresh and locally sourced",
  "Organic and sustainable",
  "Premium quality",
  "Best seller",
  "Customer favorite",
  "Limited edition",
  "New arrival",
  "On sale",
  "Imported",
  "Handcrafted",
];

// Mapping of product names to dynamic Unsplash image URLs
const googleImageMapping: { [key: string]: string } = {
  Milk: "https://source.unsplash.com/featured/100x100/?milk",
  Bread: "https://source.unsplash.com/featured/100x100/?bread",
  Eggs: "https://source.unsplash.com/featured/100x100/?eggs",
  Cheese: "https://source.unsplash.com/featured/100x100/?cheese",
  Yogurt: "https://source.unsplash.com/featured/100x100/?yogurt",
  Chicken: "https://source.unsplash.com/featured/100x100/?chicken",
  Beef: "https://source.unsplash.com/featured/100x100/?beef",
  Apples: "https://source.unsplash.com/featured/100x100/?apples",
  Bananas: "https://source.unsplash.com/featured/100x100/?bananas",
  Oranges: "https://source.unsplash.com/featured/100x100/?oranges",
  Pasta: "https://source.unsplash.com/featured/100x100/?pasta",
  Rice: "https://source.unsplash.com/featured/100x100/?rice",
  Cereal: "https://source.unsplash.com/featured/100x100/?cereal",
  Coffee: "https://source.unsplash.com/featured/100x100/?coffee",
  Tea: "https://source.unsplash.com/featured/100x100/?tea",
  Soda: "https://source.unsplash.com/featured/100x100/?soda",
  Water: "https://source.unsplash.com/featured/100x100/?water",
  Chips: "https://source.unsplash.com/featured/100x100/?chips",
  Cookies: "https://source.unsplash.com/featured/100x100/?cookies",
  "Ice Cream": "https://source.unsplash.com/featured/100x100/?ice-cream",
};

export function generateMockProducts(count: number): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const randomName =
      productNames[Math.floor(Math.random() * productNames.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomDescription =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    const price = Number.parseFloat((Math.random() * 50 + 0.99).toFixed(2));
    const quantityInStock = Math.floor(Math.random() * 100);
    const sold = Math.floor(Math.random() * 200);

    // Create a date within the last 30 days
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

    products.push({
      id: (i + 1).toString(),
      name: `${randomName} ${i + 1}`,
      category: randomCategory,
      price,
      quantityInStock,
      description: `${randomDescription} ${randomName.toLowerCase()}.`,
      sold,
      // Use mapped image URL if available; otherwise, fall back to placeholder
      imageUrl:
        googleImageMapping[randomName] ||
        `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(
          randomName
        )}`,
      createdAt,
    });
  }

  return products;
}

export function getUniqueCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((product) => product.category)));
}

export function calculateTotalRevenue(products: Product[]): number {
  return products.reduce((total, product) => {
    return total + product.price * (product.sold || 0);
  }, 0);
}

export function calculateTotalSold(products: Product[]): number {
  return products.reduce((total, product) => {
    return total + (product.sold || 0);
  }, 0);
}

export function calculateLowStockCount(
  products: Product[],
  threshold = 10
): number {
  return products.filter(
    (product) =>
      product.quantityInStock > 0 && product.quantityInStock <= threshold
  ).length;
}

export function calculateOutOfStockCount(products: Product[]): number {
  return products.filter((product) => product.quantityInStock === 0).length;
}
