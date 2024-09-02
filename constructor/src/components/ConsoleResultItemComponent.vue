<script setup lang="ts">
import {
  defineProps, defineEmits, PropType, computed,
} from 'vue';
import ConsoleResultItem from '@/models/consoleResultItem';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

// @component
const name = 'ConsoleResultItemComponent';

// Data
const dataTableStyle = computed(() => ({
  minWidth: '50rem',
  maxHeight: '200px',
  marginBottom: '3px',
  fontSize: '0.8rem',
}));

// Props
const props = defineProps(
  {
    item:
      {
        required: true,
        type: Object as PropType<ConsoleResultItem>,
      },
  },
);

const contentDisplayStyle = computed(() => ({
  backgroundColor: props.item?.isError ? '#ffe0e0' : 'white',
  margin: 0,
}));

// Emits
const emit = defineEmits({ delete: (item: ConsoleResultItem) => true });

// Event handlers
function onOpenCloseClick(item: ConsoleResultItem): void {
  item.isOpen = !item.isOpen;
}

function onDeleteClick(item: ConsoleResultItem): void {
  emit('delete', item);
}

</script>

<template>
  <div class="bs-console-result-item">
    <div  class="grid bs-console-result-item__header">
      <div class="col-fixed" style="width: 40px">
        <Button icon="pi pi-times"
                class="mr-1"
                severity="danger"
                size="small"
                text
                @click="onDeleteClick(item)"></Button>
      </div>
      <div class="col">
        <span style="font-size: 0.8rem">{{ item.expression }}</span>
        <span>&nbsp;</span>
        <span class="text-primary"
              style="font-size:0.7rem">{{item.info}}</span>
      </div>
      <div class="col-fixed" style="width: 40px">
        <Button :icon="item.isOpen ? 'pi pi-angle-down':'pi pi-angle-right'"
                class="mr-1"
                severity="primary"
                size="small"
                text
                @click="onOpenCloseClick(item)"></Button>
      </div>
    </div>
    <div class="grid"
         v-if="item.isOpen"
         :style="contentDisplayStyle">
      <div class="col-12">
        <div  class="p-2">
          <div v-if="item.isTable">
            <DataTable :value="item.table._rows"
                       size="small"
                       show-gridlines
                       scrollable
                       scroll-height="150px"
                       :tableStyle="dataTableStyle">
              <Column v-for="column of item.table._columns"
                      :key="column.name"
                      :field="column.name"
                      :header="column.name"></Column>
            </DataTable>
          </div>
          <div v-else >
            {{ item.resultDisplay }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.bs-console-result-item {
  border-top: 1px solid #b5b5b5;
  border-left: 1px solid #ececec;
  border-right: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}

.bs-console-result-item__header{
  margin:0;
  background: #ececec;
  line-height: 30px;
}
</style>
