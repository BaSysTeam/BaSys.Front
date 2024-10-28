<script setup lang="ts">
import {
  ref, onMounted, defineProps, PropType,
  watch, defineEmits, nextTick, onBeforeUnmount,
} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { Guid } from 'guid-typescript';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import DataObject from '@/models/dataObject';
import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';
import DataObjectPickUpDialog from '@/components/DataObjectPickUpDialog.vue';
import DataObjectsProvider from '@/dataProviders/dataObjectsProvider';
import SelectItemsProvider from '@/dataProviders/selectItemsProvider';
import MetaObjectColumnViewModel from '@/models/metaObjectColumnViewModel';
import DropdownEditor from '@/components/editors/DropdownEditor.vue';
import SelectItem from '@/models/selectItem';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import DataType from '../../../shared/src/models/dataType';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import MetaObjectCommand from '../../../shared/src/models/metaObjectCommand';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import ObjectEvaluator from '../evalEngine/objectEvaluator';
import CommandProcessor from '../../../shared/src/evalEngine/commandProcessor';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const provider = new DataObjectsProvider();
const selectItemProvider = new SelectItemsProvider();
const toastHelper = new ToastHelper(useToast());
let objectEvaluator: ObjectEvaluator;

// Props
const props = defineProps({
  kind: {
    type: String,
    required: true,
  },
  objectUid: {
    type: String,
    required: true,
  },
  metaObjectSettings: {
    type: Object as PropType<MetaObjectStorableSettings>,
    required: true,
  },
  dataTypes: {
    type: Object as PropType<DataType[]>,
    required: true,
  },
  dataObject: {
    type: Object as PropType<DataObject>,
    required: true,
  },
  table: {
    type: Object as PropType<DataObjectDetailsTable>,
    required: true,
  },
  logger: {
    type: Object as PropType<InMemoryLogger>,
    required: true,
  },
});

// Data
const dataTableRef = ref<any>(null);
const tableKey = ref(0);
const isWaiting = ref(false);
const columns = ref<MetaObjectColumnViewModel[]>([]);
const filters = ref<any>({});
const selectedRecord = ref<any>({});
const windowHeight = ref(window.innerHeight);
const isPickUpOpen = ref<boolean>(false);

const inputStyle = ref<any>({
  width: '100%',
  fontSize: '14px',
  borderRadius: 0,
  padding: '5px',
});

const menuItems = ref<any[]>([]);
const tableCommands = ref<any>({
  label: t('actions'),
  items: [],
});

const emit = defineEmits<{(event: 'isModifiedChanged', newValue: boolean): void;
  (event: 'isWaitingChanged', newValue: boolean): void;
  (event: 'saveTrigger'): void;
  (event: 'refreshTrigger'): void;
  (event: 'closeTrigger'): void;
}>();

// Methods
function tableRows(): any[] {
  if (props.table != null) {
    return props.table.rows;
  }
  return [];
}

function dataTableStyle(): any {
  return {
    height: `${windowHeight.value - 420}px`,
    fontSize: '14px',
  };
}

function dataTableScrollHeight(): string {
  return `${windowHeight.value - 320}px`;
}

function isModifiedChanged(newValue: boolean): boolean {
  // eslint-disable-next-line vue/no-mutating-props
  props.table.isModified = newValue;
  emit('isModifiedChanged', newValue);
  return newValue;
}

async function recalculate(): Promise<void> {
  await objectEvaluator.onObjectRecalculateAsync();
}

function isWaitingChanged(newValue: boolean): void {
  emit('isWaitingChanged', newValue);
}

function saveTrigger(): void {
  emit('saveTrigger');
}

function refreshTrigger(): void {
  emit('refreshTrigger');
}

function closeTrigger(): void {
  emit('closeTrigger');
}

function openPickUp(): void {
  isPickUpOpen.value = true;
}

function initColumns(): void {
  columns.value = [];
  console.log('MetaObjectSettings', props.metaObjectSettings);
  if (!props.metaObjectSettings) {
    return;
  }

  // Get current table.
  const tableSettings = props.metaObjectSettings.detailTables.find(
    (x) => x.uid === props.table.uid,
  );
  if (!tableSettings) {
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  tableSettings.columns.forEach((column) => {
    if (column.name === 'id'
    || column.name === 'object_uid'
    || column.name === 'row_number') {
      return;
    }
    const isPrimitive = DataTypeDefaults.IsPrimitiveType(column.dataTypeUid);

    const columnName = isPrimitive ? column.name : `${column.name}_display`;

    const columnViewModel = new MetaObjectColumnViewModel(
      column,
      props.dataTypes,
    );

    columnViewModel.name = columnName;
    columnViewModel.setDefaultStyle();

    if (columnViewModel.name === 'row_number') {
      columnViewModel.setWidth('50px');
      columnViewModel.title = '#';
      columnViewModel.isInt = false;
      columnViewModel.isNumber = false;
      columnViewModel.readonly = true;
    }

    columns.value.push(columnViewModel);
  });
}

function getColumn(name: string): MetaObjectColumnViewModel {
  const column = columns.value.find((x) => x.name === name);
  if (!column) {
    return new MetaObjectColumnViewModel(null, props.dataTypes);
  }
  return column;
}

function parseDisplayName(displayName: string): { valueName: string, displayName: string } {
  const names = {
    valueName: '',
    displayName,
  };
  const ind = displayName.lastIndexOf('_display');
  if (ind > -1) {
    names.valueName = displayName.substring(0, ind);
  }
  return names;
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

function initFilters(): void {
  if (tableRows().length > 0) {
    const first = tableRows()[0];

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

async function loadData(): Promise<void> {
  if (props.table.rows.length > 0) {
    return;
  }
  isWaiting.value = true;
  const response = await provider.getDetailsTable(
    props.kind,
    props.metaObjectSettings.name,
    props.objectUid,
    props.table.name,
  );
  if (response.isOK) {
    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows = response.data.rows;
    initFilters();
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
  await nextTick(() => {
    if (props.table.rows.length) {
      // eslint-disable-next-line prefer-destructuring
      selectedRecord.value = props.table.rows[0];
    }
  });
  isWaiting.value = false;
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

async function executeTableCommandAsync(command: MetaObjectCommand): Promise<void> {
  console.log(`Executed ${command.title}`);
  const additionalFunctions = {
    isModified: isModifiedChanged,
    isWaiting: isWaitingChanged,
    recalculate,
    save: saveTrigger,
    refresh: refreshTrigger,
    close: closeTrigger,
    openPickUp,
  };

  const commandProcessor = new CommandProcessor(
    props.dataObject,
    additionalFunctions,
    props.logger,
  );
  await commandProcessor.executeAsync(command.expression);

  if (commandProcessor.error) {
    const message = `Command "${command.title}" error: ${commandProcessor.error}`;
    toastHelper.error(message);
  }
}

async function onAddClick(): Promise<void> {
  const tableSettings = props.metaObjectSettings.detailTables.find(
    (x) => x.uid === props.table.uid,
  );
  if (!tableSettings) {
    return;
  }

  const ind = props.table.rows.indexOf(selectedRecord.value);
  const newRow = props.table.newRow(tableSettings, props.dataTypes, props.objectUid, ind);
  if (ind === -1) {
    tableKey.value += 1;
  }

  selectedRecord.value = newRow;
  await objectEvaluator.onTableChangedAsync(props.table.name, props.table.uid);

  isModifiedChanged(true);
}

function onClearFiltersClick(): void {
  initFilters();
}

function init(): void {
  initColumns();
  initFilters();

  tableCommands.value.items = [];
  props.metaObjectSettings.commands.forEach((command) => {
    if (command.isActive && command.tableUid === props.table.uid) {
      tableCommands.value.items.push({
        label: command.title,
        command: () => executeTableCommandAsync(command),
      });
    }
  });

  menuItems.value = [];
  menuItems.value.push({
    icon: 'pi pi-plus',
    class: 'text-primary',
    command: () => onAddClick(),
  }, {
    label: 'Filters',
    icon: 'pi pi-filter-slash',
    class: 'text-primary',
    command: () => onClearFiltersClick(),
  });
  if (tableCommands.value.items.length) {
    menuItems.value.push(tableCommands.value);
  }

  objectEvaluator = new ObjectEvaluator(props.logger, props.metaObjectSettings, props.dataObject);
}

// Event handlers
watch(
  () => props.objectUid,
  () => {
    init();
    loadData();
  },
);

watch(
  () => props.metaObjectSettings,
  () => {
    init();
    loadData();
  },
);

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

async function onCellEditComplete(event: any): Promise<void> {
  const row = event.data;
  const columnName: string = event.field as string;
  const newRow = event.newData;

  const names = parseDisplayName(columnName);
  row[columnName] = newRow[columnName];
  if (names.valueName) {
    row[names.valueName] = newRow[names.valueName];
    await objectEvaluator.onRowFieldChangedAsync(names.valueName, props.table.uid, row);
  } else {
    await objectEvaluator.onRowFieldChangedAsync(columnName, props.table.uid, row);
  }

  isModifiedChanged(true);
}

function onDropDownSelected(row: any, field: string, selectItem: SelectItem): void {
  const names = parseDisplayName(field);
  if (names.valueName) {
    row[names.valueName] = selectItem.value;
  }
  row[names.displayName] = selectItem.text;
}

async function onRowDeleteClick(row: any): Promise<void> {
  const ind = props.table.rows.indexOf(row);
  if (ind > -1) {
    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows.splice(ind, 1);
    isModifiedChanged(true);
  }
  await objectEvaluator.onTableChangedAsync(props.table.name, props.table.uid);
}

async function onRowCopyClick(row: any): Promise<void> {
  const newRow: any = {};
  Object.entries(row).forEach(([key, value]) => {
    newRow[key] = value;
  });
  newRow.row_number = props.table.rows.length + 1;
  newRow.id = Guid.create();

  const ind = props.table.rows.indexOf(row);
  if (ind > -1) {
    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows.splice(ind + 1, 0, newRow);
  }

  selectedRecord.value = newRow;
  isModifiedChanged(true);
  await objectEvaluator.onTableChangedAsync(props.table.name, props.table.uid);
}

function onRowUpClick(row: any): void {
  const ind = props.table.rows.indexOf(row);
  if (ind > 0) {
    const nextInd = ind - 1;
    const rowNext = props.table.rows[nextInd];

    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows[nextInd] = row;
    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows[ind] = rowNext;
    isModifiedChanged(true);
  }
}

function onRowDownClick(row: any): void {
  const ind = props.table.rows.indexOf(row);
  const nextInd = ind + 1;
  if (nextInd > 0 && nextInd <= props.table.rows.length - 1) {
    const rowNext = props.table.rows[nextInd];

    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows[nextInd] = row;
    // eslint-disable-next-line vue/no-mutating-props
    props.table.rows[ind] = rowNext;
    isModifiedChanged(true);
  }
}

function onRowRecalculateClick(row: any): void {
  isWaiting.value = true;
  objectEvaluator.onRowRecalculateAsync(props.table.name, props.table.uid, row);
  isWaiting.value = false;
  isModifiedChanged(true);
}

function onPageChanged(args: any): void {
  console.log('Page changed', args);
  if (props.table.rows.length > args.first) {
    selectedRecord.value = props.table.rows[args.first];
  }
}

function onPickUpClose(): void {
  isPickUpOpen.value = false;
}

// Life cycle hooks
onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', onResize);
  });

  init();

  loadData();
  nextTick(() => {
    if (props.table.rows.length) {
      // eslint-disable-next-line prefer-destructuring
      selectedRecord.value = props.table.rows[0];
    }
  });

  objectEvaluator = new ObjectEvaluator(
    props.logger,
    props.metaObjectSettings,
    props.dataObject,
  );
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
  <Menubar :model="menuItems" style="margin-bottom: 3px; padding: 0; font-size: 14px;">
    <template #end>
      <Badge class="mr-1" :value="table.rows.length" />
    </template>
  </Menubar>
  <DataTable
    v-model:selection="selectedRecord"
    v-model:filters="filters"
    :style="dataTableStyle()"
    :scroll-height="dataTableScrollHeight()"
    :value="tableRows()"
    :metaKeySelection="true"
    :rows="100"
    :rowsPerPageOptions="[10, 20, 50, 100, 500]"
    :key="tableKey"
    ref="dataTableRef"
    data-key="id"
    showGridlines
    selectionMode="single"
    paginator
    scrollable
    filterDisplay="menu"
    size="small"
    edit-mode="cell"
    @cell-edit-complete="onCellEditComplete"
    @page="onPageChanged"
    :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }:any) => ({
                        class: [{ 'p-0': state['d_editing'] }]
                    })
                }
            }"
  >
    <template #empty>{{ $t('noItemsFound') }}</template>
    <Column header="#" style="max-width:50px; min-width:50px; width: 50px;">
      <template #body="{data}">
        {{ table.rows.indexOf(data) + 1 }}
      </template>
    </Column>
    <Column
      v-for="col of columns"
      :key="col.name"
      :field="col.name"
      :header="col.title"
      :style="col.style"
    >
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
          <label for="isBoolean-filter" class="font-bold"> {{ col.title }} </label>
          <TriStateCheckbox v-model="filterModel.value" inputId="isBoolean-filter" />
        </template>
      </template>
      <template v-if="!col.readonly" #editor="{ data, field }">
        <template v-if="getColumn(field).isTextInput || getColumn(field).isTextArea">
          <InputText v-model="data[field]"
                     class="w-full border-noround"
                     style="padding: 5px"
                     size="small"
                     autocomplete="off"
                     autofocus="true"/>
        </template>
        <template v-else-if="getColumn(field).isInt">
          <InputNumber v-model="data[field]"
                       :input-style="inputStyle"
                       autocomplete="off"
                       size="small"
                       autofocus/>
        </template>
        <template v-else-if="getColumn(field).isNumber">
          <InputNumber v-model="data[field]"
                       :min-fraction-digits="getColumn(field).numberDigits"
                       :max-fraction-digits="getColumn(field).numberDigits"
                       :input-style="inputStyle"
                       autocomplete="off"
                       size="small"
                       variant="filled"
                       autofocus
          />
        </template>
        <template v-else-if="getColumn(field).isCheckbox">
          <Checkbox :binary="true"
                    v-model="data[field]">
          </Checkbox>
        </template>
        <template v-else-if="getColumn(field).isSwitch">
          <InputSwitch v-model="data[field]">
          </InputSwitch>
        </template>
        <template v-else-if="getColumn(field).isDateInput">
          <Calendar :show-time="false"
                    :show-icon="true"
                    :show-button-bar="true"
                    :input-style="inputStyle"
                    iconDisplay="input"
                    date-format="dd.mm.yy"
                    class="w-full"
                    v-model="data[field]"></Calendar>
        </template>
        <template v-else-if="getColumn(field).isDateTimeInput">
          <Calendar :show-time="true"
                    :show-icon="true"
                    :show-button-bar="true"
                    :input-style="inputStyle"
                    iconDisplay="input"
                    date-format="dd.mm.yy"
                    class="w-full"
                    v-model="data[field]"></Calendar>
        </template>
        <template v-else-if="getColumn(field).isDropdown">
          <DropdownEditor class="border-noround"
                          :data-type-uid="getColumn(field).dataTypeUid"
                          :provider="selectItemProvider"
                          :input-style="inputStyle"
                          v-model="data[parseDisplayName(field).valueName]"
                          @selected="(args:any):any => onDropDownSelected(data, field, args)">

          </DropdownEditor>
        </template>
        <template v-else>
          {{ data[field] }}
        </template>
      </template>
    </Column>
    <Column :header="$t('actions')"
            style="max-width:200px; min-width:200px; width: 200px;">
      <template #body="{ data }">

        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowDeleteClick(data)">
          <span class="pi pi-times text-red-500"></span>
        </a>
        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowCopyClick(data)">
          <span class="pi pi-clone text-primary"></span>
        </a>
        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowUpClick(data)">
          <span class="pi pi-arrow-up text-primary"></span>
        </a>
        <a href="#"
           class="mr-2 bs-row-action"
           tabindex="-1"
           @click.prevent="onRowDownClick(data)">
          <span class="pi pi-arrow-down text-primary"></span>
        </a>
        <a href="#"
           class="bs-row-action"
           tabindex="-1"
           v-tooltip="$t('recalculate')"
           @click.prevent="onRowRecalculateClick(data)">
          <span class="pi pi-replay text-primary"></span>
        </a>
      </template>
    </Column>
  </DataTable>

  <DataObjectPickUpDialog v-if="isPickUpOpen"
                          @close="onPickUpClose"></DataObjectPickUpDialog>

</template>

<style>
.bs-row-action span{
  font-size: 12px!important;
}

.p-tabview-nav-link  {
  padding: 0.5rem!important;
}

.p-submenu-list{
  z-index: 10;
}
</style>
