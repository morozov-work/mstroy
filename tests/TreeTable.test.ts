// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TreeTable from "@components/TreeTable.vue";

vi.mock("ag-grid-vue3", () => ({
  AgGridVue: {
    name: "AgGridVue",
    props: [
      "rowData",
      "loading",
    ],
    template: "<div />",
  },
}));

const rows = [
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "1", parent: 1, label: "Айтем 2" },
  { id: 2, parent: "1", label: "Айтем 3" },
];

const rowData = [
  { item: { id: 1, parent: null, label: "Айтем 1" }, rowId: "number:1", parentId: null },
  { item: { id: "1", parent: 1, label: "Айтем 2" }, rowId: "string:1", parentId: "number:1" },
  { item: { id: 2, parent: "1", label: "Айтем 3" }, rowId: "number:2", parentId: "string:1" },
];

const mountTable = () => mount(TreeTable, { props: { rows, loading: true } });

describe("TreeTable", () => {
  it("корректно формирует id элемента", async () => {
    const table = mountTable();
    const data = table.findComponent({ name: "AgGridVue" }).props("rowData");
    expect(data[0].rowId).toEqual(rowData[0].rowId);
    expect(data[1].rowId).toEqual(rowData[1].rowId);
    expect(data[2].rowId).toEqual(rowData[2].rowId);
    table.unmount();
  });

  it("корректно формирует id родителя", async () => {
    const table = mountTable();
    const data = table.findComponent({ name: "AgGridVue" }).props("rowData");
    expect(data[0].parentId).toEqual(rowData[0].parentId);
    expect(data[1].parentId).toEqual(rowData[1].parentId);
    expect(data[2].parentId).toEqual(rowData[2].parentId);
    table.unmount();
  });

  it("получает обновленные данные и корректно отображает состояние загрузки", async () => {
    const table = mountTable();
    const grid = table.findComponent({ name: "AgGridVue" });
    expect(grid.props("loading")).toBe(true);
    await table.setProps({ loading: false, rows: [] });
    expect(grid.props("loading")).toBe(false);
    expect(grid.props("rowData")).toHaveLength(0);
    table.unmount();
  });
});
