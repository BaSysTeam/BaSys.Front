<script setup lang="ts">
import {
  ref, onMounted, defineProps, defineEmits, computed,
} from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import WorkflowLogRecord from '@/models/workflowLogRecord';
import WorkflowLogRecordsProvider from '@/dataProviders/workflowLogRecordsProvider';
import ToastHelper from '../../../../shared/src/helpers/toastHelper';
import ViewTitleComponent from '../../../../shared/src/components/ViewTitleComponent.vue';

// Infrastructure
const toastHelper = new ToastHelper(useToast());
const provider = new WorkflowLogRecordsProvider();

// Props
const props = defineProps({
  runUid: { type: String, required: true },
});

// Data
const isWaiting = ref(false);
const rows = ref<WorkflowLogRecord[]>([]);
const selectedRow = ref<any>(null);
const windowHeight = ref(window.innerHeight);

const dataTableStyle = computed(() => ({
  height: `${windowHeight.value - 300}px`,
  fontSize: '12px',
}));

// Emit
const emit = defineEmits(
  {
    close: () => true,
  },
);

// Methods
async function updateAsync(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.getRecordsByRun(props.runUid);
  isWaiting.value = false;

  rows.value = [];
  if (response.isOK) {
    response.data.forEach((item: any) => {
      rows.value.push(new WorkflowLogRecord(item));
    });
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }

  if (rows.value.length > 0) {
    [selectedRow.value] = rows.value;
  }
}

function levelDisplay(level: number): string {
  switch (level) {
    case 0:
      return 'Trace';
    case 1:
      return 'Debug';
    case 2:
      return 'Info';
    case 3:
      return 'Warning';
    case 4:
      return 'Error';
    case 6:
      return 'Critical';
    default:
      return '';
  }
}

// Event handlers
function onCloseClick(): void {
  emit('close');
}

function updateVisible(value: boolean): void {
  if (!value) {
    emit('close');
  }
}

// Life cycle hooks
onMounted(async () => {
  await updateAsync();
});
</script>

<template>
  <Dialog
    modal
    class="pb-0"
    position="top"
    :header="$t('logDetails')"
    :visible="true"
    :draggable="false"
    :maximizable="true"
    :style="{width: '70%'}"
    @update:visible="updateVisible">
    <template #header>
      <ViewTitleComponent :title="$t('logDetails')"
                          :is-waiting="isWaiting"></ViewTitleComponent>

    </template>
    <div>
      <DataTable
        v-model:selection="selectedRow"
        v-model:value="rows"
        :style="dataTableStyle"
        :metaKeySelection="true"
        showGridlines
        size="small"
        selectionMode="single"
        dataKey="uid"
        :rows="20"
        :rowsPerPageOptions="[20, 50, 100, 500]"
        paginator
      >
        <template #empty> {{$t('noData')}} </template>
        <Column field="raiseDate" :header="$t('period')" style="width:200px"></Column>
        <Column field="level" :header="$t('level')" style="width:120px">
          <template #body="{data, field}">
            {{levelDisplay(data[field])}}
          </template>
        </Column>
        <Column field="logMessage" :header="$t('message')"></Column>
      </DataTable>

    </div>
    <template #footer>
      <Button
        class="mr-1"
        label="OK"
        severity="primary"
        size="small"
        outlined
        @click="onCloseClick"
      />
    </template>
  </Dialog>
</template>

<style scoped>

</style>
