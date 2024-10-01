<script setup lang="ts">
import {
  ref, onMounted, defineProps, watch, computed,
} from 'vue';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import MetaObject from '@/models/metaObject';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import { useI18n } from 'vue-i18n';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

// @component
const name = 'MetaObjectsListView';

const { t } = useI18n({ useScope: 'global' });

// Props
const props = defineProps({ kind: { type: String, required: true } });

// Data
const isWaiting = ref(false);
const kindTitle = ref('');
const items = ref<MetaObject[]>([]);
const selectedRow = ref<any>({});

const dataTableStyle = computed(() => ({
  height: `${window.innerHeight - 150}px`,
}));

const formTitle = computed(() => `${t('metaObjects')}: ${kindTitle.value}`);

const provider = new MetaObjectProvider();

async function updateListAsync(kindName: string): Promise<void> {
  isWaiting.value = true;

  const result = await provider.getKindList(kindName);
  console.log('updateList', result);
  if (result.isOK) {
    kindTitle.value = result.data.title;
    items.value = [];
    result.data.items.forEach((item: any) => {
      items.value.push(item);
    });
    console.log('items', items.value);
  }

  isWaiting.value = false;
}

watch(() => props.kind, async (newVal) => {
  await updateListAsync(newVal);
});

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

// Life cycle hooks
onMounted(async () => {
  await updateListAsync(props.kind);
});

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
          :label="$t('edit')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-pencil"
          @click="onEditClicked"
        />
        <Button
          :label="$t('delete')"
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
          :value="items"
          :style="dataTableStyle"
          :metaKeySelection="true"
          showGridlines
          size="small"
          selectionMode="single"
          dataKey="uid"
          @row-dblclick="onRowDblClick"
          @row-select="onRowSelect"
        >
          <template #empty> {{$t('noItemsFound')}} </template>
          <Column header="#" style="width: 50px">
            <template #body="currentRow">
              {{ currentRow.index + 1 }}
            </template>
          </Column>
          <Column field="title" :header="$t('title')"></Column>
          <Column field="name" :header="$t('name')"></Column>
          <Column field="memo" :header="$t('memo')"></Column>

        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
