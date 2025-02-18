<script setup lang="ts">
import {
  ref, onMounted, defineProps, defineEmits, PropType, watch, computed,
} from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DataObjectRecordsProvider from '@/dataProviders/dataObjectRecordsProvider';
import DataTableColumnViewModel from '@/models/dataTableColumnViewModel';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
const provider = new DataObjectRecordsProvider();
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({
  isActive: { type: Boolean, required: true },
  kind: { type: String, required: true },
  name: { type: String, required: true },
  objectUid: { type: String, required: true },
  registerUid: { type: String, required: true },
  columns: { type: Array as PropType<DataTableColumnViewModel[]>, required: true },
});

// Defaults
const defaultRowsPerPage = 100;
const defaultRowsPerPageSource = [10, 20, 50, 100, 200, 500];

// Data
const rows = ref<any[]>([]);
const isInitialized = ref<boolean>(false);
const rowsPerPage = ref(defaultRowsPerPage);
const rowsPerPageSource = ref<number[]>(defaultRowsPerPageSource);
const dataTableStyle = computed(() => ({
  fontSize: '14px',
}));

// Emits
const emits = defineEmits({
  isWaitingChange: (value: boolean) => true,
});

// Methods
function getColumn(name: string): any {
  let column = props.columns.find((x) => x.name === name);
  if (!column) {
    column = new DataTableColumnViewModel({ name: 'unknown', title: 'unknown' });
  }
  return column;
}

function formatValue(row: any, field: string): any {
  const column = props.columns.find((x) => x.name === field);

  if (column) {
    if (column.isDate) {
      return ValuesFormatter.formatDateTime(row[field]);
    }
    if (column.isNumber) {
      return ValuesFormatter.formatNumber(row[field], column.numberDigits);
    }
  }

  return row[field];
}

async function initAsync(): Promise<void> {
  if (!props.isActive) {
    return;
  }

  if (rows.value.length) {
    return;
  }

  emits('isWaitingChange', true);

  const response = await provider.getRecordsAsync(
    props.kind,
    props.name,
    props.objectUid,
    props.registerUid,
  );

  emits('isWaitingChange', false);

  if (response.isOK) {
    rows.value = response.data.rows;
    isInitialized.value = true;
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

// Event handlers
watch(() => props.isActive, () => { initAsync(); });

// Life cycle hooks
onMounted(async () => {
  await initAsync();
});

</script>

<template>
  <DataTable
    v-if="isInitialized"
    :metaKeySelection="true"
    :rows="rowsPerPage"
    :rowsPerPageOptions="rowsPerPageSource"
    :style="dataTableStyle"
    :value="rows"
    data-key="_key"
    paginator
    scroll-height="flex"
    scrollable
    showGridlines
    size="small"
  >
    <template #empty>{{ $t('noItemsFound') }}</template>
    <Column
      v-for="col of columns"
      :key="col.name"
      :data-type="col.dataType"
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
</template>

<style scoped>

</style>
