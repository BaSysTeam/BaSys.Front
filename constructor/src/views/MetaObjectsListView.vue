<script setup lang="ts">
import {
  ref, onBeforeMount, onMounted, defineProps, defineEmits, PropType, computed,
} from 'vue';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DataTable from 'primevue/datatable';
import Divider from 'primevue/divider';
import MetaObject from '@/models/metaObject';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

// @component
const name = 'MetaObjectsListView';

// Props
const props = defineProps({ kind: { type: String, required: true } });
const isWaiting = ref(false);
const formTitle = ref<string>('Meta objects');
const items = ref<MetaObject[]>([]);
const selectedRow = ref<any>(null);

const dataTableStyle = computed(() => ({
  height: `${window.innerHeight - 150}px`,
}));

// Event handlers
function onAddClicked(): void {
  console.log('Add clicked');
}

function onEditClicked(): void {
  console.log('Add edit');
}

function onDeleteClicked(): void {
  console.log('Delete clicked');
}

function onRowDblClick(): void {
  console.log('RowDblClick');
}

function onRowSelect(): void {
  console.log('RowSelect');
}

</script>

<template>
  <!--View title-->
  <div class="grid">
    <div class="col">
      <ViewTitleComponent :title="formTitle" :is-modified="false" :is-waiting="isWaiting" />
    </div>
  </div>
  <!--Command panel-->
  <div class="grid">
    <div class="col-12">
      <ButtonGroup>
        <Button
          :label="$t('add')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-plus"
          @click="onAddClicked"
        />
        <Button
          label="Edit"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-pencil"
          @click="onEditClicked"
        />
        <Button
          label="Delete"
          severity="danger"
          size="small"
          outlined
          icon="pi pi-trash"
          @click="onDeleteClicked"
        />
      </ButtonGroup>
    </div>
  </div>
  <!--Divider-->
  <div class="grid">
    <Divider class="m-2" />
  </div>
  <!--List-->
  <div class="grid">
    <div class="col-12">
      <div class="card m-1">
        <DataTable
          v-model:selection="selectedRow"
          v-model:value="items"
          :style="dataTableStyle"
          :metaKeySelection="true"
          showGridlines
          size="small"
          selectionMode="single"
          dataKey="uid"
          @row-dblclick="onRowDblClick"
          @row-select="onRowSelect"
        >
          <template #empty> No items found. </template>
          <Column header="#" style="width: 50px">
            <template #body="currentRow">
              {{ currentRow.index + 1 }}
            </template>
          </Column>
          <Column field="title" header="Title"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="memo" header="Memo"></Column>

        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
