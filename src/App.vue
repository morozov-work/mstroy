<template>
  <main>
    <TreeTable :rows="rows" :loading="isLoading" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TreeTable from "@components/TreeTable.vue";
import { useTreeStore } from "@composables";
import { loadItems } from "@api";

const { rows, setItems } = useTreeStore();
const isLoading = ref<boolean>(true);

onMounted(async () => {
  const items = await loadItems();
  setItems(items);
  isLoading.value = false;
});
</script>
