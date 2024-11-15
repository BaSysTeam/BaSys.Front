<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DataTable from 'primevue/datatable';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import SplitButton from 'primevue/splitbutton';
import MetaObject from '@/models/metaObject';
import MetaObjectProvider from '@/dataProviders/metaObjectProvider';
import { useI18n } from 'vue-i18n';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Props
const props = defineProps({
  kind: { type: String, required: true },
});

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const provider = new MetaObjectProvider();

// Data
const isWaiting = ref(false);
const kindTitle = ref('');
const kindUid = ref('');
const items = ref<MetaObject[]>([]);
const selectedRow = ref<any>({});
const windowHeight = ref(window.innerHeight);

const dataTableStyle = computed(() => ({
  height: `${windowHeight.value - 150}px`,
}));
const dataTableScrollHeight = computed(() => `${windowHeight.value - 150}px`);
const filters = ref<any>({});

const formTitle = computed(() => `${t('metaObjects')}: ${kindTitle.value}`);
const actionsItems = ref<any[]>([]);

// Methods
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
    kindUid.value = result.data.metaObjectKindUid;
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
  if (props.kind === 'menu') {
    router.push({ name: 'meta-menus-edit', params: { name: metaObject.name } });
  } else {
    router.push({ name: 'meta-objects-edit', params: { kind: props.kind, name: metaObject.name } });
  }
}

function navigateToAdd(): void {
  if (props.kind === 'menu') {
    router.push({ name: 'meta-menus-add', params: { kind: props.kind } });
  } else {
    router.push({ name: 'meta-objects-add', params: { kind: props.kind } });
  }
}

function navigateToCopy(): void {
  if (isSelectedRowEmpty()) {
    return;
  }
  const metaObject = selectedRow.value as MetaObject;
  if (props.kind === 'menu') {
    router.push({ name: 'meta-menus-copy', params: { name: metaObject.name } });
  } else {
    router.push({ name: 'meta-objects-copy', params: { kind: props.kind, name: metaObject.name } });
  }
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

const initFilters = ():void => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    memo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    isActive: { value: null, matchMode: FilterMatchMode.EQUALS, columnDataType: 'boolean' },
  };

  console.log('filters', filters.value);
};

watch(() => props.kind, async (newVal) => {
  await updateListAsync(newVal);
});

// Event handlers
function onResize(): void {
  windowHeight.value = window.innerHeight;
}

function beforeDestroy(): void {
  window.removeEventListener('resize', onResize);
}

function onAddClicked(): void {
  navigateToAdd();
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

function onCopyClick(): void {
  navigateToCopy();
}

function onRowDblClick(): void {
  navigateToEdit();
}

function onUpdateClick(): void {
  updateListAsync(props.kind);
}

function onDropFiltersClick(): void {
  initFilters();
}

// Life cycle hooks
onBeforeMount(() => {
  actionsItems.value = [
    {
      label: t('update'),
      icon: 'pi pi-sync',
      command: onUpdateClick,
    },
    {
      label: t('clearFilters'),
      icon: 'pi pi-filter-slash',
      command: onDropFiltersClick,
    },
  ];

  initFilters();
});

onMounted(async () => {
  window.addEventListener('resize', onResize);
  windowHeight.value = window.innerHeight;
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
        v-tooltip="$t('copy')"
        severity="primary"
        size="small"
        outlined
        icon="pi pi-clone"
        @click="onCopyClick"
      />
      <Button
        v-if="kind !='menu'"
        class="ml-1"
        severity="success"
        size="small"
        icon="pi pi-play"
        @click="onRunClick"
      />
      <SplitButton
        :label="$t('actions')"
        severity="primary"
        size="small"
        class="ml-1"
        outlined
        :model="actionsItems"
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
          v-model:filters="filters"
          :value="items"
          :style="dataTableStyle"
          :scroll-height="dataTableScrollHeight"
          :metaKeySelection="true"
          showGridlines
          scrollable
          size="small"
          selectionMode="single"
          filterDisplay="menu"
          dataKey="uid"
          @row-dblclick="onRowDblClick"
        >
          <template #empty> {{$t('noItemsFound')}} </template>
          <Column header="#" style="width: 50px">
            <template #body="currentRow">
              {{ currentRow.index + 1 }}
            </template>
          </Column>
          <Column field="title" :header="$t('title')">
            <template #filter="{filterModel}">
              <InputText v-model="filterModel.value"
                         type="text"
                         class="p-column-filter" />
            </template>
          </Column>
          <Column field="name" :header="$t('name')">
            <template #filter="{filterModel}">
              <InputText v-model="filterModel.value"
                         type="text"
                         class="p-column-filter" />
            </template>
          </Column>
          <Column field="memo" :header="$t('memo')">
            <template #filter="{filterModel}">
              <InputText v-model="filterModel.value"
                         type="text"
                         class="p-column-filter" />
            </template>
          </Column>
          <Column field="isActive" :header="$t('isActive')" data-type="boolean">
            <template #body="{ data }">
              <div class="flex justify-content-center flex-wrap">
                <i v-if="data.isActive" class="pi pi-check-circle text-green-500"></i>
              </div>
            </template>
            <template #filter="{filterModel}">
              <div  style="min-width: 150px">
                <label for="verified-filter" class="font-bold"> {{$t('isActive')}} </label>
                <span>&nbsp;</span>
                <TriStateCheckbox v-model="filterModel.value" inputId="verified-filter" />
              </div>

            </template>
          </Column>

        </DataTable>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
