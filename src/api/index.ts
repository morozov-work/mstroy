import type { ITreeItem } from '@types';

const baseUrl = import.meta.env.BASE_URL;

// Организуем задержку при получении данных из json.
const mockApi = async <T>(path: string): Promise<T> => {
  const request = fetch(baseUrl + path);
  const delay = new Promise<void>((resolve) => setTimeout(resolve, 2000));
  const [response] = await Promise.all([request, delay]);

  return response.json() as Promise<T>;
};

// Метод загрузки элементов дерева.
export const loadItems = (): Promise<ITreeItem[]> => {
  return mockApi<ITreeItem[]>('items.json');
};
