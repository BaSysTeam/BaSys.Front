<script setup lang="ts">
import {
  ref, onMounted, onDeactivated, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import ConfirmDialog from 'primevue/confirmdialog';
import DataObjectEditDialog from '@/components/DataObjectEditDialog.vue';
import DataObjectWithMetadata from '@/models/dataObjectWithMetadata';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import RecordsButton from '@/components/standardButtons/RecordsButton.vue';
import DataObjectRecordsDialog from '@/components/DataObjectRecordsDialog.vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import DataObjectList from '../models/dataObjectList';
import DataObjectsProvider from '../dataProviders/dataObjectsProvider';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import MetaObjectKindStandardColumn from '../../../shared/src/models/metaObjectKindStandardColumn';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const dataObjectsProvider = new DataObjectsProvider();

// Props
const props = defineProps({
  kind: { type: String, required: true },
  name: { type: String, required: true },
});

// Data
const isWaiting = ref<boolean>(false);
const title = ref<string>('');
const dataObjectList = ref<DataObjectList>(new DataObjectList(null));
const dataTableItems = ref<any[]>([]);
const columns = ref<MetaObjectColumnViewModel[]>([]);
const filters = ref<any>({});
const selectedRecord = ref<any>({});
const selectedUid = ref<string>('');
const copyUid = ref<string>('');
const windowHeight = ref<number>(window.innerHeight);
const isEditDialogOpen = ref<boolean>(false);
const isRecordsDialogOpen = ref<boolean>(false);
const editRegime = ref<string>('edit');

const dataTableStyle = computed(() => ({
  height: `${windowHeight.value - 150}px`,
}));

const canCreateRecords = computed(
  () => dataObjectList.value.metaObjectKindSettings.canCreateRecords,
);

const isSelectedRecordEmpty = computed(
  () => Object.keys(selectedRecord.value).length === 0,
);

// Methods
function getPrimaryKey(): MetaObjectKindStandardColumn | null {
  const filterResult = dataObjectList.value.metaObjectKindSettings.standardColumns
    .filter((x) => x.isPrimaryKey);

  if (!filterResult.length) return null;

  return filterResult[0];
}

function navigateToAdd(): void {
  const kindName = dataObjectList.value.metaObjectKindSettings.name;
  const objectName = dataObjectList.value.metaObjectSettings.name;

  router.push({ name: 'data-objects-add', params: { kind: kindName, name: objectName } });
}

function getCurrentUid(): string {
  const primaryKey = getPrimaryKey();
  if (!primaryKey) return '';

  return selectedRecord.value[primaryKey.name];
}

function navigateToEdit(): void {
  const kindName = dataObjectList.value.metaObjectKindSettings.name;
  const objectName = dataObjectList.value.metaObjectSettings.name;

  const filterResult = dataObjectList.value.metaObjectKindSettings.standardColumns
    .filter((x) => x.isPrimaryKey);

  if (!filterResult.length) return;

  const primaryKey = filterResult[0];
  const uid = selectedRecord.value[primaryKey.name];

  router.push({ name: 'data-objects-edit', params: { kind: kindName, name: objectName, uid } });
}

function navigateToCopy(): void {
  const kindName = dataObjectList.value.metaObjectKindSettings.name;
  const objectName = dataObjectList.value.metaObjectSettings.name;

  const primaryKey = getPrimaryKey();
  if (!primaryKey) {
    return;
  }
  const uid = selectedRecord.value[primaryKey.name];

  router.push({ name: 'data-objects-copy', params: { kind: kindName, name: objectName, copyUid: uid } });
}

function startAdd(): void {
  if (dataObjectList.value.metaObjectSettings.editMethod === 1) {
    selectedUid.value = '';
    editRegime.value = 'add';
    isEditDialogOpen.value = true;
  } else {
    navigateToAdd();
  }
}

function startCopy(): void {
  if (isSelectedRecordEmpty.value) {
    return;
  }
  if (dataObjectList.value.metaObjectSettings.editMethod === 1) {
    selectedUid.value = '';
    copyUid.value = getCurrentUid();
    editRegime.value = 'copy';
    isEditDialogOpen.value = true;
  } else {
    navigateToCopy();
  }
}

function startEdit(): void {
  console.log('start edit, title', title.value);
  if (isSelectedRecordEmpty.value) {
    return;
  }
  if (dataObjectList.value.metaObjectSettings.editMethod === 1) {
    selectedUid.value = getCurrentUid();
    editRegime.value = 'edit';
    isEditDialogOpen.value = true;
  } else {
    navigateToEdit();
  }
}

async function deleteItem(): Promise<void> {
  if (isSelectedRecordEmpty.value) {
    return;
  }
  const primaryKey = getPrimaryKey();
  if (!primaryKey) {
    return;
  }

  // Make delete request.
  isWaiting.value = true;
  const uid = selectedRecord.value[primaryKey.name];
  const response = await dataObjectsProvider.deleteItem(props.kind, props.name, uid);
  isWaiting.value = false;

  if (response.isOK) {
  // Delete item from list to avoid one more backed call.
    const index = dataTableItems.value.findIndex((item) => item[primaryKey.name] === uid);
    if (index !== -1) {
      dataTableItems.value.splice(index, 1);
    }
    toastHelper.success(response.message);
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

function initColumns(): void {
  columns.value = [];
  // eslint-disable-next-line no-restricted-syntax
  dataObjectList.value.metaObjectSettings.header.columns.forEach((column) => {
    const isPrimitive = DataTypeDefaults.IsPrimitiveType(column.dataTypeUid);

    const columnName = isPrimitive ? column.name : `${column.name}_display`;

    const columnViewModel = new MetaObjectColumnViewModel(
      column,
      dataObjectList.value.dataTypes,
    );
    columnViewModel.name = columnName;

    columns.value.push(columnViewModel);
  });
  console.log('init columns list', columns.value);
}

function initFilters(): void {
  if (dataTableItems.value.length > 0) {
    const first = dataTableItems.value[0];

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(first)) {
      if (typeof value === 'number') {
        filters.value[key] = {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS, columnDataType: 'number' }],
        };
      }
      if (typeof value === 'string') {
        filters.value[key] = {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH, columnDataType: 'string' }],
        };
      }
      if (typeof value === 'boolean') {
        filters.value[key] = { value: null, matchMode: FilterMatchMode.NOT_EQUALS, columnDataType: 'boolean' };
      }
    }
  }
}

async function init(): Promise<void> {
  isWaiting.value = true;

  const response = await dataObjectsProvider.getCollection(props.kind, props.name);
  if (response.isOK) {
    dataObjectList.value = response.data;
    dataTableItems.value = dataObjectList.value.items.map((x) => x.header);
    console.log('list response', response.data);
    console.log('items', dataTableItems.value);
    if (dataTableItems.value.length) {
    // eslint-disable-next-line prefer-destructuring
      selectedRecord.value = dataTableItems.value[0];
    }
    title.value = `${dataObjectList.value.metaObjectKindSettings.title}.${dataObjectList.value.metaObjectSettings.title}`;
    document.title = `${title.value} - BaSYS`;
    initColumns();
    initFilters();
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }

  isWaiting.value = false;
}

function getColumn(name: string): MetaObjectColumnViewModel {
  const column = columns.value.find((x) => x.name === name);
  if (!column) {
    return new MetaObjectColumnViewModel(null, dataObjectList.value.dataTypes);
  }
  return column;
}

function formatValue(row: any, field: string): string {
  const column = getColumn(field);

  const value = row[field];
  if (column.isInt) {
    return ValuesFormatter.formatNumber(value, 0);
  }
  if (column.isNumber) {
    return ValuesFormatter.formatNumber(value, column.numberDigits);
  }
  if (column.isDateInput) {
    return ValuesFormatter.formatDate(value);
  }
  if (column.isDateTimeInput) {
    return ValuesFormatter.formatDateTime(value);
  }

  return value;
}

function isColumnDataTypeNumber(param: any): boolean {
  return param.columnDataType === 'number';
}

function isColumnDataTypeString(param: any): boolean {
  return param.columnDataType === 'string';
}

function isColumnDataTypeBoolean(param: any): boolean {
  return param.columnDataType === 'boolean';
}

async function handleItemSaved(savedUid: string): Promise<void> {
  if (!savedUid) {
    return;
  }
  isWaiting.value = true;
  const response = await dataObjectsProvider.getItem(props.kind, props.name, savedUid);
  isWaiting.value = false;

  if (response.isOK) {
    const resultData = new DataObjectWithMetadata(response.data);
    const primaryKey = getPrimaryKey();
    if (!primaryKey) {
      return;
    }
    const uid = resultData.getUid();

    const index = dataTableItems.value.findIndex((item) => item[primaryKey.name] === uid);
    if (index === -1) {
      dataTableItems.value.unshift(resultData.item.header);
      // eslint-disable-next-line prefer-destructuring
      selectedRecord.value = dataTableItems.value[0];
    } else {
      dataTableItems.value.splice(index, 1, resultData.item.header);
      selectedRecord.value = dataTableItems.value[index];
    }
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

// Event handlers
watch(
  () => props.name,
  async () => {
    await init();
  },
);

watch(
  () => props.kind,
  async () => {
    await init();
  },
);

function onAddClick(): void {
  startAdd();
}

function onEditClick(): void {
  if (isSelectedRecordEmpty.value) {
    return;
  }
  startEdit();
}

function onDeleteClick(): void {
  if (isSelectedRecordEmpty.value) {
    return;
  }

  confirmVue.require({
    message: 'Delete item?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => deleteItem(),
  });
}

function onCopyClick(): void {
  startCopy();
}

function onRecordsClick(): void {
  selectedUid.value = getCurrentUid();
  isRecordsDialogOpen.value = true;
}

function onRowDblClick():void {
  startEdit();
}

function onEditDialogClose():void {
  isEditDialogOpen.value = false;
}

function onItemInDialogSaved(savedUid: string): void {
  handleItemSaved(savedUid);
}

function onRecordsDialogClose(): void {
  isRecordsDialogOpen.value = false;
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

// Life cycle hooks
onMounted(() => {
  window.addEventListener('resize', onResize);
  document.title = 'BaSYS';
  windowHeight.value = window.innerHeight;
  init();
});

onDeactivated(() => {
  window.removeEventListener('resize', onResize);
});

</script>

<template>
  <div>
    <div class="grid">
      <div class="col">
        <ViewTitleComponent :title="title" :is-modified="false" :is-waiting="isWaiting"/>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <ButtonGroup>
          <Button
            :label="$t('add')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-plus"
            @click="onAddClick"
          />
          <Button
            :label="$t('edit')"
            severity="primary"
            size="small"
            outlined
            icon="pi pi-pencil"
            @click="onEditClick"
          />
          <Button
            :label="$t('delete')"
            severity="danger"
            size="small"
            outlined
            icon="pi pi-times"
            @click="onDeleteClick"
          />
        </ButtonGroup>
        <RecordsButton v-if="canCreateRecords"
                       @click="onRecordsClick">
        </RecordsButton>
        <Button
          class="ml-1"
          v-tooltip="$t('copy')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-clone"
          @click="onCopyClick"
        />
      </div>
    </div>
    <div class="grid">
      <Divider class="m-2"/>
    </div>
    <div class="grid">
      <div class="col">
        <div class="card m-1">
          <DataTable
            v-model:selection="selectedRecord"
            v-model:filters="filters"
            :style="dataTableStyle"
            :value="dataTableItems"
            :metaKeySelection="true"
            :rows="15"
            paginator
            showGridlines
            @row-dblclick="onRowDblClick"
            selectionMode="single"
            scrollable
            scrollHeight="flex"
            filterDisplay="menu"
            size="small"
          >
            <template #empty>{{ $t('noItemsFound') }}</template>
            <Column
              v-for="col of columns"
              :key="col.name"
              :field="col.name"
              :header="col.title">
              <template #body="{ data, field }">
                <template v-if="getColumn(field).isCheckbox">
                  <span v-if="data[field]" class="pi pi-check text-primary"></span>
                </template>
                <template v-else>
                  {{ formatValue(data, field) }}
                </template>

              </template>
              <template #filter="{ filterModel }">
                <template v-if="isColumnDataTypeNumber(filterModel)">
                  <InputNumber v-model="filterModel.value" mode="decimal" />
                </template>
                <template v-if="isColumnDataTypeString(filterModel)">
                  <InputText
                    v-model="filterModel.value"
                    type="text"
                    class="p-column-filter"
                    :placeholder="`Search by ${col.title}`"
                  />
                </template>
                <template v-if="isColumnDataTypeBoolean(filterModel)">
                  <span for="isBoolean-filter" class="font-bold"> {{ col.title }} </span>
                  <TriStateCheckbox v-model="filterModel.value" inputId="isBoolean-filter" />
                </template>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
    <DataObjectEditDialog v-if="isEditDialogOpen"
                          :title="title"
                          :kind="kind"
                          :name="name"
                          :uid="selectedUid"
                          :copyUid="copyUid"
                          :regime="editRegime"
                          @close="onEditDialogClose"
                          @saved="onItemInDialogSaved"></DataObjectEditDialog>

    <DataObjectRecordsDialog v-if="isRecordsDialogOpen"
                             :kind="kind"
                             :name="name"
                             :uid="selectedUid"
                             @close="onRecordsDialogClose"></DataObjectRecordsDialog>
    <ConfirmDialog :draggable="false"></ConfirmDialog>
  </div>
</template>

<style scoped>

</style>
