"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { productApi, categoryApi } from "@/lib/api";
import type { ProductType } from "@/types/Product.types";
import type { CategoryType } from "@/types/Category.types";

ModuleRegistry.registerModules([AllCommunityModule]);

type ProductFormDataType = {
  name: string;
  categoryId: number;
  price: number;
  stock: number;
};

export function ProductsTable() {
  const gridRef = useRef<any>(null);
  const [rowData, setRowData] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState<ProductFormDataType>({
    name: "",
    categoryId: 1,
    price: 0,
    stock: 0,
  });

  const loadData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(100, 0),
        categoryApi.getAll(100, 0),
      ]);
      setRowData(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const onGridReady = useCallback(async (_params: GridReadyEvent) => {
    await loadData();
  }, [loadData]);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const columnDefs = useMemo<ColDef<ProductType>[]>(() => [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
    { 
      field: "category_id", 
      headerName: "Category", 
      width: 150,
      valueGetter: (params) => getCategoryName(params.data?.category_id ?? 0)
    },
    { field: "price", headerName: "Price", width: 120 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "added_at", headerName: "Added At", width: 150 },
  ], [categories]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", categoryId: categories[0]?.id || 1, price: 0, stock: 0 });
    setShowModal(true);
  };

  const handleEdit = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alert("Please select a product to edit");
      return;
    }
    const product = selectedRows[0];
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.category_id,
      price: product.price,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alert("Please select a product to delete");
      return;
    }
    const product = selectedRows[0];
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }
    try {
      await productApi.delete(product.id);
      await loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, formData);
      } else {
        await productApi.create(formData);
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Add
        </button>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="ag-theme-quartz-dark" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          rowSelection={{ mode: "singleRow" }}
          onGridReady={onGridReady}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:outline-none focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:outline-none focus:border-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded border border-zinc-600 focus:outline-none focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
