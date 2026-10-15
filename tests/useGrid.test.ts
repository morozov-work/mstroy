import { describe, expect, it } from "vitest";
import type { ValueGetterParams } from "ag-grid-community";
import { useGrid } from "@composables";
import type { IGridTreeRow } from "@types";

describe("useGrid", () => {
  it("определяет категорию по признаку группы AG Grid", () => {
    const { autoGroupColumnDef } = useGrid();
    const { headerName: name, valueGetter: getter } = autoGroupColumnDef;
    if (typeof getter !== "function") throw new Error(`Для колонки ${name} не определен геттер значения`);

    expect(getter({ node: { group: true } } as ValueGetterParams<IGridTreeRow>)).toBe("Группа");
    expect(getter({ node: { group: false } } as ValueGetterParams<IGridTreeRow>)).toBe("Элемент");
  });

  it("считает номер отображаемой строки", () => {
    const { columnDefs } = useGrid();
    const { headerName: name, valueGetter: getter } = columnDefs[0];
    if (typeof getter !== "function") throw new Error(`Для колонки ${name} не определен геттер значения`);

    expect(getter({ node: { rowIndex: 0 } } as ValueGetterParams<IGridTreeRow>)).toBe(1);
    expect(getter({ node: { rowIndex: 1 } } as ValueGetterParams<IGridTreeRow>)).toBe(2);
    expect(getter({ node: { rowIndex: null } } as ValueGetterParams<IGridTreeRow>)).toBe("");
  });
});
