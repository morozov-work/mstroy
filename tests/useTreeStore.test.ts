import { describe, expect, it } from "vitest";
import { useTreeStore } from "@composables";

const root = { id: 1, parent: null, label: "Айтем 1" };
const child = { id: 2, parent: 1, label: "Айтем 2" };
const updatedChild = { ...child, label: "Айтем 3" };

describe("useTreeStore", () => {
  it("обновляет данные при установке значений", () => {
    const { rows, setItems } = useTreeStore();
    const initialRows = rows.value;
    expect(initialRows).toEqual([]);

    setItems([root, child]);
    expect(rows.value).toEqual([root, child]);
  });

  it("обновляет данные при изменении значений", () => {
    const { rows, setItems, addItem, updateItem, removeItem } = useTreeStore();
    setItems([root]);
    expect(rows.value).toEqual([root]);

    addItem(child);
    expect(rows.value).toEqual([root, child]);

    updateItem(updatedChild);
    expect(rows.value[1]).toBe(updatedChild);

    removeItem(1);
    expect(rows.value).toEqual([]);
  });
});
