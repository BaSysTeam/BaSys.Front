<script setup lang="ts">
import {
  ref, onMounted, defineProps, computed, PropType,
} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import LogDialog from '@/components/metaObjectWorkflowEditComponents/LogDialog.vue';
import WorkflowLogRecord from '@/models/workflowLogRecord';
import WorkflowLogRecordsProvider from '@/dataProviders/workflowLogRecordsProvider';
import WorkflowSettings from '../../../../shared/src/models/workflowModel/workflowSettings';
import ToastHelper from '../../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
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
const isLogDialogOpen = ref(false);

const dataTableStyle = computed(() => ({
  height: `${windowHeight.value - 250}px`,
  fontSize: '12px',
}));
const dataTableScrollHeight = computed(() => `${windowHeight.value - 250}px`);

// Methods
async function updateAsync(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.getWorkflowLifecycleRecords(props.settings.uid);
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

async function clearLogAsync(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.delete(props.settings.uid);
  isWaiting.value = false;

  if (response.isOK) {
    toastHelper.success(response.message);
    await updateAsync();
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

function kindDisplay(kind: number): string {
  switch (kind) {
    case 1:
      return t('start');
    case 2:
      return t('stop');
    default:
      return '';
  }
}

// Event handlers
function onUpdateClick(): void {
  updateAsync();
}

function onClearClick(): void {
  confirmVue.require({
    message: `${t('clearLog')}?`,
    header: t('confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    rejectLabel: t('cancel'),
    acceptLabel: t('clear'),
    accept: () => clearLogAsync(),
  });
}

function onRowDblClick(): void {
  if (!selectedRow.value) {
    return;
  }

  isLogDialogOpen.value = true;
}

function onLogDialogClose(): void {
  isLogDialogOpen.value = false;
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
                    :class="{'pi-spin': isWaiting}"
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
          :scroll-height="dataTableScrollHeight"
          :metaKeySelection="true"
          showGridlines
          size="small"
          selectionMode="single"
          dataKey="uid"
          :rows="20"
          :rowsPerPageOptions="[20, 50, 100, 500]"
          paginator
          scrollable
          @row-dblclick="onRowDblClick"
        >
          <template #empty> {{$t('noData')}} </template>
          <Column field="raiseDate" :header="$t('period')" style="width:200px"></Column>
          <Column field="runUid" header="Run Uid" style="width: 270px"></Column>
          <Column field="origin" :header="$t('logOrigin')" style="width: 150px"></Column>
          <Column field="userName" :header="$t('user')"></Column>
          <Column field="kind" :header="$t('event')">
            <template #body="{data, field}">
              {{kindDisplay(data[field])}}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <LogDialog v-if="isLogDialogOpen"
             :run-uid="selectedRow.runUid"
             @close="onLogDialogClose"></LogDialog>

</template>

<style scoped>

</style>
