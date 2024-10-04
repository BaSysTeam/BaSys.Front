<script setup lang="ts">
import {
  ref, onMounted, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import MetaObject from '@/models/metaObject';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import MetaObjectCreateDialog from '@/components/MetaObjectCreateDialog.vue';
import { useI18n } from 'vue-i18n';
import MetaObjectCreateDto from '@/models/metaObjectCreateDto';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// @component
const name = 'MetaObjectsListView';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({
  kind: { type: String, required: true },
});

// Data
const isWaiting = ref(false);
const isCreateDialogOpen = ref(false);
const kindTitle = ref('');
const items = ref<MetaObject[]>([]);
const selectedRow = ref<any>({});

const dataTableStyle = computed(() => ({
  height: `${window.innerHeight - 150}px`,
}));

const formTitle = computed(() => `${t('metaObjects')}: ${kindTitle.value}`);

const provider = new MetaObjectProvider();

function setCurrentRow(): void {
  if (!items.value.length) {
    return;
  }

  let flagDone = false;

  // Get current name from query parameters.
  const { query } = router.currentRoute.value;
  const currentName = query.current;

  // Find item by name and set as current.
  if (currentName) {
    const searchResult = items.value.find((item) => item.name === currentName);
    if (searchResult) {
      selectedRow.value = searchResult;
      flagDone = true;
    }
  }

  if (!flagDone) {
    // Set first item by default.
    const [firstValue] = items.value;
    selectedRow.value = firstValue;
  }
}

async function updateListAsync(kindName: string): Promise<void> {
  isWaiting.value = true;

  const result = await provider.getKindList(kindName);

  if (result.isOK) {
    kindTitle.value = result.data.title;
    items.value = [];
    result.data.items.forEach((item: any) => {
      items.value.push(item);
    });

    setCurrentRow();
  }

  isWaiting.value = false;
}

function isSelectedRowEmpty(): boolean {
  return Object.keys(selectedRow.value).length === 0;
}

function navigateToEdit(): void {
  if (isSelectedRowEmpty()) {
    return;
  }
  const metaObject = selectedRow.value as MetaObject;
  router.push({ name: 'meta-objects-edit', params: { kind: props.kind, name: metaObject.name } });
}

async function deleteItemAsync(): Promise<void> {
  console.log('Delete item async');
  const metaObject = selectedRow.value as MetaObject;
  const response = await provider.deleteAsync(props.kind, metaObject.name);
  if (response.isOK) {
    // Delete item from array of items.
    toastHelper.success(response.message);
    const ind = items.value.indexOf(selectedRow.value);
    if (ind > -1) {
      items.value.splice(ind, 1);
      if (items.value.length) {
        const [firstValue] = items.value;
        selectedRow.value = firstValue;
      }
    }
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

watch(() => props.kind, async (newVal) => {
  await updateListAsync(newVal);
});

// Event handlers
function onAddClicked(): void {
  isCreateDialogOpen.value = true;
}

function onEditClicked(): void {
  navigateToEdit();
}

async function onDeleteClicked(): Promise<void> {
  console.log('Delete clicked');

  if (isSelectedRowEmpty()) {
    return;
  }

  console.log('Show confirm');
  // eslint-disable-next-line no-restricted-globals,no-alert
  const answer = confirm(t('deleteItemQuestion'));
  if (answer) {
    await deleteItemAsync();
  }
  // TODO: Debug vue confirm. Now it doesn't work.
  /*
  confirmVue.require({
    message: 'Delete item?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => deleteItemAsync,
  });
  */
}

function onRunClick(): void {
  if (isSelectedRowEmpty()) {
    return;
  }
  const metaObject = selectedRow.value as MetaObject;
  const url = `app#/data-objects/${props.kind}/${metaObject.name}`;
  window.open(url, '_blank');
}

function onRowDblClick(): void {
  navigateToEdit();
}

async function onCreateDialogClose(args: MetaObjectCreateDto): Promise<void> {
  isCreateDialogOpen.value = false;
  if (args) {
    console.log('Object to create', args);
    const response = await provider.create(args);
    if (response.isOK) {
      await router.push({ name: 'meta-objects-edit', params: { kind: props.kind, name: args.name } });
    } else {
      toastHelper.error(response.message);
      console.error(response.presentation);
    }
  }
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
      <Button
        class="ml-1"
        severity="success"
        size="small"
        icon="pi pi-play"
        @click="onRunClick"
      />
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
          <Column field="isActive" :header="$t('isActive')" data-type="boolean">
            <template #body="{ data }">
              <div class="flex justify-content-center flex-wrap">
                <i v-if="data.isActive" class="pi pi-check-circle text-green-500"></i>
              </div>
            </template>
          </Column>

        </DataTable>
      </div>
    </div>
  </div>

  <!--Create dialog-->
  <MetaObjectCreateDialog v-if="isCreateDialogOpen"
                             :kind-name="props.kind"
                             :kind-title="kindTitle"
                             @close="onCreateDialogClose"></MetaObjectCreateDialog>
</template>

<style scoped>

</style>
