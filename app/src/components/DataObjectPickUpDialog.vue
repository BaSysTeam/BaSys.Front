<script lang="ts" setup>
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits,
  watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Guid } from 'guid-typescript';
import PickUpSettings from '@/models/pickUpSettings';
import PickUpColumnSettings from '@/models/pickUpColumnSettings';
import PickUpColumnSettingsViewModel from '@/models/pickUpColumnSettingsViewModel';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import BaSysDataTable from '../../../shared/src/evalEngine/dataTable';
import BaSysDataTableColumn from '../../../shared/src/evalEngine/dataTableColumn';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  dataTable: {
    type: Object as PropType<BaSysDataTable>,
    required: true,
  },
  settings: {
    type: Object as PropType<PickUpSettings>,
    required: false,
  },
  tableName: {
    type: String,
    required: true,
  },
});

// Emit
const emit = defineEmits(
  {
    close: () => true,
    add: (data: any[], tableName: string) => true,
    fill: (data: any[], tableName: string) => true,
  },
);

// Defaults
const defaultDialogWidth = '80%';
const defaultDialogHeight = '80%';
const defaultRowsPerPage = 10;
const defaultRowsPerPageSource = [10, 20, 50, 100];

// Data
const formTitle = ref<string>(t('pickUp'));
const rows = ref<any[]>([]);
const columns = ref<any[]>([]);
const filters = ref<any>({});
const isInitialized = ref<boolean>(false);
const selection = ref<any[]>([]);
const dialogWidth = ref(defaultDialogWidth);
const dialogHeight = ref(defaultDialogHeight);
const rowsPerPage = ref(defaultRowsPerPage);
const rowsPerPageSource = ref<number[]>(defaultRowsPerPageSource);
const dialogStyle = computed(() => ({ width: dialogWidth.value }));
const contentStyle = computed(() => ({ height: dialogHeight.value }));

// Methods
function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

function dataTableStyle(): any {
  return {
    fontSize: '14px',
  };
}

function getColumn(name: string): any {
  let column = columns.value.find((x) => x.name === name);
  if (!column) {
    column = {
      name: 'unknown',
      title: 'unknown',
      isCheckbox: false,
    };
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

function isDate(value: any): boolean {
  // eslint-disable-next-line no-restricted-globals
  return value instanceof Date && !isNaN(value.getTime());
}

function initColumns(sourceTable: BaSysDataTable, settings: PickUpSettings | undefined): void {
  if (!sourceTable) {
    return;
  }

  columns.value = [];
  if (!settings) {
    // Auto-init columns

    sourceTable.columns.forEach((column: BaSysDataTableColumn): void => {
      if (!sourceTable.getColumn(`${column.name}_display`)) {
        let dataType = 'string';
        if (sourceTable.rows.length) {
          const firstRow = sourceTable.rows[0];
          const currentValue = firstRow[column.name];
          if (typeof currentValue === 'boolean') {
            dataType = 'boolean';
          } else if (typeof currentValue === 'number') {
            dataType = 'number';
          } else if (isDate(currentValue)) {
            dataType = 'date';
          }
        }

        const newColumn = new PickUpColumnSettingsViewModel({
          name: column.name,
          title: '',
          dataType,
        });
        const names = parseDisplayName(column.name);
        if (names.valueName) {
          newColumn.title = names.valueName;
        } else {
          newColumn.title = column.name;
        }
        columns.value.push(newColumn);
      }
    });
  } else {
    // Init columns by settings.
    settings.columns.forEach((columnSettings: PickUpColumnSettings): void => {
      columns.value.push(new PickUpColumnSettingsViewModel(columnSettings));
    });
  }
}

function initFilters(): void {
  filters.value = {};
  filters.value.global = {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  };

  columns.value.forEach((column: PickUpColumnSettingsViewModel): void => {
    if (column.isBoolean) {
      filters.value[column.name] = {
        value: null,
        matchMode: FilterMatchMode.EQUALS,
        columnDataType: 'boolean',
      };
    } else if (column.isNumber) {
      filters.value[column.name] = {
        operator: FilterOperator.AND,
        constraints: [{
          value: null,
          matchMode: FilterMatchMode.EQUALS,
          columnDataType: 'numeric',
        }],
      };
    } else if (column.isDate) {
      filters.value[column.name] = {
        operator: FilterOperator.AND,
        constraints: [{
          value: null,
          matchMode: FilterMatchMode.DATE_AFTER,
          columnDataType: 'date',
        }],
      };
    } else {
      // string
      filters.value[column.name] = {
        operator: FilterOperator.AND,
        constraints: [{
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          columnDataType: 'text',
        }],
      };
    }
  });
}

function init(sourceTable: BaSysDataTable, settings: PickUpSettings | undefined): void {
  if (!sourceTable) {
    return;
  }

  if (settings) {
    formTitle.value = settings.title || t('pickUp');
    dialogWidth.value = settings.width || defaultDialogWidth;
    dialogHeight.value = settings.height || defaultDialogHeight;
    rowsPerPage.value = settings.rowsPerPage || defaultRowsPerPage;
    rowsPerPageSource.value = settings.rowsPerPageSource || defaultRowsPerPageSource;
  }

  initColumns(sourceTable, settings);
  initFilters();
  isInitialized.value = true;
}

function loadData(sourceTable: BaSysDataTable): void {
  // Load data.
  rows.value = [];
  sourceTable.rows.forEach((row) => {
    // eslint-disable-next-line no-underscore-dangle
    row._key = Guid.create()
      .toString();
    rows.value.push(row);
  });
}

function formatValue(row: any, field: string): any {
  const column = columns.value.find((x) => x.name === field);

  if (column) {
    if (column.isDate) {
      return ValuesFormatter.formatDateTime(row[field]);
    }
  }

  return row[field];
}

function onAddClick(): void {
  emit('add', selection.value, props.tableName);
}

function onFillClick(): void {
  emit('fill', selection.value, props.tableName);
}

function isColumnDataTypeNumber(param: any): boolean {
  return param.columnDataType === 'numeric';
}

function isColumnDataTypeString(param: any): boolean {
  return param.columnDataType === 'text';
}

function isColumnDataTypeBoolean(param: any): boolean {
  return param.columnDataType === 'boolean';
}

function isColumnDataTypeDate(param: any): boolean {
  return param.columnDataType === 'date';
}

// Event handlers
watch(
  () => props.dataTable,
  (newValue) => {
    init(newValue, props.settings);
    loadData(newValue);
  },
  {
    immediate: false,
  },
);

function onCloseClick(): void {
  emit('close');
}

function onClearFiltersClick(): void {
  initFilters();
}

// Life cycle hooks
onBeforeMount(() => {
  init(props.dataTable, props.settings);
});

onMounted(() => {
  loadData(props.dataTable);
});

</script>

<template>
  <Dialog
    :contentStyle="contentStyle"
    :draggable="false"
    :header="formTitle"
    :style="dialogStyle"
    :visible="true"
    class="pb-0 bs-pick-up-dialog"
    maximizable
    modal
    position="top"
    @update:visible="updateVisible">
    <div>
      <DataTable
        v-if="isInitialized"
        v-model:filters="filters"
        v-model:selection="selection"
        :metaKeySelection="true"
        :rows="rowsPerPage"
        :rowsPerPageOptions="rowsPerPageSource"
        :style="dataTableStyle()"
        :value="rows"
        data-key="_key"
        filterDisplay="menu"
        paginator
        scroll-height="flex"
        scrollable
        showGridlines
        size="small"
      >
        <template #empty>{{ $t('noItemsFound') }}</template>
        <Column headerStyle="width: 3rem" selectionMode="multiple"></Column>
        <Column
          v-for="col of columns"
          :key="col.name"
          :data-type="col.filterDataType"
          :field="col.name"
          :header="col.title"
          :style="col.style">
          <template #body="{ data, field }">

            <template v-if="getColumn(field).isBoolean">
              <span v-if="data[field]" class="pi pi-check text-primary"></span>
            </template>
            <template v-else>
              {{ formatValue(data, field) }}
            </template>

          </template>
          <template #filter="{ filterModel }">
            <template v-if="isColumnDataTypeNumber(filterModel)">
              <InputNumber v-model="filterModel.value" mode="decimal"/>
            </template>
            <template v-if="isColumnDataTypeString(filterModel)">
              <InputText
                v-model="filterModel.value"
                :placeholder="`Search by ${col.title}`"
                class="p-column-filter"
                type="text"
              />
            </template>
            <template v-if="isColumnDataTypeBoolean(filterModel)">
              <div style="min-width: 200px">
                <TriStateCheckbox v-model="filterModel.value" inputId="verified-filter"/>
              </div>
            </template>
            <template v-if="isColumnDataTypeDate(filterModel)">
              <div style="min-width: 200px">
                <Calendar
                  v-model="filterModel.value"
                  :show-time="true"
                  :show-icon="true"
                  :show-button-bar="true"
                  iconDisplay="input"
                  date-format="dd.mm.yy"

                />
              </div>
            </template>
          </template>

        </Column>
      </DataTable>
    </div>
    <template #footer>

      <Button
        :label="$t('clearFilters')"
        class="mr-1"
        icon="pi pi-filter-slash"
        outlined
        severity="secondary"
        size="small"
        @click="onClearFiltersClick"
      />
      <Button
        :label="$t('close')"
        class="mr-1"
        icon="pi pi-times"
        outlined
        severity="secondary"
        size="small"
        @click="onCloseClick"
      />
      <Button
        v-tooltip.top="$t('pickUpAddTooltip')"
        :label="$t('add')"
        class="mr-1"
        outlined
        severity="primary"
        size="small"
        @click="onAddClick"
      />
      <Button
        v-tooltip.top="$t('pickUpFillTooltip')"
        :label="$t('fill')"
        outlined
        severity="primary"
        size="small"
        @click="onFillClick"
      />

    </template>
  </Dialog>
</template>

<style>
.bs-pick-up-dialog .p-dialog-header {
  border-bottom: 1px solid #ececec;
  padding-bottom: 15px;
}

.bs-pick-up-dialog .p-dialog-footer {
  border-top: 1px solid #ececec;
  padding-top: 5px;
  padding-bottom: 15px;
}
</style>
