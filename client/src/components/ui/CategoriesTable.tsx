"use client";

import { useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { ColDef, GridReadyEvent, IDatasource, IGetRowsParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { categoryApi } from "@/lib/api";
import type { CategoryType } from "@/types/Category.types";

ModuleRegistry.registerModules([AllCommunityModule]);

interface CategoriesTableProps {
  onSelectCategory?: (category: CategoryType) => void;
}

export function CategoriesTable({ onSelectCategory }: CategoriesTableProps) {
  const gridRef = useRef<any>(null);

  const columnDefs = useMemo<ColDef<CategoryType>[]>(() => [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "created_at", headerName: "Created At", width: 150 },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        categoryApi.getAll(params.endRow - params.startRow, params.startRow)
          .then(({ data, total }) => {
            params.successCallback(data, total);
          })
          .catch((error) => {
            console.error("Error loading categories:", error);
            params.failCallback();
          });
      },
    };

    params.api.setGridOption("datasource", dataSource);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    if (selectedRows && selectedRows.length > 0 && onSelectCategory) {
      onSelectCategory(selectedRows[0]);
    }
  }, [onSelectCategory]);

  return (
    <div className="ag-theme-quartz-dark" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowModelType="infinite"
        rowSelection={{ mode: "singleRow" }}
        cacheBlockSize={20}
        maxBlocksInCache={10}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}
