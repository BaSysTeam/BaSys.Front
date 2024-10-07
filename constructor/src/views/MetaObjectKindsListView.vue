<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import SplitButton from 'primevue/splitbutton';
import MetaObjectKind from '../models/metaObjectKind';
import MetaObjectKindsProvider from '../dataProviders/metaObjectKindsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const dataProvider = new MetaObjectKindsProvider();
const toastHelper = new ToastHelper(useToast());
const router = useRouter();

// Data
const isWaiting = ref(true);
const selectedRow = ref<any>({});
const metadataKinds = ref<MetaObjectKind[]>([]);
const windowHeight = ref(window.innerHeight);

// Methods
function isSelectedRowEmpty(): boolean {
  return Object.keys(selectedRow.value).length === 0;
}

function dataTableStyle(): any {
  return {
    height: `${windowHeight.value - 150}px`,
  };
}

function navigateToAdd():void {
  router.push({ name: 'metadata-kinds-edit', params: { name: '_new' } });
}

function navigateToEdit():void {
  if (isSelectedRowEmpty()) {
    return;
  }
  const selectedKind = selectedRow.value as MetaObjectKind;
  console.log('selected row', selectedKind);
  router.push({ name: 'metadata-kinds-edit', params: { name: selectedKind.name } });
}

async function actionUpdate(): Promise<void> {
  isWaiting.value = true;
  const response = await dataProvider.getCollection();
  if (response.isOK) {
    console.log('Get Metadata kinds', response);
    metadataKinds.value = response.data;
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
  isWaiting.value = false;
}

// Event handlers
function onAddClicked():void {
  navigateToAdd();
}

function onEditClicked():void {
  navigateToEdit();
}

async function onDeleteClicked():Promise<void> {
  if (isSelectedRowEmpty()) {
    return;
  }

  // eslint-disable-next-line no-restricted-globals
  const answer = confirm('Delete item?');

  if (answer) {
    const selectedKind = selectedRow.value as MetaObjectKind;
    const response = await dataProvider.delete(selectedKind.uid);
    if (response.isOK) {
      toastHelper.success(response.message);
      await actionUpdate();
    } else {
      toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
}

function onRowDblClick(args:any):void {
  navigateToEdit();
}

function onRowSelect(args:any):void {
  console.log('Row select', args);
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

function beforeDestroy(): void {
  window.removeEventListener('resize', onResize);
}

// Life cycle hooks
onMounted(() => {
  window.addEventListener('resize', onResize);
  windowHeight.value = window.innerHeight;
  actionUpdate();
});

</script>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="$t('metaObjectKinds')"
                            :is-modified="false"
                            :is-waiting="isWaiting" />
      </div>
    </div>
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
    <div class="grid">
      <Divider class="m-2" />
    </div>
    <div class="grid">
      <div class="col-12">
        <div class="card m-1">
          <DataTable
            v-model:selection="selectedRow"
            v-model:value="metadataKinds"
            :style="dataTableStyle()"
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
            <Column field="title" :header="$t('title')"></Column>
            <Column field="name" :header="$t('name')"></Column>
            <Column field="prefix" :header="$t('prefix')"></Column>
            <Column field="storeData" :header="$t('isStoreData')" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.storeData" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
            <Column field="isReference" :header="$t('isReference')" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.isReference" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
            <Column field="isStandard" :header="$t('isStandard')" dataType="boolean">
              <template #body="{ data }">
                <div class="flex justify-content-center flex-wrap">
                  <i v-if="data.isStandard" class="pi pi-check-circle text-green-500"></i>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
