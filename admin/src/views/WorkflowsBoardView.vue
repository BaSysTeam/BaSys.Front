<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, onBeforeUnmount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import WorkflowsBoardProvider from '@/dataProviders/workflowsBoardProvider';
import WorkflowInfo from '@/models/workflowInfo';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';
import ToastHelper from '../../../shared/src/helpers/toastHelper';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const provider = new WorkflowsBoardProvider();
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({});

// Data
const isWaiting = ref(false);
const rows = ref<WorkflowInfo[]>([]);
const selectedRow = ref<any>(null);
const windowHeight = ref(window.innerHeight);

const dataTableStyle = computed(() => ({
  height: `${windowHeight.value - 220}px`,
  fontSize: '0.8rem',
}));
const dataTableScrollHeight = computed(() => `${windowHeight.value - 220}px`);
const formTitle = computed(() => `${t('workflowsBoard')} (${rows.value.length})`);

// Methods
async function updateAsync(): Promise<void> {
  isWaiting.value = true;
  const response = await provider.getInfo();
  isWaiting.value = false;

  rows.value = [];
  if (response.isOK) {
    response.data.forEach((item) => {
      rows.value.push(new WorkflowInfo(item));
    });
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

async function terminateAsync(runUid: string): Promise<void> {
  isWaiting.value = true;
  const response = await provider.terminateAsync(runUid);
  isWaiting.value = false;

  if (response.isOK) {
    toastHelper.success(response.message);
    await updateAsync();
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

function statusDisplay(status: number): string {
  switch (status) {
    case 0:
      return 'Waiting';
    case 1:
      return 'Running';
    case 2:
      return 'Suspended';
    case 3:
      return 'Completed';
    case 4:
      return 'Terminated';
    default:
      return '';
  }
}

// Event handlers
function onUpdateClick(): void {
  updateAsync();
}

function onRowTerminateClick(row: WorkflowInfo): void {
  terminateAsync(row.runUid);
}

function onResize(): void {
  windowHeight.value = window.innerHeight;
}

// Life cycle hooks
onMounted(async () => {
  window.addEventListener('resize', onResize);

  await updateAsync();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up on unmount
});

</script>

<template>
  <div>

    <!-- Form title-->
    <div class="grid">
      <div class="col-12">
        <ViewTitleComponent :title="formTitle"
                            :is-modified="false"
                            :is-waiting="isWaiting"/>
      </div>
    </div>

    <!-- Command panel -->
    <div class="grid">
      <div class="col-12">
        <Button
          :label="$t('update')"
          severity="primary"
          size="small"
          outlined
          icon="pi pi-refresh"
          @click="onUpdateClick"
        />
      </div>
    </div>

    <!--Divider-->
    <div class="grid">
      <div class="col-12">
        <Divider class="m-2" />
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
          <Column field="createTime" :header="$t('period')" style="width:220px"></Column>
          <Column field="status" :header="$t('status')" style="width:120px">
            <template #body="{data, field}">
              {{statusDisplay(data[field])}}
            </template>
          </Column>
          <Column field="version" :header="$t('version')" style="width: 70px"></Column>
          <Column field="runUid" header="Run Uid" style="width: 300px"></Column>
          <Column field="origin" :header="$t('logOrigin')" style="width: 150px"></Column>
          <Column field="workflowTitle" :header="$t('workflow')"></Column>
          <Column field="userName" :header="$t('user')"></Column>
          <Column :header="$t('actions')"
                  style="max-width:200px; min-width:200px; width: 200px;">
            <template #body="{ data }">

              <a href="#"
                 v-if="(data.status == 0 || data.status == 1) && !isWaiting"
                 v-tooltip.top="$t('stop')"
                 class="mr-2 bs-row-action"
                 tabindex="-1"
                 @click.prevent="onRowTerminateClick(data)">
                <span class="pi pi-stop-circle text-red-500"></span>
              </a>

            </template>
          </Column>
        </DataTable>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
