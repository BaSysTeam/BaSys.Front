<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, defineEmits,
  watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Guid } from 'guid-typescript';
import PickUpSettings from '@/models/pickUpSettings';
import PickUpColumnSettings from '@/models/pickUpColumnSettings';
import PickUpColumnSettingsViewModel from '@/models/pickUpColumnSettingsViewModel';
import BaSysDataTable from '../../../shared/src/evalEngine/dataTable';
import BaSysDataTableColumn from '../../../shared/src/evalEngine/dataTableColumn';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();

// Props
const props = defineProps({
  dataTable: { type: Object as PropType<BaSysDataTable>, required: true },
  settings: { type: Object as PropType<PickUpSettings>, required: false },
  tableName: { type: String, required: true },
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
    column = { name: 'unknown', title: 'unknown', isCheckbox: false };
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

function initColumns(sourceTable: BaSysDataTable, settings: PickUpSettings | undefined): void {
  if (!sourceTable) {
    return;
  }

  columns.value = [];
  if (!settings) {
    // Auto-init columns

    sourceTable.columns.forEach((column: BaSysDataTableColumn): void => {
      if (!sourceTable.getColumn(`${column.name}_display`)) {
        let dataType = '';
        if (sourceTable.rows.length) {
          const firstRow = sourceTable.rows[0];
          const currentValue = firstRow[column.name];
          if (typeof currentValue === 'boolean') {
            dataType = 'boolean';
          }
        }

        const newColumn = new PickUpColumnSettingsViewModel({ name: column.name, title: '', dataType });
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

  console.log('columns', columns.value);
}

function init(sourceTable: BaSysDataTable, settings: PickUpSettings | undefined): void {
  if (!sourceTable) {
    return;
  }

  rows.value = [];
  sourceTable.rows.forEach((row) => {
    // eslint-disable-next-line no-underscore-dangle
    row._key = Guid.create().toString();
    rows.value.push(row);
  });

  if (settings) {
    formTitle.value = settings.title || t('pickUp');
    dialogWidth.value = settings.width || defaultDialogWidth;
    dialogHeight.value = settings.height || defaultDialogHeight;
    rowsPerPage.value = settings.rowsPerPage || defaultRowsPerPage;
    rowsPerPageSource.value = settings.rowsPerPageSource || defaultRowsPerPageSource;
  }

  initColumns(sourceTable, settings);
}

function formatValue(row: any, field: string): any {
  return row[field];
}

function onAddClick(): void {
  emit('add', selection.value, props.tableName);
}

function onFillClick(): void {
  emit('fill', selection.value, props.tableName);
}

// Event handlers
watch(
  () => props.dataTable,
  (newValue) => {
    init(newValue, props.settings);
  },
  {
    immediate: true,
  },
);

function onCloseClick(): void {
  emit('close');
}

// Life cycle hooks
onMounted(() => {
  init(props.dataTable, props.settings);
});

</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    maximizable
    :header="formTitle"
    :visible="true"
    :draggable="false"
    :style="dialogStyle"
    :contentStyle="contentStyle"
    @update:visible="updateVisible">
    <div>
     <DataTable
       data-key="_key"
       :value="rows"
       v-model:selection="selection"
       :style="dataTableStyle()"
       scroll-height="flex"
       :metaKeySelection="true"
       :rows="rowsPerPage"
       :rowsPerPageOptions="rowsPerPageSource"
       paginator
       showGridlines
       scrollable
       filterDisplay="menu"
       size="small"
     >
       <template #empty>{{ $t('noItemsFound') }}</template>
       <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
       <Column
         v-for="col of columns"
         :key="col.name"
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

       </Column>
     </DataTable>
    </div>
    <template #footer>
      <Button
        class="mr-1"
        :label="$t('close')"
        severity="secondary"
        size="small"
        outlined
        icon="pi pi-times"
        @click="onCloseClick"
      />
      <Button
        v-tooltip.top="$t('pickUpAddTooltip')"
        :label="$t('add')"
        severity="primary"
        size="small"
        outlined
        @click="onAddClick"
      />
      <Button
        v-tooltip.top="$t('pickUpFillTooltip')"
        :label="$t('fill')"
        severity="primary"
        size="small"
        outlined
        @click="onFillClick"
      />
    </template>
  </Dialog>
</template>

<style scoped>

</style>
