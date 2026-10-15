// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import App from "@/App.vue";
import type { ITreeItem } from "@types";

// Данные для поддельного сервера.
const items: ITreeItem[] = [{ id: 1, parent: null, label: "Айтем 1" }];

// Подменяем api.
vi.mock("@api", () => ({ loadItems: async () => items }));

// Подменяем компонент таблицы.
vi.mock("@components/TreeTable.vue", () => ({
  default: {
    name: "TreeTable",
    props: ["rows", "loading"],
    template: "<div />",
  },
}));

describe("App", () => {
  afterEach(() => vi.clearAllMocks());

  it("отображает индикатор загрузки корректно", async () => {
    const app = mount(App);
    const table = app.findComponent({ name: "TreeTable" });
    expect(table.props("loading")).toBe(true);
    await flushPromises();
    expect(table.props("loading")).toBe(false);
    app.unmount();
  });

  it("изначально получает пустые данные", async () => {
    const app = mount(App);
    const table = app.findComponent({ name: "TreeTable" });
    expect(table.props("rows")).toEqual([]);
    app.unmount();
  });

  it("получает данные после загрузки", async () => {
    const app = mount(App);
    const table = app.findComponent({ name: "TreeTable" });
    await flushPromises();
    expect(table.props("rows")).toEqual(items);
    app.unmount();
  });
});
