import { inject } from "vue";
import { colorSchemeLight, GROUP_AUTO_COLUMN_ID, themeQuartz } from "ag-grid-community";
import type {
  Column,
  AutoGroupColumn,
  ModelUpdated,
  RowDataUpdated,
  GetRowId,
} from "@types";
import { treeStoreKey } from "@composables";

/**
 * Параметры настройки таблицы просто взяты из документации.
 */
export const useGrid = () => {
  const treeStore = inject(treeStoreKey);
  if (!treeStore) throw new Error("Хранилище не было инициализировано");
  const { getChildren } = treeStore;

  // https://www.ag-grid.com/vue-data-grid/theming-theme-builder/#exporting-themes
  const theme = themeQuartz.withPart(colorSchemeLight).withParams({
    backgroundColor: "#ffffff",
    foregroundColor: "#1f2937",
    headerBackgroundColor: "#f3f4f6",
    headerTextColor: "#374151",
    borderColor: "#e5e7eb",
    fontSize: 14,
    headerFontWeight: 600,
    cellHorizontalPadding: 12,
    rowHeight: 40,
    headerHeight: 44,
    wrapperBorderRadius: 8,
  });

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
      headerName: "№ п/п",
      width: 90,
      minWidth: 90,
      maxWidth: 90,
      lockPosition: "left",
      cellStyle: { textAlign: "center" },
      valueGetter: ({ node }) =>
        node?.rowIndex == null ? "" : node.rowIndex + 1,
    },
    {
      colId: "label",
      headerName: "Наименование",
      lockPosition: "right",
      minWidth: 280,
      flex: 1,
      valueGetter: ({ data }) => {
        const label = data?.item.label;
        return typeof label === "string" ? label : "";
      },
    },
  ];

  // https://www.ag-grid.com/vue-data-grid/grid-options/#reference-rowGrouping-autoGroupColumnDef
  const autoGroupColumnDef: AutoGroupColumn = {
    headerName: "Категория",
    lockPosition: false,
    minWidth: 220,
    width: 260,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: { suppressCount: true },
    valueGetter: ({ data }) => {
      if (!data) return "";
      return getChildren(data.item.id).length > 0 ? "Группа" : "Элемент";
    },
  };

  // https://www.ag-grid.com/vue-data-grid/grid-events/#reference-gridLifecycle-modelUpdated
  const onModelUpdated: ModelUpdated = ({ api }) => {
    api.refreshCells({ columns: ["rowNumber"] });
  }

  // https://www.ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-rowDataUpdated
  const onRowDataUpdated: RowDataUpdated = ({ api }) => {
    api.refreshCells({ columns: [GROUP_AUTO_COLUMN_ID] });
  }

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
