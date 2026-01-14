"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Laptop", price: 999.99, quantity: 5 },
    { id: 2, name: "Mouse", price: 29.99, quantity: 15 },
    { id: 3, name: "Keyboard", price: 79.99, quantity: 8 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);

  // BUG 13: useCallback with missing dependency
  const calculateTotal = useCallback(() => {
    const sum = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    setTotal(sum);
  }, []); // Missing products dependency

  // BUG 14: Stale closure in event handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("Current search:", searchTerm); // Will always log initial value
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []); // Missing searchTerm dependency

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  // BUG 15: Floating point arithmetic issue
  const applyDiscount = (price: number, discount: number) => {
    return price - price * discount;
  };

  // BUG 16: Off-by-one error in pagination
  const getPageItems = (page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage + 1; // Off by one
    return products.slice(start, end);
  };

  // BUG 17: Race condition potential - no debouncing
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Simulating API call on every keystroke
    fetch(`/api/search?q=${value}`).catch(() => {});
  };

  // BUG 18: Incorrect null check
  const getProductName = (id: number) => {
    const product = products.find((p) => p.id == id);
    return product.name; // No null check - will crash if not found
  };

  // BUG 19: Modifying props/state in render
  const sortedProducts = products.sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-violet-900 mb-8">
          Dashboard (Extra Buggy)
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Products</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search... (press Enter to log)"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Products (Total Value: ${total.toFixed(2)})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">10% Discount</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3">{product.quantity}</td>
                    <td className="p-3">
                      ${applyDiscount(product.price, 0.1).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pagination Test</h2>
          <p className="text-gray-600">
            Page 0 items:{" "}
            {getPageItems(0, 2)
              .map((p) => p.name)
              .join(", ")}
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          >
            Back to Home
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            About Page
          </Link>
        </div>
      </div>
    </div>
  );
}
