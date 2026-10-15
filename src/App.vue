<template>
  <main>
    <TreeTable :rows="rows" :loading="isLoading" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from "vue";
import TreeTable from "@components/TreeTable.vue";
import { useTreeStore, treeStoreKey } from "@composables";
import { loadItems } from "@api";

const treeStore = useTreeStore();
provide(treeStoreKey, treeStore);
const { rows, setItems } = treeStore;
const isLoading = ref<boolean>(true);

onMounted(async () => {
  const items = await loadItems();
  setItems(items);
  isLoading.value = false;
});
</script>
