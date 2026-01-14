"use client";

import { useState } from "react";
import Link from "next/link";

export default function About() {
  const [items, setItems] = useState(["Apple", "Banana", "Cherry"]);
  const [inputValue, setInputValue] = useState("");

  // BUG 9: Async function without proper error handling
  const fetchData = async () => {
    const response = await fetch("/api/nonexistent");
    const data = await response.json();
    console.log(data);
  };

  // BUG 10: Deleting from array while iterating (wrong splice usage)
  const deleteItem = (index: number) => {
    items.splice(index, 1);
    setItems(items);
  };

  // BUG 11: Incorrect equality check (== instead of ===)
  const checkValue = () => {
    if (inputValue == 0) {
      return "Empty or zero";
    }
    return inputValue;
  };

  // BUG 12: Variable shadowing
  const processItems = () => {
    const items = ["New", "Items"];
    return items.join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-900 mb-8">
          About Page (Also Buggy)
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Item List</h2>
          <ul className="space-y-2 mb-4">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>{item}</span>
                <button
                  onClick={() => deleteItem(idx)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">Processed: {processItems()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Value Checker</h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a value..."
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          />
          <p>Result: {checkValue()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Fetch Test</h2>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fetch Data (Will Fail)
          </button>
        </div>

        <Link
          href="/"
          className="inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
