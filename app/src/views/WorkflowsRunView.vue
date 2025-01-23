<script setup lang="ts">
import {
  ref, onMounted, onBeforeMount, defineProps, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
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
const formTitle = computed(() => `${t('workflowRun')}: ${props.name}`);

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
  const response = await provider.startAsync(props.name);
  console.log('Run result', response);
  isWaiting.value = false;

  if (response.isOK) {
    isRunning.value = true;
    runUid.value = response.data;

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
    <div class="col-12">
    </div>
  </div>
</template>

<style scoped>

</style>
