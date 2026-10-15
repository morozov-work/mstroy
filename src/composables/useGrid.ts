import {
  colorSchemeLight,
  GROUP_AUTO_COLUMN_ID,
  themeQuartz,
} from "ag-grid-community";
import type {
  Column,
  AutoGroupColumn,
  ModelUpdated,
  RowDataUpdated,
  GetRowId,
} from "@types";

/**
 * Параметры настройки таблицы просто взяты из документации.
 */
export const useGrid = () => {
  const labels = {
    count: "№ п/п",
    name: "Наименование",
    category: "Категория",
    group: "Группа",
    element: "Элемент",
  };

  // https://www.ag-grid.com/vue-data-grid/theming-theme-builder/#exporting-themes
  const theme = themeQuartz.withPart(colorSchemeLight);

  // https://www.ag-grid.com/vue-data-grid/column-properties/#reference-columnGroups
  const defaultColDef: Column = {
    sortable: false,
    filter: false,
    editable: false,
    resizable: false,
    suppressMovable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };

  // https://www.ag-grid.com/vue-data-grid/grid-options/#reference-columns-columnDefs
  const columnDefs: Column[] = [
    {
      colId: "rowNumber",
      headerName: labels.count,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      lockPosition: "left",
      cellStyle: { textAlign: "left", fontWeight: "bold" },
      valueGetter: ({ node }) =>
        node?.rowIndex == null ? "" : node.rowIndex + 1,
    },
    {
      colId: "label",
      headerName: labels.name,
      lockPosition: "right",
      minWidth: 200,
      flex: 1,
      cellStyle: (params) => ({
        fontWeight: params.node.group ? "bold" : "normal",
      }),
      valueGetter: ({ data }) => {
        const label = data?.item.label;
        return typeof label === "string" ? label : "";
      },
    },
  ];

  // https://www.ag-grid.com/vue-data-grid/grid-options/#reference-rowGrouping-autoGroupColumnDef
  const autoGroupColumnDef: AutoGroupColumn = {
    headerName: labels.category,
    lockPosition: false,
    minWidth: 200,
    width: 400,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: { suppressCount: true },
    cellStyle: (params) => ({
      fontWeight: params.node.group ? "bold" : "normal",
    }),
    valueGetter: (params) =>
      params.node?.group ? labels.group : labels.element,
  };

  // https://www.ag-grid.com/vue-data-grid/grid-events/#reference-gridLifecycle-modelUpdated
  const onModelUpdated: ModelUpdated = ({ api }) => {
    api.refreshCells({ columns: ["rowNumber"] });
  };

  // https://www.ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-rowDataUpdated
  const onRowDataUpdated: RowDataUpdated = ({ api }) => {
    api.refreshCells({ columns: [GROUP_AUTO_COLUMN_ID] });
  };

  // https://www.ag-grid.com/vue-data-grid/grid-options/#reference-rowModels-getRowId
  const getRowId: GetRowId = ({ data }) => data.rowId;

  return {
    theme,
    defaultColDef,
    columnDefs,
    autoGroupColumnDef,
    onModelUpdated,
    onRowDataUpdated,
    getRowId,
  };
};
