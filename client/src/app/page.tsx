"use client";

import { useState } from "react";
import { CategoriesTable } from "@/components/ui/CategoriesTable";
import { ProductsTable } from "@/components/common/ProductsTable";

const menuItems = [
  { id: "data", label: "Data" },
  { id: "orders", label: "Orders" },
  { id: "settings", label: "Settings" },
];

export default function HomePage() {
  const [activeItem, setActiveItem] = useState("data");

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-zinc-200 dark:border-zinc-800">
          Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
          {menuItems.find((item) => item.id === activeItem)?.label}
        </h1>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          {activeItem === "data" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
                  Categories
                </h2>
                <CategoriesTable />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
                  Products
                </h2>
                <ProductsTable />
              </div>
            </div>
          )}
          {activeItem === "orders" && (
            <p className="text-zinc-500 dark:text-zinc-400">Orders content</p>
          )}
          {activeItem === "settings" && (
            <p className="text-zinc-500 dark:text-zinc-400">Settings content</p>
          )}
        </div>
      </main>
    </div>
  );
}
