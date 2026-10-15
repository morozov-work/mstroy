<template>
  <AgGridVue
    class="tree-table"
    :theme="theme"
    :row-data="gridRows"
    :loading="loading"
    :column-defs="columnDefs"
    :default-col-def="defaultColDef"
    :auto-group-column-def="autoGroupColumnDef"
    :get-row-id="getRowId"
    :tree-data="true"
    :group-default-expanded="-1"
    tree-data-parent-id-field="parentId"
    row-model-type="clientSide"
    @model-updated="onModelUpdated"
    @row-data-updated="onRowDataUpdated"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type { TreeId, ITreeItem, IGridTreeRow } from "@types";
import { useGrid } from "@composables";

const props = defineProps<{
  rows: ITreeItem[];
  loading: boolean;
}>();

const {
  theme,
  defaultColDef,
  columnDefs,
  autoGroupColumnDef,
  onModelUpdated,
  onRowDataUpdated,
  getRowId,
} = useGrid();

const rowId = (id: TreeId): string => {
  return `${typeof id}:${id}`;
};

const parentId = (id: TreeId | null): string | null => {
  return id === null ? null : `${typeof id}:${id}`;
};

const gridRows = computed<IGridTreeRow[]>(() => {
  return props.rows.map((item) => ({
    item,
    rowId: rowId(item.id),
    parentId: parentId(item.parent),
  }));
});
</script>
