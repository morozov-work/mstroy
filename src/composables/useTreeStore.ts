import { shallowReadonly, shallowRef } from "vue";
import { TreeStore } from "@/stores/TreeStore";
import type { TreeId, ITreeItem } from "@types";

export const useTreeStore = () => {
  const store = new TreeStore([]);
  const rows = shallowRef<ITreeItem[]>([]);

  const syncRows = (): void => {
    rows.value = [...store.getAll()];
  };

  const setItems = (items: ITreeItem[]): void => {
    store.setItems(items);
    syncRows();
  };

  const addItem = (item: ITreeItem): void => {
    store.addItem(item);
    syncRows();
  };

  const removeItem = (id: TreeId): void => {
    store.removeItem(id);
    syncRows();
  };

  const updateItem = (item: ITreeItem): void => {
    store.updateItem(item);
    syncRows();
  };

  const getItem = (id: TreeId): ITreeItem | undefined => {
    return store.getItem(id);
  };

  const getChildren = (id: TreeId): ITreeItem[] => {
    return store.getChildren(id);
  };

  const getAllChildren = (id: TreeId): ITreeItem[] => {
    return store.getAllChildren(id);
  };

  const getAllParents = (id: TreeId): ITreeItem[] => {
    return store.getAllParents(id);
  };

  return {
    rows: shallowReadonly(rows), // Запрещаем замену значений.
    setItems,
    addItem,
    removeItem,
    updateItem,
    getItem,
    getChildren,
    getAllChildren,
    getAllParents,
  };
};
