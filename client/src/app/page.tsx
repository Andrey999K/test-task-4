"use client";

import { useState } from "react";

const menuItems = [
  { id: "data", label: "Data" },
  { id: "orders", label: "Orders" },
  { id: "settings", label: "Settings" },
];

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("data");

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-zinc-800">
          Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <p className="text-zinc-500 dark:text-zinc-400">
            Content for {activeItem} will be displayed here
          </p>
        </div>
      </main>
    </div>
  );
}
