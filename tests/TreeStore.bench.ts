
import { test } from "vitest";
import { TreeStore } from "@/stores/TreeStore";
import type { ITreeItem } from "@types";

const COUNT = 10_000;

const generateItems = (count: number): ITreeItem[] => {
  const items: ITreeItem[] = [];

  for (let id = 0; id < count; id++) {
    items.push({
      id,
      parent: id === 0 ? null : id < 100 ? id - 1 : Math.floor(id / 2),
      label: `Item ${id}`,
    });
  }

  return items;
};

const items = generateItems(COUNT);
const store = new TreeStore(items);
const newItem: ITreeItem = { id: COUNT, parent: 0, label: "New item" };
const updatedItem: ITreeItem = { ...items.at(-1)!, label: "Updated item" };

test(`TreeStore: ${COUNT} элементов`, { timeout: 120_000 }, async ({ bench }) => {
  await bench("getAll", () => store.getAll()).run();

  await bench("getItem", () => store.getItem(0)).run();

  await bench("getChildren", () => store.getChildren(0)).run();

  await bench("getAllChildren", () => store.getAllChildren(0)).run();

  await bench("getAllParents", () => store.getAllParents(COUNT - 1)).run();

  await bench("setItems", () => store.setItems(items)).run();

  await bench("addItem", { beforeEach: () => store.setItems(items) }, () => store.addItem(newItem)).run();

  await bench("removeItem", { beforeEach: () => store.setItems(items) }, () => store.removeItem(0)).run();

  await bench("updateItem", { beforeEach: () => store.setItems(items) }, () => store.updateItem(updatedItem)).run();
});
