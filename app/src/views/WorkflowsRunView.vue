<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Listbox from 'primevue/listbox';
import DataView from 'primevue/dataview';
import WorkflowsProvider from '@/dataProviders/workflowsProvider';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import ViewTitleComponent from '../../../shared/src/components/ViewTitleComponent.vue';

// Infrastructure
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const confirmVue = useConfirm();
const provider = new WorkflowsProvider();
const toastHelper = new ToastHelper(useToast());

// Props
const props = defineProps({
  name: { type: String, required: true },
});

// Data
const isWaiting = ref(false);
const isRunning = ref(false);
const runUid = ref('');
const steps = ref<any[]>([]);
const selectedItem = ref<any>(null);
const formTitle = computed(() => `${t('workflowRun')}: ${props.name}`);
const windowHeight = ref(window.innerHeight);
const listStyle = computed(() => ({ maxHeight: `${windowHeight.value - 200}px` }));

// Methods
async function checkAsync(): Promise<void> {
  if (!isRunning.value) {
    return;
  }

  isWaiting.value = true;
  const response = await provider.checkAsync(runUid.value);
  console.log(`Check ${new Date()}`, response);
  isWaiting.value = false;
  if (response.isOK) {
    // Sync steps status
    response.data.steps.forEach((item: any) => {
      const step = steps.value.find((s: any) => s.id === item.id);
      if (step) {
        step.status = item.status;
      }
    });

    if (response.data.status === 2) {
      isRunning.value = false;
      toastHelper.success('Workflow finished');
    } else if (response.data.status === 3) {
      isRunning.value = false;
      toastHelper.error('Workflow terminated');
    } else {
      // Start timer to call checkAsync after 0.3 seconds.
      setTimeout(async () => {
        await checkAsync();
      }, 300);
    }
  } else {
    toastHelper.error(response.message);
    console.error(response.presentation);
  }
}

function handleError(response: any): void {
  toastHelper.error(response.message);
  console.error(response.presentation);
}

// Event handlers
async function onRunClick(): Promise<void> {
  console.log('Run click');
  isWaiting.value = true;
  steps.value = [];
  const response = await provider.startAsync(props.name);
  console.log('Run result', response);
  isWaiting.value = false;

  if (response.isOK) {
    isRunning.value = true;
    runUid.value = response.data.runUid;
    steps.value = response.data.steps;

    await checkAsync();
  } else {
    handleError(response);
  }
}

async function onStopClick(): Promise<void> {
  console.log('Stop click');
  isWaiting.value = true;
  const response = await provider.terminateAsync(runUid.value);
  console.log('Terminate result', response);
  isWaiting.value = false;

  if (response.isOK) {
    if (response.data === true) {
      toastHelper.success('Workflow terminated');
      isRunning.value = false;
    } else {
      toastHelper.error('Cannot terminate workflow');
    }
  } else {
    handleError(response);
  }
}

// Life cycle hooks
</script>

<template>
  <!--View title-->
  <div class="grid">
    <div class="col">
      <ViewTitleComponent :title="formTitle" :is-waiting="isWaiting || isRunning" />
    </div>
  </div>

  <!--Command panel-->
  <div class="grid">
    <div class="col-12">
      <Button
        :label="$t('execute')"
        :disabled="isWaiting || isRunning"
        class="ml-1"
        severity="primary"
        outlined
        size="small"
        icon="pi pi-play"
        @click="onRunClick"
      />
      <Button
        v-if="isRunning"
        class="ml-1"
        severity="danger"
        size="small"
        icon="pi pi-stop"
        @click="onStopClick"
      />
    </div>
  </div>

  <!--Divider-->
  <div class="grid">
    <Divider class="m-2" />
  </div>

  <!--Content-->
  <div class="grid">
    <div class="col-4">

      <DataView :value="steps" style="border:1px solid #ececec">
        <template #empty>
          <div class="grid mt-1">
            <div class="col-12 text-center">
              Steps not loaded
            </div>
          </div>
        </template>

        <template #list="slotProps">
          <div class="grid grid-nogutter">
            <div v-for="(item, index) in slotProps.items" :key="item.id" class="col-12">
              <div style="border-bottom: 1px solid #ececec; font-size: 1rem; padding: 0.5rem">
                <Badge :value="index+1" severity="info"></Badge>
                <span class="ml-1">{{ item.title }}</span>
                <span class="pi pi-spin pi-spinner ml-2"
                      style="float:right" v-if="item.status == 2"></span>
                <span class="pi pi-check ml-2"
                      style="float:right"
                      v-if="item.status == 3"></span>
              </div>
            </div>
          </div>
        </template>
      </DataView>

    </div>
  </div>
</template>

<style scoped>

</style>
