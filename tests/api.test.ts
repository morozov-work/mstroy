import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadItems } from "@api";
import type { ITreeItem } from "@types";

// Данные для поддельного сервера.
const items: ITreeItem[] = [{ id: 1, parent: null, label: "Айтем 1" }];

describe("loadItems", () => {
  // Перед каждым тестом заменяем настоящие таймеры поддельными.
  beforeEach(() => vi.useFakeTimers());

  // После каждого теста возвращаем настоящие таймеры и аннулируем действие stubGlobal.
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  // Создаём поддельный fetch.
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(items)));

  it("загружает данные и возвращает их", async () => {
    // Подменяем fetch.
    vi.stubGlobal("fetch", fetchMock);
    // Запускаем загрузку.
    const result = loadItems();
    // Перемещаем время поддельного таймера.
    await vi.advanceTimersByTimeAsync(2000);
    // Проверяем URL вызова.
    expect(fetchMock).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}items.json`);
    // Проверяем результат.
    await expect(result).resolves.toEqual(items);
  });

  it("создает реальную задержку 2000 мс", async () => {
    // Подменяем fetch.
    vi.stubGlobal("fetch", fetchMock);
    // Этой функцией проверяем момент завершения загрузки.
    const isResolved = vi.fn();
    // Запускаем загрузку.
    loadItems().then(isResolved);
    // Загрузка должна висеть.
    await vi.advanceTimersByTimeAsync(1999);
    expect(isResolved).not.toHaveBeenCalled();
    // Загрузка должна завершиться.
    await vi.advanceTimersByTimeAsync(1);
    expect(isResolved).toHaveBeenCalledWith(items);
  });
});
