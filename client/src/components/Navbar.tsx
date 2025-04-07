import { Link, useLocation } from "react-router-dom";
import { BarChart3, Package } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Package className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                StockMaster
              </span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Products
            </Link>
            <Link
              to="/stock"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/stock"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                Stock & Analytics
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
