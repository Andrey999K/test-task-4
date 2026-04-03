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

export function ProductsTable() {
  const gridRef = useRef<any>(null);
  const [rowData, setRowData] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

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

  return (
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
  );
}
