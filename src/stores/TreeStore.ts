import type { TreeId, ITreeItem, ITreeStore } from "@types";

export class TreeStore implements ITreeStore {
  private items: ITreeItem[] = [];

  constructor(items: ITreeItem[] = []) {
    this.setItems(items);
  }

  // Возвращает полный массив элементов дерева.
  public getAll(): ITreeItem[] {
    return this.items;
  }

  // Возвращает объект элемента дерева или undefined.
  public getItem(id: TreeId): ITreeItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Возвращает массив дочерних элементов по id родителя или пустой массив, если родитель не найден.
  public getChildren(id: TreeId): ITreeItem[] {
    if (!this.getItem(id)) return [];
    return this.items.filter((item) => item.parent === id);
  }

  // Возвращает всех потомков по id родителя или пустой массив, если родитель не найден.
  public getAllChildren(id: TreeId): ITreeItem[] {
    if (!this.getItem(id)) return [];

    const childrenMap = new Map<TreeId | null, ITreeItem[]>();

    for (const item of this.items) {
      const children = childrenMap.get(item.parent) ?? [];
      children.push(item);
      childrenMap.set(item.parent, children);
    }

    const result: ITreeItem[] = [];

    const build = (parentId: TreeId): void => {
      const children = childrenMap.get(parentId);
      if (!children) return;

      for (const child of children) {
        result.push(child);
        build(child.id);
      }
    };

    build(id);
    return result;
  }

  // Возвращает массив элементов от самого элемента включительно до корневого элемента
  // или пустой массив, если элемент не найден.
  public getAllParents(id: TreeId): ITreeItem[] {
    const result: ITreeItem[] = [];
    let item = this.getItem(id);

    while (item) {
      result.push(item);
      if (item.parent === null) break;
      item = this.getItem(item.parent);
    }

    return result;
  }

  // Полностью заменяет данные в хранилище
  public setItems(items: ITreeItem[]): void {
    this.items = [...items];
  }

  // Добавляет новый элемент в общую структуру хранилища.
  public addItem(item: ITreeItem): void {
    this.items.push(item);
  }

  // Удаляет соответствующий элемент и все его дочерние элементы из хранилища.
  public removeItem(id: TreeId): void {
    if (!this.getItem(id)) return;
    const children = this.getAllChildren(id);
    const ids = new Set([id, ...children.map((item) => item.id)]);
    this.items = this.items.filter((item) => !ids.has(item.id));
  }

  // Обновляет элемент в хранилище, если он существует.
  public updateItem(item: ITreeItem): void {
    const index = this.items.findIndex(({ id }) => id === item.id);
    if (index !== -1) this.items[index] = item;
  }
}
