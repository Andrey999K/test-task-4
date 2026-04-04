"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { categoryApi, productApi } from "@/lib/api";
import type { ProductType } from "@/types/Product.types";
import type { CategoryType } from "@/types/Category.types";
import { toast } from "react-toastify";

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

  const onQuickFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    gridRef.current?.api.setGridOption("quickFilterText", e.target.value);
  }, []);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const columnDefs = useMemo<ColDef<ProductType>[]>(() => [
    {field: "id", headerName: "ID", width: 80, pinned: "left"},
    {field: "name", headerName: "Name", flex: 1, minWidth: 150},
    {
      field: "category_id",
      headerName: "Category",
      width: 150,
      valueGetter: (params) => getCategoryName(params.data?.category_id ?? 0)
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueFormatter: (params) => {
        const value = params.value;
        if (value !== undefined && value !== null && !isNaN(Number(value))) {
          return `$${Number(value).toFixed(2)}`;
        }
        return "$0.00";
      },
    },
    {field: "stock", headerName: "Stock", width: 100},
    {
      field: "added_at",
      headerName: "Added",
      width: 120,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
        }
        return "";
      },
    },
  ], [categories]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({name: "", categoryId: categories[0]?.id || 1, price: 0, stock: 0});
    setShowModal(true);
  };

  const handleEdit = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select a product to edit");
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
      toast.error("Please select a product to delete");
      return;
    }
    const product = selectedRows[0];
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }
    try {
      await productApi.delete(product.id);
      await loadData();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const changedFields: Partial<ProductFormDataType> = {};
        if (formData.name !== editingProduct.name) changedFields.name = formData.name;
        if (formData.categoryId !== editingProduct.category_id) changedFields.categoryId = formData.categoryId;
        if (formData.price !== editingProduct.price) changedFields.price = formData.price;
        if (formData.stock !== editingProduct.stock) changedFields.stock = formData.stock;

        if (Object.keys(changedFields).length === 0) {
          toast.info("No changes detected");
          setShowModal(false);
          return;
        }

        await productApi.update(editingProduct.id, changedFields);
        toast.success("Product updated successfully");
      } else {
        await productApi.create(formData);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            onChange={onQuickFilterChange}
            className="px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-64"
          />
        </div>
      </div>

      <div className="ag-theme-quartz-dark" style={{height: 450, width: "100%"}}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          rowSelection={{mode: "singleRow", enableClickSelection: true}}
          onGridReady={onGridReady}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-[450px] shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
              {editingProduct ? (
                <>
                  <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Product
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-2 text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-2 text-sm font-medium">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-2 text-sm font-medium">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 dark:text-zinc-400 mb-2 text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors font-medium"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
