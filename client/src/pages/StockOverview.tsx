import type React from "react";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDownZA,
  ArrowUpZA,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import type { Product, SortConfig, FilterConfig, SortField } from "../types";
import {
  getUniqueCategories,
  calculateTotalRevenue,
  calculateTotalSold,
  calculateLowStockCount,
  calculateOutOfStockCount,
} from "../data/mockData";

interface StockOverviewProps {
  products: Product[];
  updateStock: (id: string, quantity: number) => void;
}

export default function StockOverview({
  products,
  updateStock,
}: StockOverviewProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc",
  });

  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    category: "all",
    search: "",
    stockStatus: "all",
  });

  const [sellQuantity, setSellQuantity] = useState<Record<string, number>>({});

  const categories = useMemo(
    () => ["all", ...getUniqueCategories(products)],
    [products]
  );

  const totalRevenue = useMemo(
    () => calculateTotalRevenue(products),
    [products]
  );
  const totalSold = useMemo(() => calculateTotalSold(products), [products]);
  const lowStockCount = useMemo(
    () => calculateLowStockCount(products),
    [products]
  );
  const outOfStockCount = useMemo(
    () => calculateOutOfStockCount(products),
    [products]
  );

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return {
          ...prevConfig,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilterConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSellQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: string
  ) => {
    const value = Number.parseInt(e.target.value) || 0;
    setSellQuantity((prev) => ({ ...prev, [productId]: value }));
  };

  const handleSell = (productId: string) => {
    const quantity = sellQuantity[productId] || 0;
    if (quantity > 0) {
      updateStock(productId, quantity);
      setSellQuantity((prev) => ({ ...prev, [productId]: 0 }));
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (
        filterConfig.category !== "all" &&
        product.category !== filterConfig.category
      ) {
        return false;
      }

      // Stock status filter using stockQuantity from backend
      if (
        filterConfig.stockStatus === "inStock" &&
        product.stockQuantity <= 0
      ) {
        return false;
      } else if (
        filterConfig.stockStatus === "lowStock" &&
        (product.stockQuantity > 10 || product.stockQuantity === 0)
      ) {
        return false;
      } else if (
        filterConfig.stockStatus === "outOfStock" &&
        product.stockQuantity > 0
      ) {
        return false;
      }

      // Search filter
      if (filterConfig.search) {
        const searchTerm = filterConfig.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [products, filterConfig]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortConfig.field] as string | number;
      const bValue = b[sortConfig.field] as string | number;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        const numA = aValue as number;
        const numB = bValue as number;
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }
    });
  }, [filteredProducts, sortConfig]);

  // Data for charts: using itemsSold from backend
  const categoryData = useMemo(() => {
    const data: Record<string, { sold: number; revenue: number }> = {};

    products.forEach((product) => {
      if (!data[product.category]) {
        data[product.category] = { sold: 0, revenue: 0 };
      }

      data[product.category].sold += product.itemsSold || 0;
      data[product.category].revenue += (product.itemsSold || 0) * product.price;
    });

    return Object.entries(data).map(([name, values]) => ({
      name,
      sold: values.sold,
      revenue: Number.parseFloat(values.revenue.toFixed(2)),
    }));
  }, [products]);

  const stockStatusData = useMemo(() => {
    return [
      {
        name: "In Stock",
        value: products.length - lowStockCount - outOfStockCount,
      },
      { name: "Low Stock", value: lowStockCount },
      { name: "Out of Stock", value: outOfStockCount },
    ];
  }, [products, lowStockCount, outOfStockCount]);

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  // Top selling products using itemsSold
  const topSellingProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.itemsSold || 0) - (a.itemsSold || 0))
      .slice(0, 5)
      .map((product) => ({
        name: product.name,
        sold: product.itemsSold || 0,
        revenue: Number.parseFloat(
          ((product.itemsSold || 0) * product.price).toFixed(2)
        ),
      }));
  }, [products]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Stock Overview & Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold text-gray-800">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">
            Total Items Sold
          </h3>
          <p className="text-3xl font-bold text-emerald-600">{totalSold}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-600">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">
            Out of Stock Items
          </h3>
          <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sold"
                  name="Items Sold"
                  fill="#10b981"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  name="Revenue ($)"
                  fill="#6366f1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Stock Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold" name="Items Sold" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Revenue by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#6366f1"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters and Stock Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filterConfig.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filterConfig.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="stockStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Status
              </label>
              <select
                id="stockStatus"
                name="stockStatus"
                value={filterConfig.stockStatus}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock (&lt;= 10)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterConfig({
                    category: "all",
                    search: "",
                    stockStatus: "all",
                  });
                }}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Product
                    {sortConfig.field === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowDownAZ className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowUpZA className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.field === "category" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowDownAZ className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowUpZA className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    Price
                    {sortConfig.field === "price" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpAZ className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownZA className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("stockQuantity")}
                >
                  <div className="flex items-center">
                    Stock
                    {sortConfig.field === "stockQuantity" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpAZ className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownZA className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("itemsSold")}
                >
                  <div className="flex items-center">
                    Sold
                    {sortConfig.field === "itemsSold" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpAZ className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownZA className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              product.imageUrl ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          product.stockQuantity === 0
                            ? "text-red-600"
                            : product.stockQuantity < 10
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {product.stockQuantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.itemsSold || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max={product.stockQuantity}
                          value={sellQuantity[product.id] || ""}
                          onChange={(e) =>
                            handleSellQuantityChange(e, product.id)
                          }
                          disabled={product.stockQuantity === 0}
                          className="w-16 p-1 border border-gray-300 rounded-md"
                          placeholder="Qty"
                        />
                        <button
                          onClick={() => handleSell(product.id)}
                          disabled={
                            product.stockQuantity === 0 ||
                            !sellQuantity[product.id] ||
                            sellQuantity[product.id] <= 0 ||
                            sellQuantity[product.id] > product.stockQuantity
                          }
                          className="flex items-center p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
