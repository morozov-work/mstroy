import type { ITreeItem } from "./tree";
import type {
  AutoGroupColumnDef,
  ColDef,
  GetRowIdFunc,
  ModelUpdatedEvent,
  RowDataUpdatedEvent,
} from "ag-grid-community";

export interface IGridTreeRow {
  item: ITreeItem;
  rowId: string;
  parentId: string | null;
};

export type Column = ColDef<IGridTreeRow>;
export type AutoGroupColumn = AutoGroupColumnDef<IGridTreeRow>;
export type ModelUpdated = (data: ModelUpdatedEvent<IGridTreeRow>) => void;
export type RowDataUpdated = (data: RowDataUpdatedEvent<IGridTreeRow>) => void;
export type GetRowId = GetRowIdFunc<IGridTreeRow>;