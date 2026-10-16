import { describe, expect, it } from "vitest";
import { TreeStore } from "@/stores/TreeStore";
import type { ITreeItem } from "@types";

/**
 * _Root 0
 *
 * _Root 1
 *  |
 *  |_Item 2
 *  |
 *  |_Group A
 *    |
 *    |_Item 3
 *    |_Item 4
 * 
 * _Root 1 string
 *  |
 *  |_Group B
 */
const items: ITreeItem[] = [
  { id: 0, parent: null, label: "Root 0" },
  { id: 1, parent: null, label: "Root 1" },
  { id: "1", parent: null, label: "Root 1 string" },
  { id: "a", parent: 1, label: "Group A" },
  { id: "b", parent: "1", label: "Group B" },
  { id: 2, parent: 1, label: "Item 2" },
  { id: 3, parent: "a", label: "Item 3" },
  { id: 4, parent: "a", label: "Item 4" },
];

describe("TreeStore", () => {
  describe("constructor / getAll", () => {
    it("создаёт пустое хранилище", () => {
      const store = new TreeStore();
      expect(store.getAll()).toEqual([]);
    });

    it("сохраняет порядок элементов и не изменяет входной массив", () => {
      const store = new TreeStore(items);
      // getAll возвращает массив хранилища.
      expect(store.getAll()).toEqual(items);
      // Хранилище не является ссылкой.
      expect(store.getAll()).not.toBe(items);
    });
  });

  describe("getItem", () => {
    it("возвращает исходный объект элемента", () => {
      const store = new TreeStore(items);
      expect(store.getItem(0)).toBe(items[0]);
    });

    it("различает число и строку и обрабатывает отсутствующий id", () => {
      const store = new TreeStore(items);
      expect(store.getItem(1)?.label).toBe("Root 1");
      expect(store.getItem("1")?.label).toBe("Root 1 string");
      expect(store.getItem(999)).toBeUndefined();
    });
  });

  describe("getChildren", () => {
    it("возвращает только прямых детей", () => {
      const store = new TreeStore(items);
      expect(store.getChildren(1).map((item) => item.id)).toEqual(["a", 2]);
    });

    it("возвращает пустой массив для элемента и неизвестного id", () => {
      const store = new TreeStore(items);
      expect(store.getChildren(2)).toEqual([]);
      expect(store.getChildren(999)).toEqual([]);
    });
  });

  describe("getAllChildren", () => {
    it("возвращает всех потомков и не включает самого родителя", () => {
      const store = new TreeStore(items);
      expect(store.getAllChildren(1).map((item) => item.id)).toEqual(["a", 3, 4, 2]);
    });

    it("возвращает пустой массив для элемента и неизвестного id", () => {
      const store = new TreeStore(items);
      expect(store.getAllChildren(2)).toEqual([]);
      expect(store.getAllChildren(999)).toEqual([]);
    });
  });

  describe("getAllParents", () => {
    it("возвращает путь от элемента до корня в правильном порядке", () => {
      const store = new TreeStore(items);
      expect(store.getAllParents(4).map((item) => item.id)).toEqual([4, "a", 1]);
    });

    it("возвращает пустой массив для отсутствующего элемента", () => {
      const store = new TreeStore(items);
      expect(store.getAllParents(999)).toEqual([]);
    });
  });

  describe("setItems", () => {
    it("полностью заменяет элементы и родительские связи", () => {
      const store = new TreeStore(items);
      const newItems: ITreeItem[] = [
        { id: 5, parent: null, label: "New Root" },
        { id: 6, parent: 5, label: "New Item" },
      ];

      store.setItems(newItems);
      expect(store.getAll()).toEqual(newItems);
      expect(store.getItem(1)).toBeUndefined();
      expect(store.getChildren(5).map((item) => item.id)).toEqual([6]);
    });
  });

  describe("addItem", () => {
    it("корректно добавляет элемент", () => {
      const store = new TreeStore(items);
      const newItem: ITreeItem = { id: 5, parent: "a", label: "New Item" };

      store.addItem(newItem);
      expect(store.getAll().at(-1)).toBe(newItem);
      expect(store.getChildren("a").map((item) => item.id)).toEqual([3, 4, 5]);
    });
  });

  describe("removeItem", () => {
    it("корректно удаляет элемент", () => {
      const store = new TreeStore(items);
      store.removeItem(3);
      expect(store.getItem(3)).toBeUndefined();
      expect(store.getItem(4)).toBeDefined();
      expect(store.getItem("a")).toBeDefined();
    });

    it("корректно удаляет группу вместе с дочерними элементами", () => {
      const store = new TreeStore(items);
      store.removeItem(1);
      expect(store.getItem(1)).toBeUndefined();
      expect(store.getItem(2)).toBeUndefined();
      expect(store.getItem("a")).toBeUndefined();
      expect(store.getItem(3)).toBeUndefined();
      expect(store.getItem(4)).toBeUndefined();
      expect(store.getItem(0)).toBeDefined();
      expect(store.getItem("1")).toBeDefined();
      expect(store.getItem("b")).toBeDefined();
    });

    it("ничего не меняет для неизвестного id", () => {
      const store = new TreeStore(items);
      store.removeItem(999);
      expect(store.getAll()).toEqual(items);
    });
  });

  describe("updateItem", () => {
    it("заменяет объект целиком", () => {
      const store = new TreeStore(items);
      const updatedItem: ITreeItem = { id: 2, parent: 1, label: "New Item 2" };
      store.updateItem(updatedItem);
      expect(store.getItem(2)).toBe(updatedItem);
    });
  });
});
