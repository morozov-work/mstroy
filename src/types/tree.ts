/**
 * Идентификатор элемента дерева.
 */
export type TreeId = string | number;

/**
 * Элемент дерева с произвольными полями.
 */
export interface ITreeItem {
  id: TreeId;
  parent: TreeId | null;
  [key: string]: unknown;
}

/**
 * Контракт экземпляра TreeStore.
 */
export interface ITreeStore {
  getAll(): ITreeItem[];
  getItem(id: TreeId): ITreeItem | undefined;
  getChildren(id: TreeId): ITreeItem[];
  getAllChildren(id: TreeId): ITreeItem[];
  getAllParents(id: TreeId): ITreeItem[];
  setItems(items: ITreeItem[]): void;
  addItem(item: ITreeItem): void;
  removeItem(id: TreeId): void;
  updateItem(item: ITreeItem): void;
}
