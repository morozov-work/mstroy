import type { InjectionKey } from "vue";
import type { useTreeStore } from "./useTreeStore";

export const treeStoreKey: InjectionKey<ReturnType<typeof useTreeStore>> = Symbol("treeStore");
