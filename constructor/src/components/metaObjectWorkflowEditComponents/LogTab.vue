<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed, PropType,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import WorkflowLogRecord from '@/models/workflowLogRecord';
import WorkflowLogRecordsProvider from '@/dataProviders/workflowLogRecordsProvider';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';
import ToastHelper from '../../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const toastHelper = new ToastHelper(useToast());
const provider = new WorkflowLogRecordsProvider();

// Props
const props = defineProps({
  settings: {
    type: Object as PropType<WorkflowSettings>,
    required: true,
  },
});

// Data
const isWaiting = ref(false);
const rows = ref<WorkflowLogRecord[]>([]);
const selectedRow = ref<any>(null);
const windowHeight = ref(window.innerHeight);

const dataTableStyle = computed(() => ({
  height: `${windowHeight.value - 150}px`,
  fontSize: '12px',
}));

// Methods
async function updateAsync(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.GetWorkflowLifecycleRecords(props.settings.uid);
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

// Event handlers
function onUpdateClick(): void {
  updateAsync();
}

function onClearClick(): void {
  console.log('onClearClick');
}

function onRowDblClick(): void {
  console.log('onRowDblClick');
}

// Life cycle hooks
onMounted(async () => {
  await updateAsync();
});

</script>

<template>
  <div>
    <!--Command panel-->
    <div class="grid">
      <div class="col-12">
        <Toolbar style="padding: 0.2rem; margin-bottom: 0.2rem">
          <template #start>
            <Button icon="pi pi-sync"
                    v-tooltip.top="$t('update')"
                    severity="primary"
                    size="small"
                    text
                    @click="onUpdateClick" />

            <Button icon="pi pi-exclamation-circle"
                    :label="$t('clearLog')"
                    severity="danger"
                    size="small"
                    text
                    @click="onClearClick" />
          </template>
        </Toolbar>
      </div>
    </div>

    <!-- List-->
    <div class="grid">
      <div class="col-12">
        <DataTable
          v-model:selection="selectedRow"
          v-model:value="rows"
          :style="dataTableStyle"
          :metaKeySelection="true"
          showGridlines
          size="small"
          selectionMode="single"
          dataKey="uid"
          @row-dblclick="onRowDblClick"
        >
          <template #empty> {{$t('noData')}} </template>
          <Column field="raiseDate" :header="$t('period')"></Column>
          <Column field="runUid" header="Run Uid"></Column>
          <Column field="origin" :header="$t('origin')"></Column>
          <Column field="userName" :header="$t('userName')"></Column>
          <Column field="logMessage" :header="$t('message')"></Column>
        </DataTable>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
